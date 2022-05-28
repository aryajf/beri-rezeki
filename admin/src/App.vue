<template>
    <div>
        <!-- SESSION EXPIRED MODAL -->
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
        
        <!-- DASHBOARD MENU -->
        <div v-if="authenticated">
            <DashboardMenu />
        </div>

        <vue-progress-bar></vue-progress-bar>
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
import { ref, computed, watch } from 'vue'
import appConfig from '@/config/app'
import { Modal } from 'bootstrap'
import DashboardMenu from '@/components/layouts/DashboardMenu.vue'
import store from '@/store'
import { useRoute } from 'vue-router'
const route = useRoute()

const authenticated = computed(() => store.getters['auth/authenticated'])
const user = computed(() => store.getters['auth/user'])

const tokenExpiredModal = ref(null)
const homeURL = ref(appConfig.homeURL)

watch(route, () => {
    checkToken()
})

const checkToken = () => {
    if (authenticated.value) {
        let now = new Date()
        let expired = new Date(user.value.data.token_expired_at) - now
        if (expired < 0) {
            var myModal = new Modal(tokenExpiredModal.value)
            myModal.show()
            store.dispatch('auth/logout')
        }
    }
}

const toLogin = () => {
    window.location.href = homeURL.value + '/login'
}
</script>

<style lang="scss">
@import '@/assets/sass/app.scss';
</style>
