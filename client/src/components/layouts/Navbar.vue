<template>
    <div>
        <!-- LOGOUT MODAL -->
        <LogoutModal />

        <!-- NAVBAR -->
        <header>
            <nav class="fixed-top">
                <div class="container-nav">
                    <div class="logo">
                        <a href="index.html"><img src="@/assets/images/logo/berirezeki.png" class="w-50"></a>
                    </div>
                    <button type="button" class="nav-toggler">
                        <span></span>
                    </button>
                    <div class="nav">
                        <ul>
                            <li><a href="payment.html">Transaksi <i class="fa-solid fa-arrow-right-arrow-left"></i></a></li>
                            <li><a href="#">Registrasi <i class="fa-solid fa-user-plus"></i></a></li>
                            <li><a href="login.html">Login <i class="fa-solid fa-arrow-right-to-bracket"></i></a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import useEmitter from '@/config/emitter'
import appConfig from '@/config/app'
import store from '@/store'
import LogoutModal from '@/components/modals/LogoutModal.vue'

const emitter = useEmitter()
const apiURL = ref(appConfig.apiURL)
const adminURL = ref(appConfig.adminURL)
const baseURL = ref(appConfig.baseURL)
let avatar = ref(null)

const authenticated = computed(() => store.getters['auth/authenticated'])
const user = computed(() => store.getters['auth/user'])

onMounted(() => {
    emitter.on('avatar', (item) => {
        avatar.value = item
    })
    const navToggler = document.querySelector(".nav-toggler");
    navToggler.addEventListener("click", navToggle);

    function navToggle() {
        console.log(navToggler)
        navToggler.classList.toggle("active");
        const nav = document.querySelector(".nav");
        nav.classList.toggle("open");
        if(nav.classList.contains("open")){
            nav.style.maxHeight = nav.scrollHeight + "px";
        }
        else{
            nav.removeAttribute("style");
        }
    } 
})
</script>

<style lang="scss" scoped>
@import '@/assets/sass/navbar.scss';
</style>
