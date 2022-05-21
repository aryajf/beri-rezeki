<template>
    <div id="login" class="d-flex justify-content-center align-items-center">
        <div class="col-md-3">
            <div class="text-center mb-3 mb-lg-5">
                <h3>Update Password</h3>
            </div>
            <form @submit.prevent="submit">
                <div class="form-group">
                    <div class="input-group">
                        <span class="input-group-text"><i class="uil uil-key-skeleton-alt"></i></span>
                        <input type="password" class="form-control" placeholder="New Password" :class="{'is-invalid': formErrors.newPassword && formErrors.newPassword.length > 0}" v-model="form.newPassword">
                    </div>
                    <div class="text-danger text-sm" v-if="formErrors.newPassword">*{{formErrors.newPassword[0]}}</div>
                </div>
                <div class="form-group">
                    <div class="input-group">
                        <span class="input-group-text"><i class="uil uil-lock"></i></span>
                        <input type="password" class="form-control" placeholder="Confirm Password" :class="{'is-invalid': formErrors.confirmNewPassword && formErrors.confirmNewPassword.length > 0}" v-model="form.confirmNewPassword">
                    </div>
                    <div class="text-danger text-sm" v-if="formErrors.confirmNewPassword">*{{formErrors.confirmNewPassword[0]}}</div>
                </div>
                <div class="form-group">
                    <button type="submit" class="btn btn-login w-100" :disabled="btnLoading">
                        <div class="d-flex justify-content-center">
                            <span>Simpan Password</span>
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
import { useRoute } from 'vue-router'
import Pulse from "@/components/loadings/Pulse.vue"
import store from '@/store'
import router from '@/router'
const route = useRoute()

const form = ref({
    newPassword: "",
    confirmNewPassword: "",
})

const btnLoading = computed(() => store.getters['btnLoading'])
const formErrors = computed(() => store.getters['formErrors'])

const submit = () => {
    const data = {
        email: route.params.email,
        token: route.params.token,
        credentials: form.value,
    }
    store.dispatch("auth/updatePassword", data).then(res => {
        if(res.status == 201){
            router.push("/login")
        }
    })
}
</script>

<style lang="scss">
@import "@/assets/sass/login_register.scss";
</style>