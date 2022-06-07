<template>
    <div class="row">
        <div class="col-12">
            <div class="form-group">
                <label for="">
                    Password lama
                    <span class="text-danger text-sm" v-if="formErrors.oldPassword">*{{formErrors.oldPassword[0]}}</span>
                </label>
                <input type="password" class="form-control" :class="{'is-invalid': formErrors.oldPassword && formErrors.oldPassword.length > 0}" placeholder="Masukkan password lama" v-model="form.oldPassword">
            </div>
            <div class="form-group">
                <label for="">
                    Password baru
                    <span class="text-danger text-sm" v-if="formErrors.newPassword">*{{formErrors.newPassword[0]}}</span>
                </label>
                <input type="password" class="form-control" :class="{'is-invalid': formErrors.newPassword && formErrors.newPassword.length > 0}" placeholder="Masukkan password baru" v-model="form.newPassword">
            </div>
            <div class="form-group">
                <label for="">
                    Konfirmasi Password
                    <span class="text-danger text-sm" v-if="formErrors.confirmNewPassword">*{{formErrors.confirmNewPassword[0]}}</span>
                </label>
                <input type="password" class="form-control" :class="{'is-invalid': formErrors.confirmNewPassword && formErrors.confirmNewPassword.length > 0}" placeholder="Konfirmasi password anda" v-model="form.confirmNewPassword">
            </div>

            <button @click="submit" class="btn bg-darkBlue btn-sm d-flex" :disabled="btnLoading">
                Simpan
                <template v-if="btnLoading">
                    <Pulse />
                </template>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import config from '@/config/app'
import Pulse from '@/components/loadings/Pulse.vue'
import store from '@/store'

const form = ref({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
})
const apiURL = ref(config.apiURL)

const btnLoading = computed(() => store.getters['btnLoading'])
const formErrors = computed(() => store.getters['formErrors'])

const submit = () => {
    store.dispatch('auth/changePassword', form.value).then((res) => {
        if (res.status == 201) {
            form.value.oldPassword = ''
            form.value.newPassword = ''
            form.value.confirmNewPassword = ''
        }
    })
}
</script>

<style lang="scss">
</style>