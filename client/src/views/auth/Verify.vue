<template>
    <div id="login" class="mt-3 d-flex justify-content-center align-items-center">
        <div class="col-md-4 mb-5">
            <div class="text-center mb-3 mb-lg-5">
                <div class="text-center"><img src="@/assets/images/verified.png" alt=""></div>
            </div>
            <div class="row">
                <div class="col-md-12 mb-2">
                <h4 class="text-center fw-bold">Akun berhasil diverifikasi</h4>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import store from '@/store'
import { useRoute } from 'vue-router'

const route = useRoute()

const verify = () => {
    store.dispatch("auth/verifyEmail", {
        email: route.params.email,
        token: route.params.token,
    })
}

onMounted(() => {
    verify()
})
</script>

<style lang="scss">
@import "@/assets/sass/login_register.scss";
</style>