<template>
    <div v-if="user">
        <Breadcrumb v-if="user" :user="user.nama" />
        <!-- SHOW PROFILE -->
        <div class="bg-white admin-wrapper">
            <AdminHeader />
            <div class="admin-body" v-if="user != null">
                <h1 class="admin-body-heading"><i class="uil uil-user me-1"></i>User Profile</h1>
                <div class="row">
                    <div class="col-xl-4 col-12">
                        <div class="col-md-12 user-info-left rounded shadow-sm">
                            <div class="avatar">
                                <template v-if="user.avatar == null">
                                    <img src="@/assets/images/no-avatar.png" class="rounded-circle shadow-sm" :alt="user.nama.split(' ').slice(0,2).join(' ')">
                                </template>
                                <template v-else>
                                    <img :src="`${apiURL}/images/avatars/${user.avatar}`" :alt="user.nama.split(' ').slice(0,2).join(' ')" class="rounded-circle shadow-sm">
                                </template>
                            </div>
                            <div class="text-center">
                                <small v-if="user.user_status == 'Verified'" class="badge bg-outline-green ms-1"><i class="uil uil-check me-1"></i>Verified Account</small>
                                <small v-else class="badge bg-outline-red ms-1"><i class="uil uil-times-circle me-1"></i>Unverified Account</small>
                            </div>
                            <p class="text-wa">{{user.nama}}</p>
                        </div>
                    </div>

                    <div class="col-xl-8 col-12">
                        <div class="profile-menu">
                            <button class="active" id="btn-biodata" @click="changePage('biodata')">
                                <i class="uil uil-user-circle me-1"></i>Biodata User
                            </button>
                        </div>

                        <template v-if="page == 'biodata'">
                            <p class="profile-item">
                                <span><i class="uil uil-at me-1"></i>Alamat Email</span>
                                <small v-if="user.email_status == 'Verified'" class="badge bg-outline-green ms-1"><i class="uil uil-check-circle me-1"></i>{{user.email_status}}</small>
                                <small v-else class="badge bg-outline-red ms-1"><i class="uil uil-times-circle me-1"></i>{{user.email_status}}</small>
                                <br>
                                {{ user.email }} <br>
                                <a :href="'mailto:'+user.email" class="badge bg-outline-blue text-decoration-none">Send email<i class="uil uil-share ms-1"></i></a>
                            </p>

                            <p class=" profile-item">
                                <span><i class="uil uil-user-md me-1"></i>Nama Lengkap</span> <br>
                                {{ user.nama }}
                            </p>

                            <p class="profile-item">
                                <span><i class="uil uil-phone-alt me-1"></i>No. Telp</span> <br>
                                <template v-if="user.no_telp != null">{{ user.no_telp }}</template>
                                <template v-else><span class="text-secondary fw-normal">Belum ditambahkan</span></template>
                            </p>

                            <p class="profile-item">
                                <span><i class="uil uil-calendar-alt me-1"></i>Terdaftar pada</span> <br>
                                {{DateFormat(user.createdAt)}}
                            </p>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import config from '@/config/app'
import AdminHeader from '@/components/layouts/AdminHeader.vue'
import Breadcrumb from '@/components/layouts/Breadcrumb.vue'
import Pulse from '@/components/loadings/Pulse.vue'
import Mixins from '@/mixins'
export default {
    mixins: [Mixins],
    data() {
        return {
            apiURL: config.apiURL,
            page: 'biodata',
        }
    },
    components: { AdminHeader, Breadcrumb, Pulse },
    computed: {
        ...mapGetters({
            btnLoading: 'btnLoading',
            formErrors: 'formErrors',
            user: 'user/user',
        }),
    },
    created() {
        this.$store.dispatch('user/showUser', this.$route.params.id)
    },
    methods: {
        changePage(e) {
            let btnBiodata = document.getElementById('btn-biodata')

            if (e == 'biodata') {
                this.page = 'biodata'
                btnBiodata.classList.add('active')
            }
        },
    },
}
</script>

<style lang="scss">
@import '@/assets/sass/admin.scss';
@import '@/assets/sass/profileUser.scss';
</style>