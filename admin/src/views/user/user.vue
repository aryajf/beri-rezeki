<template>
    <div>
        <Breadcrumb />
        <CreateUser />
        <DeleteModal :user_id="user_id"></DeleteModal>
        <div class="bg-white admin-wrapper">
            <AdminHeader />
            <div class="admin-body">
                <div class="row">
                    <div class="col-xl-9 col-12 top-button">
                        <a href="#" class="btn bg-wa btn-sm" data-bs-toggle="modal" data-bs-target="#createUserModal"><i class="uil uil-plus"></i> Daftarkan User
                        </a>
                    </div>
                    <div class="col-xl-3 col-12 top-form-search">
                        <form action="#">
                            <div class="form-group">
                                <div class="input-group">
                                    <input v-model="keyword" type="text" class="form-control" placeholder="Cari disini...">
                                    <span class="input-group-text">
                                        <template v-if="!btnLoading">
                                            <i class="uil uil-search"></i>
                                        </template>
                                        <template v-else>
                                            <Pulse />
                                        </template>
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="admin-panel-responsive">
                    <div class="admin-panel">
                        <router-link to="/user" class="btn btn-sm"><i class="uil uil-users-alt me-1"></i>
                            All Users <span class="badge bg-wa ms-1">{{users.totalItems}}</span>
                        </router-link>
                    </div>
                </div>

                <template v-if="users.users && users.totalItems != 0">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col" class="th-avatar"><i class="uil uil-user-circle me-1"></i>Avatar</th>
                                    <th scope="col" class="th-nama"><i class="uil uil-user me-1"></i>Nama Lengkap</th>
                                    <th scope="col" class="th-email"><i class="uil uil-at me-1"></i>Email</th>
                                    <th scope="col" class="th-alamat"><i class="uil uil-sign-alt me-1"></i>Alamat Tinggal</th>
                                    <th scope="col" class="th-aksi">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in users.users" :key="item.id">
                                    <td class="fw-bold">{{ index+1 }}</td>
                                    <td align="center">
                                        <template v-if="item.avatar == null">
                                            <img src="@/assets/images/no-avatar.png" class="w-100 rounded-circle shadow-sm" :alt="item.nama.split(' ').slice(0,2).join(' ')">
                                        </template>
                                        <template v-else>
                                            <img :src="`${apiURL}/images/avatars/${item.avatar}`" :alt="item.nama.split(' ').slice(0,2).join(' ')" class="w-100 rounded-circle shadow-sm">
                                        </template>
                                    </td>
                                    <td>
                                        <router-link :to="'/user/'+item.id" class="d-block text-decoration-none text-wa mb-1">
                                            {{item.nama}}
                                        </router-link>
                                        <span class="badge bg-outline-green" v-if="item.user_status == 'Verified'">
                                            <i class="uil uil-check-circle me-1"></i>{{item.user_status}}
                                        </span>
                                        <span class="badge bg-outline-red" v-else-if="item.user_status == 'Unverified'">
                                            <i class="uil uil-times-circle me-1"></i>{{item.user_status}}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="d-block mb-1">{{item.email}}</span>
                                        <span class="badge bg-outline-green" v-if="item.email_status == 'Verified'">
                                            <i class="uil uil-check-circle me-1"></i>{{item.email_status}}
                                        </span>
                                        <span class="badge bg-outline-red" v-else-if="item.email_status == 'Unverified'">
                                            <i class="uil uil-times-circle me-1"></i>{{item.email_status}}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="mb-1">
                                            <span v-if="item.alamat != null">{{item.alamat}}</span>
                                            <span v-else class="text-secondary">Alamat belum diisi</span>
                                        </div>

                                        <div>
                                            <span class="badge bg-light text-dark">
                                                <i class="uil uil-phone-alt me-1"></i>
                                                <template v-if="item.no_telp != null">{{item.no_telp}}</template>
                                                <template v-else>Belum diisi</template>
                                            </span>
                                        </div>
                                    </td>
                                    <td align="center">
                                        <router-link :to="'/user/'+item.id" class="text-dark fs-4">
                                            <i class="uil uil-eye"></i>
                                        </router-link>
                                        <a href="#" class="text-danger fs-4" @click.prevent="getDeleteModal(item.id)" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="uil uil-trash-alt"></i></a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <Paginator v-if="users.totalPages >= 2" @page="changePage($event)" v-model:rows="users.limitItems" :totalRecords="users.totalItems" />
                </template>
                <Message v-else severity="info" :closable="false">{{users.message}}</Message>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AdminHeader from '@/components/layouts/AdminHeader.vue'
import Breadcrumb from '@/components/layouts/Breadcrumb.vue'
import Pulse from '@/components/loadings/Pulse.vue'
import DeleteModal from '@/components/modals/DeleteModal.vue'
import CreateUser from '@/views/user/CreateUser.vue'
import config from '@/config/app'
import Mixins from '@/mixins'

export default {
    mixins: [Mixins],
    data() {
        return {
            apiURL: config.apiURL,
            user_id: null,
            keyword: null,
            paginationSearch: false,
            type: null,
            status: null,
        }
    },
    watch: {
        keyword() {
            this.search()
        },
    },
    computed: {
        ...mapGetters({
            btnLoading: 'btnLoading',
            users: 'user/users',
            users_verified: 'user/users_verified',
            users_unverified: 'user/users_unverified',
            contact: 'contact/contact',
        }),
    },
    components: {
        AdminHeader,
        CreateUser,
        Pulse,
        DeleteModal,
        Breadcrumb,
    },
    created() {
        this.getUsers()
        this.getStatusUsers({ status: 'verified' })
        this.getStatusUsers({ status: 'unverified' })
        this.getContact()
    },
    methods: {
        getDeleteModal(id) {
            this.user_id = id
        },
        getUsers() {
            this.paginationSearch = false
            this.$store.dispatch('user/getUsers')
        },
        getStatusUsers(data) {
            this.$store.dispatch('user/getStatusUsers', data)
        },
        getContact() {
            this.$store.dispatch('contact/getContact')
        },
        changePage(event) {
            if (this.paginationSearch == true) {
                const data = { keyword: this.keyword, page: event.page }
                this.$store.dispatch('user/searchUsers', data)
            } else {
                this.$store.dispatch('user/getUsers', event.page)
            }
        },
        search() {
            this.paginationSearch = true
            if (this.keyword != '') {
                this.$store.dispatch('user/searchUsers', {
                    keyword: this.keyword,
                })
            } else {
                this.getUsers()
            }
        },
    },
}
</script>

<style lang="scss">
@import '@/assets/sass/admin.scss';
</style>