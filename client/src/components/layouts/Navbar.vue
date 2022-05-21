<template>
    <div>
        <!-- LOGOUT MODAL -->
        <LogoutModal />

        <!-- NAVBAR -->
        <nav class="navbar navbar-expand-lg navbar-light">
            <div class="container">
                <router-link class="navbar-brand" to="/">
                    <img src="@/assets/images/logo.png" alt="logo" width="140" class="d-inline-block">
                </router-link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/" exact><i class="uil uil-estate me-1"></i>Home</router-link>
                        </li>
                        <template v-if="authenticated">
                            <li class="nav-item" v-if="user.role == 'Admin'">
                                <a class="nav-link" :href="adminURL"><i class="uil uil-create-dashboard me-1"></i>
                                    Manage
                                </a>
                            </li>
                            <li v-if="user.nama" class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <template v-if="avatar != null">
                                        <img :src="apiURL+'images/avatar/'+avatar" class="rounded-circle avatar shadow-sm" alt="Foto User">
                                    </template>
                                    <template v-else-if="user.avatar == null">
                                        <img src="@/assets/images/no-avatar.png" class="rounded-circle avatar shadow-sm" alt="Foto User">
                                    </template>
                                    <template v-else>
                                        <img v-if="user.auth_type == 'Local'" :src="apiURL+'images/avatar/'+user.avatar" class="rounded-circle avatar shadow-sm" alt="Foto User">
                                        <img v-else :src="user.avatar" class="rounded-circle avatar shadow-sm" alt="Foto User">
                                    </template>
                                    {{ user.nama.split(' ').slice(0,2).join(' ') }}
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li>
                                        <router-link class="dropdown-item" :to="baseURL + '/profile'"><i class="uil uil-user-md me-1"></i>My Profile</router-link>
                                    </li>
                                    <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#signoutModal"><i class="uil uil-sign-out-alt me-1"></i>Logout</a></li>
                                </ul>
                            </li>
                        </template>
                        <template v-else>
                            <li class="nav-item">
                                <router-link class="nav-link" to="/register"><i class="uil uil-user-plus me-1"></i>Register</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" to="/login"><i class="uil uil-sign-out-alt me-1"></i>Login</router-link>
                            </li>
                        </template>
                    </ul>
                </div>
            </div>
        </nav>
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

    let nav = document.querySelector('.navbar')
    window.onscroll = function () {
        let scrollPoint = window.scrollY
        if (scrollPoint > 80) {
            nav.classList.add('nav-active')
        } else {
            nav.classList.remove('nav-active')
        }
    }
})
</script>

<style lang="scss" scoped>
@import '@/assets/sass/navbar.scss';
</style>
