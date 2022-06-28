<template>
    <div>
        <vue-progress-bar></vue-progress-bar>
        
        <ConfirmDialog :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}"></ConfirmDialog>
        <!-- TOKEN EXPIRED MODAL -->
        <div class="modal fade" ref="tokenExpiredModal" id="tokenExpiredModal" tabindex="-1" aria-labelledby="tokenExpiredModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="tokenExpiredModalLabel"><i class="uil uil-bell me-2"></i>Pemberitahuan</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Session anda telah berakhir, harap login kembali untuk melanjutkan
                    </div>
                    <div class="modal-footer">
                        <a @click="toLogin" data-bs-dismiss="modal" class="btn btn-sm btn-primary">Login</a>
                    </div>
                </div>
            </div>
        </div>

        <!-- WHATSAPP CHAT -->
        <WhatsappChat />

        <!-- NAVBAR -->
        <Navbar v-if="showNavbar()" />

        <!-- ROUTER VIEW -->
        <router-view v-slot="{Component}">
            <component :is='Component'></component>
        </router-view>

        <!-- FOOTER -->
        <Footer v-if="showFooter()" />
    </div>
</template>

<script>
export default {
    mounted() {
        this.$Progress.finish();
    },
    created() {
        this.$Progress.start();

        this.$router.beforeEach((to, from, next) => {
            if (to.meta.progress !== undefined) {
                let meta = to.meta.progress;
                this.$Progress.parseMeta(meta);
            }
            this.$Progress.start();
            next();
        });

        this.$router.afterEach((to, from) => {
            this.$Progress.finish();
        });
    },
}
</script>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Modal } from 'bootstrap'
import { useRoute } from 'vue-router'
import Navbar from '@/components/layouts/Navbar.vue'
import Footer from '@/components/layouts/Footer.vue'
import WhatsappChat from '@/components/layouts/WhatsappChat.vue'
import store from '@/store'
import router from '@/router'
const route = useRoute()

const authenticated = computed(() => store.getters['auth/authenticated'])
const user = computed(() => store.getters['auth/user'])

const tokenExpiredModal = ref(null)

watch(route, () => {
    checkToken()
})

const checkToken = () => {
    if (authenticated.value) {
        let now = new Date()
        let expired = new Date(user.value.token_expired_at) - now
        if (expired < 0) {
            var myModal = new Modal(tokenExpiredModal.value)
            myModal.show()
            store.dispatch('auth/logout')
        }
    }
}

const showNavbar = () => {
    let url = route.name
    if(url == 'Home' || url == 'Login' || url == 'Register' || url == 'Profile' || url == 'Pending' || url == 'Accepted' || url == 'ShowPayment' || url == 'Donate'){
        return true
    }
    return false
}
const showFooter = () => {
    let url = route.name
    if(url == 'Home' || url == 'Login' || url == 'Register' || url == 'Profile' || url == 'Pending' || url == 'Accepted' || url == 'ShowPayment' || url == 'Donate' || url == 'Show'){
        return true
    }
    return false
}

const toLogin = () => {
    router.push({ name: 'Login' })
}
</script>

<style lang="scss">
@import '@/assets/sass/app.scss';
.route-enter-from {
    opacity: 0;
    transform: translate(0, 25px);
}
.route-enter-active {
    transition: all 0.3s ease-out;
}
.route-leave-to {
    opacity: 0;
    transform: translateX(0, -25px);
}
.route-leave-active {
    transition: all 0.3s ease-in;
}
</style>