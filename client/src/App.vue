<template>
    <div>
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

        <!-- CONTENT -->
        <Navbar />

        <!-- ROUTER VIEW -->
        <router-view v-slot="{Component}">
            <transition name="route" mode="out-in">
                <component :is='Component'></component>
            </transition>
        </router-view>

        <!-- FOOTER -->
        <Footer />
    </div>
</template>

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