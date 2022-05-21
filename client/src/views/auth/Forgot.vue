<template>
    <div id="login" class="d-flex justify-content-center align-items-center">
        <div class="col-md-3">
            <div class="text-center mb-3 mb-lg-5">
                <h3>Reset Password</h3>
                <small class="text-muted">Enter your email address below for reset password</small>
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
                    <button type="submit" class="btn btn-login w-100" :disabled="btnLoading">
                        <div class="d-flex justify-content-center">
                            <span>Send Password Reset Link</span>
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
import Pulse from "@/components/loadings/Pulse.vue"
import store from '@/store'

const form = ref({
    email: "",
})

const btnLoading = computed(() => store.getters['btnLoading'])
const formErrors = computed(() => store.getters['formErrors'])

const submit = () => {
    store.dispatch("auth/forgotPasswordRequest", form.value)
}
</script>

<style lang="scss">
@import "@/assets/sass/login_register.scss";
</style>