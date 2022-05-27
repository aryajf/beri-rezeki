<template>
    <div id="login">
        <div class=" col-md-3">
            <div class="text-center mb-3">
                <h3>Log in to your account</h3>
                <small class="text-muted">Masukkan informasi akun dibawah</small>
            </div>
            <form @submit.prevent="submit">
                <div class="form-group">
                    <div class="input-group">
                        <span class="input-group-text"><i class="uil uil-at"></i></span>
                        <input type="email" class="form-control" placeholder="E-Mail Address" :class="{'is-invalid': formErrors.email && formErrors.email.length > 0}" v-model="form.email">
                    </div>
                    <div class="text-danger text-sm" v-if="formErrors.email">*{{formErrors.email[0]}}</div>
                </div>

                <div class="form-group">
                    <div class="input-group">
                        <span class="input-group-text"><i class="uil uil-lock"></i></span>
                        <input type="password" class="form-control" placeholder="Password" :class="{'is-invalid': formErrors.password && formErrors.password.length > 0}" v-model="form.password">
                    </div>
                    <div class="text-danger text-sm" v-if="formErrors.password">*{{formErrors.password[0]}}</div>
                </div>

                <div class="form-group">
                    <button type="submit" class="btn btn-login w-100" :disabled="btnLoading">
                        <div class="d-flex justify-content-center">
                            <span>Login</span>
                            <span v-if="btnLoading" class="ms-1">
                                <Pulse />
                            </span>
                        </div>
                    </button>
                </div>

                <div class="form-group">
                    <router-link class="link" to="/forgot"><small>Saya lupa password</small></router-link><br>
                    Belum punya akun? <router-link class="link" to="/register"><small>Daftar akun disini</small></router-link>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
export default {
    methods: {
    },
}
</script>
<script setup>
import { ref, computed, onMounted } from 'vue'
import store from '@/store'
import appConfig from '@/config/app'
import Pulse from '@/components/loadings/Pulse.vue'

const form = ref({
    email: '',
    password: '',
})

const btnLoading = computed(() => store.getters['btnLoading'])
const formErrors = computed(() => store.getters['formErrors'])

const submit = () => {
    store.dispatch('auth/login', form.value)
}
</script>

<style lang="scss">
@import '@/assets/sass/login_register.scss';
</style>