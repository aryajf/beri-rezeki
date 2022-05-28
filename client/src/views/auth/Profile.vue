<template>
    <div>
        <!-- LOGOUT MODAL -->
        <LogoutModal />

        <!-- UPLOAD IMAGE MODAL -->
        <ImageCropper />

        <!-- PROFILE -->
        <div class="profile-wrapper">
            <div class="col-md-8 profile-wrapper-spacing">
                <div class="row">
                    <div class="col-md-4 profile-left">
                        <div class="col-md-12 user-info rounded shadow-sm">
                            <div class="text-center">
                                Online berakhir dalam
                                <span class="fw-bold d-block">
                                    <vue-countdown v-if="user.token_expired_at" :time="countDown(user.token_expired_at)" v-slot="{ hours, minutes, seconds }">{{ hours }} jam, {{ minutes }} menit, {{ seconds }} detik.</vue-countdown>
                                </span>
                            </div>
                            <div class="avatar">
                                <button class="btn rounded-circle shadow" data-bs-toggle="modal" data-bs-target="#avatarModal"><i class="uil uil-pen"></i></button>
                                <template v-if="avatar != null">
                                    <img :src="apiURL+'images/avatar/'+avatar" class="rounded-circle shadow-sm" alt="Foto User">
                                </template>
                                <template v-else-if="user.avatar == null">
                                    <img src="@/assets/images/no-avatar.png" class="rounded-circle shadow-sm" alt="Foto User">
                                </template>
                                <template v-else>
                                    <img :src="apiURL+'images/avatar/'+user.avatar" class="rounded-circle shadow-sm" alt="Foto User">
                                </template>
                            </div>
                            <div class="text-center">
                                <small v-if="user.user_status == 'Verified'" class="badge bg-outline-green ms-1"><i class="uil uil-check me-1"></i>Verified Account</small>
                                <small v-else class="badge bg-outline-red ms-1"><i class="uil uil-times-circle me-1"></i>Unverified Account</small>
                            </div>
                            <p>{{user.nama}}</p>
                            <div class="action col-md-12">
                                <button class="btn btn-sm bg-red" data-bs-toggle="modal" data-bs-target="#signoutModal">
                                    <i class="uil uil-sign-out-alt me-1"></i>Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-8 profile-right">
                        <div class="profile-menu">
                            <button id="btn-biodata" class="active" @click="changePage('biodata')">
                                <i class="uil uil-user me-1"></i>Biodata Diri
                            </button>
                            <button id="btn-edit" @click="changePage('edit')">
                                <i class="uil uil-edit me-1"></i>Edit Profil
                            </button>
                        </div>

                        <template v-if="page == 'biodata'">
                            <template v-if="user.user_status != 'Verified'">
                                <p v-if="user.no_telp == null && user.alamat == null" class="alert bg-outline-blue">
                                    <i class="uil uil-exclamation-circle me-1"></i>Silahkan lengkapi data diri anda agar akun terverifikasi. <span class="fw-bold cursor-pointer" @click="changePage('edit')">Lengkapi disini</span>
                                </p>
                            </template>

                            <p class="profile-item">
                                <span><i class="uil uil-at me-1"></i>Alamat Email</span>
                                <small v-if="user.email_status == 'Verified'" class="badge bg-outline-green ms-1"><i class="uil uil-check-circle me-1"></i>{{user.email_status}}</small>
                                <small v-else class="badge bg-outline-red ms-1"><i class="uil uil-times-circle me-1"></i>{{user.email_status}}</small>
                                <br>
                                {{ user.email }}
                            </p>

                            <p class=" profile-item">
                                <span><i class="uil uil-user-md me-1"></i>Nama Lengkap</span> <br>
                                {{ user.nama }}
                            </p>

                            <p class="profile-item">
                                <span><i class="uil uil-map-pin-alt me-1"></i>Alamat</span> <br>
                                <template v-if="user.alamat != null">{{ user.alamat }}</template>
                                <template v-else><span class="text-secondary fw-normal">Belum ditambahkan</span></template>
                            </p>

                            <p class="profile-item">
                                <span><i class="uil uil-phone-alt me-1"></i>No. Telp</span> <br>
                                <template v-if="user.no_telp != null">{{ user.no_telp }}</template>
                                <template v-else><span class="text-secondary fw-normal">Belum ditambahkan</span></template>
                            </p>
                        </template>

                        <template v-else-if="page == 'edit'">
                            <p v-if="user.no_telp == null && user.alamat == null " class="alert bg-outline-blue">
                                <i class="uil uil-exclamation-circle me-1"></i>Silahkan lengkapi data diri anda
                            </p>
                            <form @submit.prevent="submit">
                                <div class="form-group">
                                    <label>Alamat Email</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="uil uil-at"></i></span>
                                        <input type="email" class="form-control cursor-not-allowed" :placeholder="user.email" disabled>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label>
                                        Nama Lengkap
                                        <span class="text-danger text-sm" v-if="formErrors.nama">*{{formErrors.nama[0]}}</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="uil uil-user-md"></i></span>
                                        <input type="text" class="form-control" :class="{'is-invalid': formErrors.nama && formErrors.nama.length > 0}" v-model="user.nama">
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label>
                                        No. Telepon
                                        <span class="text-danger text-sm" v-if="formErrors.no_telp">*{{formErrors.no_telp[0]}}</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="uil uil-phone-alt"></i></span>
                                        <input type="text" class="form-control" :class="{'is-invalid': formErrors.no_telp && formErrors.no_telp.length > 0}" v-model="user.no_telp" placeholder="Masukkan nomor telepon">
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label>
                                        Alamat
                                        <span class="text-danger text-sm" v-if="formErrors.alamat">*{{formErrors.alamat[0]}}</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="uil uil-map-pin-alt"></i></span>
                                        <textarea class="form-control" :class="{'is-invalid': formErrors.alamat && formErrors.alamat.length > 0}" v-model="user.alamat" placeholder="Masukkan alamat anda"></textarea>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <a href="#" @click="changePage('password')" class="text-decoration-none text-secondary">
                                        <small><i class="uil uil-lock"></i> Klik disini untuk mengubah password anda</small>
                                    </a>
                                </div>

                                <div class="form-group">
                                    <button type="submit" class="btn btn-sm bg-darkBlue d-flex" :disabled="btnLoading">
                                        <span>Simpan</span>
                                        <template v-if="btnLoading">
                                            <Pulse />
                                        </template>
                                    </button>
                                </div>
                            </form>
                        </template>

                        <template v-else-if="page == 'password'">
                            <a @click="changePage('edit')" class="text-decoration-none mb-3 d-inline-block cursor-pointer"><i class="uil uil-angle-left-b me-1"></i>Kembali</a>
                            <ChangePassword />
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import useEmitter from '@/config/emitter'
import appConfig from '@/config/app'
import store from '@/store'
import Pulse from '@/components/loadings/Pulse.vue'
import LogoutModal from '@/components/modals/LogoutModal.vue'
import ChangePassword from '@/views/auth/ChangePassword.vue'
import ImageCropper from '@/components/layouts/ImageCropper.vue'

const emitter = useEmitter()

const apiURL = ref(appConfig.apiURL)
const page = ref('biodata')
let avatar = ref(null)

const btnLoading = computed(() => store.getters['btnLoading'])
const formErrors = computed(() => store.getters['formErrors'])
const authenticated = computed(() => store.getters['auth/authenticated'])
const user = computed(() => store.getters['auth/user'])

const changePage = (e) => {
    let btnBiodata = document.getElementById('btn-biodata')
    let btnEdit = document.getElementById('btn-edit')

    if (e == 'biodata') {
        page.value = 'biodata'
        btnBiodata.classList.add('active')
        btnEdit.classList.remove('active')
    } else if (e == 'edit') {
        page.value = 'edit'
        btnBiodata.classList.remove('active')
        btnEdit.classList.add('active')
    } else if (e == 'password') {
        page.value = 'password'
        btnBiodata.classList.remove('active')
        btnEdit.classList.remove('active')
    }
}

onMounted(() => {
    emitter.on('avatar', (item) => {
        avatar.value = item
    })
})

const submit = () => {
    store.dispatch('auth/updateProfile', user.value)
}
</script>
<style lang="scss">
@import '@/assets/sass/profile.scss';
</style>