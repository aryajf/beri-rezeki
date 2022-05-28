<template>
    <div id="verify" class="mt-3 d-flex justify-content-center align-items-center">
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
#verify {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;

    .input-group-text {
        background-color: #fff;
    }

    input[type="text"]:focus,
    input[type="email"]:focus,
    input[type="password"]:focus {
        border-color: #ccc;
        box-shadow: 0 0 0 #ccc inset, 0 0 0 #ccc;
        outline: 0 none;
    }
}
@media screen and (max-width: 768px) {
    #verify{
        padding: 12vh 10px 0 10px;
    }

}
</style>