<template>
    <div>
        <!-- LOGOUT MODAL -->
        <LogoutModal />

        <!-- NAVBAR -->
        <header>
            <nav class="fixed-top">
                <div class="container-nav" v-if="authenticated">
                    <div class="logo">
                        <router-link to="/"><img src="@/assets/images/logo/berirezeki.png"></router-link>
                    </div>
                    <div class="text-end akun d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                        <p class="mb-0 me-2 nama-akun">{{authenticated.nama}}</p>
                        <a href="#" class="link-dark text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                        <img v-if="authenticated.avatar" :src="apiURL+'images/avatar/'+authenticated.avatar" alt="" width="32" height="32" class="rounded-circle">
                        <img v-else src="@/assets/images/no-avatar.png" alt="" width="32" height="32" class="rounded-circle">
                        </a>
                        <ul class="dropdown-menu text-small text-end" aria-labelledby="dropdownUser1" style="padding:0;">
                            <li><router-link class="dropdown-item" to="/">Beranda</router-link></li>
                            <li><router-link class="dropdown-item" to="/pending">Transaksi</router-link></li>
                            <li><a class="dropdown-item" href="#footer">Kontak</a></li>
                            <li><a class="dropdown-item" href="#">Tentang</a></li>
                            <li><hr class="dropdown-divider" style="margin:0;padding:0;"></li>
                            <li><a href="#" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#logoutModal">Sign out</a></li>
                        </ul>
                    </div>
                </div>
                <div class="container-nav" v-else>
                    <div class="logo">
                        <router-link to="/"><img src="@/assets/images/logo/berirezeki.png" class="img-fluid"></router-link>
                    </div>
                    <button type="button" class="nav-toggler">
                        <span></span>
                    </button>
                    <div class="nav">
                        <ul>
                            <li><router-link to="/">Home <i class="fa-solid fa-home"></i></router-link></li>
                            <li><router-link to="/register">Registrasi <i class="fa-solid fa-user-plus"></i></router-link></li>
                            <li><router-link to="/login">Login <i class="fa-solid fa-arrow-right-to-bracket"></i></router-link></li>
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
    // emitter.on('avatar', (item) => {
    //     avatar.value = item
    // })
    if(!authenticated.value){
        const navToggler = document.querySelector(".nav-toggler");
        navToggler.addEventListener("click", navToggle);
    
        function navToggle() {
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
    }
})
</script>

<style lang="scss" scoped>
@import '@/assets/sass/navbar.scss';
</style>
