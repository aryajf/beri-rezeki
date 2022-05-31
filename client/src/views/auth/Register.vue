<template>
    <div id="register">
        <div class="col-md-3">
            <div class="text-center mb-3">
                <h3>Register your account</h3>
                <small class="text-muted">Masukkan informasi profil dibawah</small>
            </div>
            <form @submit.prevent="submit">
                <div class="form-group">
                    <div class="input-group">
                        <span class="input-group-text"><i class="uil uil-user"></i></span>
                        <input type="text" class="form-control" placeholder="Nama" :class="{'is-invalid': formErrors.nama && formErrors.nama.length > 0}" v-model="form.nama">
                    </div>
                    <div class="text-danger text-sm" v-if="formErrors.nama">*{{formErrors.nama[0]}}</div>
                </div>
                <div class="form-group">
                    <div class="input-group">
                        <span class="input-group-text"><i class="uil uil-phone"></i></span>
                        <input type="number" class="form-control" placeholder="Nomor Telepon" :class="{'is-invalid': formErrors.no_telp && formErrors.no_telp.length > 0}" v-model="form.no_telp">
                    </div>
                    <div class="text-danger text-sm" v-if="formErrors.no_telp">*{{formErrors.no_telp[0]}}</div>
                </div>

                <div class="form-group">
                    <div class="input-group">
                        <span class="input-group-text"><i class="uil uil-at"></i></span>
                        <input type="email" class="form-control" placeholder="E-Mail Address" :class="{'is-invalid': formErrors.email && formErrors.email.length > 0}" v-model="form.email">
                    </div>
                    <div id="emailHelp" class="form-text">Email tidak dibagikan kepada siapapun</div>
                    <div class="text-danger text-sm" v-if="formErrors.email">*{{formErrors.email[0]}}</div>
                </div>

                <div class="form-group">
                    <div class="input-group">
                        <span class="input-group-text"><i class="uil uil-key-skeleton-alt"></i></span>
                        <input type="password" class="form-control" placeholder="Password" :class="{'is-invalid': formErrors.password && formErrors.password.length > 0}" v-model="form.password">
                    </div>
                    <div class="text-danger text-sm" v-if="formErrors.password">*{{formErrors.password[0]}}</div>
                </div>

                <div class="form-group">
                    <div class="input-group">
                        <span class="input-group-text"><i class="uil uil-lock"></i></span>
                        <input type="password" class="form-control" placeholder="Confirm Password" :class="{'is-invalid': formErrors.confirmPassword && formErrors.confirmPassword.length > 0}" v-model="form.confirmPassword">
                    </div>
                    <div class="text-danger text-sm" v-if="formErrors.confirmPassword">*{{formErrors.confirmPassword[0]}}</div>
                </div>

                <div class="form-group">
                    Sudah punya akun ? <router-link class="link" to="/login"><small>Login Akun disini</small></router-link>
                </div>

                <div class="form-group">
                    <button type="submit" class="btn btn-login w-100" :disabled="btnLoading">
                        <div class="d-flex justify-content-center">
                            <span>Register Account</span>
                            <span v-if="btnLoading" class="ms-1">
                                <Pulse />
                            </span>
                        </div>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import store from '@/store'
import appConfig from '@/config/app'
import Pulse from '@/components/loadings/Pulse.vue'

const form = ref({
    nama: '',
    email: '',
    password: '',
    confirmPassword: '',
})

const btnLoading = computed(() => store.getters['btnLoading'])
const formErrors = computed(() => store.getters['formErrors'])

const submit = () => {
    store.dispatch('auth/register', form.value)
}
</script>

<style lang="scss">
@import '@/assets/sass/login_register.scss';
</style>