<template>
    <div v-if="type && status">
        <Breadcrumb :produk="type" :status="status" />
        <div class="bg-white admin-wrapper">
            <AdminHeader />
            <div class="admin-body">
                <div class="row">
                    <div class="col-xl-9 col-12 top-button">
                    </div>
                    <div class="col-xl-3 col-12 top-form-search">
                        <form action="#">
                            <div class="form-group">
                                <div class="input-group">
                                    <input v-model="keyword" type="text" class="form-control" placeholder="Cari disini...">
                                    <span class="input-group-text"><i class="uil uil-search"></i><span v-if="btnLoading" class="ms-1">
                                            <Pulse />
                                        </span></span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="admin-panel-responsive">
                    <div class="admin-panel">
                        <router-link to="/program/accepted" class="btn btn-sm">
                            <i class="uil uil-file-bookmark-alt me-1"></i>
                            Program <span class="badge bg-wa ms-2">{{payments.totalItems}}</span>
                        </router-link>
                    </div>
                </div>
                <Message v-if="payments.status == false" severity="info" :closable="false">{{payments.message}}</Message>
                <div class="row" v-else>
                    <div class="table-responsive mb-3">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col" class="th-cover"><i class="uil uil-image me-2"></i>Cover</th>
                                    <th scope="col" class="th-judul"><i class="uil uil-file me-2"></i>Program</th>
                                    <th scope="col" class="th-pembeli"><i class="uil uil-user me-2"></i>Pembeli</th>
                                    <th scope="col" class="th-kode-order"><i class="uil uil-invoice me-2"></i>Kode Order</th>
                                    <th scope="col" class="th-aksi">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(payment, index) in payments.payments" :key="payment.id">
                                    <td class="fw-bold">{{ index+1 }}</td>
                                    <template v-if="payment">
                                        <template v-if="payment.program !== null">
                                            <td v-if="payment.program">
                                                <img v-if="payment.program.cover" :src="`${apiURL}images/programs/${payment.program.cover}`" :alt="payment.program.title" class="w-100 rounded">
                                            </td>
                                            <td v-if="payment.program">
                                                <span class="d-block mb-1">{{payment.program.title}}</span>
                                                <span class="badge bg-sm">Rp{{NumberFormat(payment.total_harga)}}</span>
                                            </td>
                                            <td>
                                                <span v-if="payment.user" class="d-block mb-1">
                                                    <router-link :to="'/user/'+payment.user.id" class="text-decoration-none text-wa">{{payment.user.nama}}</router-link>
                                                </span>
                                                <span v-else class="d-block mb-1">
                                                    <router-link :to="'/user/'+payment.user_id" class="text-decoration-none text-wa">Akun sudah dihapus</router-link>
                                                </span>
                                                <a :href="'mailto:'+payment.user.email" target="_blank" v-if="payment.user" class="badge bg-success me-1">
                                                    <i class="uil uil-envelope-alt me-1"></i>{{payment.user.email}}
                                                </a>
                                                <span v-else class="badge bg-success me-1">
                                                    <i class="uil uil-envelope-alt me-1"></i>Akun sudah dihapus
                                                </span>
                                                <span v-if="payment.user" class="badge bg-light text-dark">
                                                    <i class="uil uil-phone-alt me-1"></i>
                                                    <a :href="'https://api.whatsapp.com/send?phone=62'+payment.user.no_telp" target="_blank" v-if="payment.user.no_telp !== null">{{payment.user.no_telp}}</a>
                                                    <span v-else>belum ditambahkan</span>
                                                </span>
                                                <span v-else class="badge bg-light text-dark">
                                                    <i class="uil uil-phone-alt me-1"></i>
                                                    <span>belum ditambahkan</span>
                                                </span>
                                            </td>
                                            <td>
                                                <span class="d-block mb-1">{{payment.kode}}</span>
                                                <span class="badge bg-light d-block text-dark text-start">
                                                    Dibayar pada: <span>{{DateFormat(payment.updatedAt)}}</span>
                                                </span>
                                            </td>
                                            <td align="center">
                                                <router-link :to="'/'+type+'/'+status+'/'+payment.kode" class="text-dark" style="text-decoration: none;">
                                                    <i class="uil uil-eye"></i> Lihat
                                                </router-link>
                                            </td>
                                        </template>
                                        <template v-else>
                                            <td>
                                                <img src="@/assets/images/image-not-available.png" class="w-100 rounded">
                                            </td>
                                            <td>
                                                <span class="d-block mb-1">Program Sudah Kadaluarsa</span>
                                                <span class="badge bg-sm">Rp{{NumberFormat(payment.total_harga)}}</span>
                                            </td>
                                            <td>
                                                <span class="d-block mb-1" v-if="payment.user">
                                                    <router-link :to="'/user/'+payment.user.id" class="text-decoration-none text-wa">{{payment.user.nama}}</router-link>
                                                </span>
                                                <span class="d-block mb-1" v-else>
                                                    <router-link :to="'/user/'+payment.user_id" class="text-decoration-none text-wa">Akun sudah dihapus</router-link>
                                                </span>
                                                <a :href="'mailto:'+payment.user.email" target="_blank" v-if="payment.user" class="badge bg-success me-1">
                                                    <i class="uil uil-envelope-alt me-1"></i>{{payment.user.email}}
                                                </a>
                                                <span v-else class="badge bg-success me-1">
                                                    <i class="uil uil-envelope-alt me-1"></i>Akun sudah dihapus
                                                </span>
                                                <span v-if="payment.user" class="badge bg-light text-dark">
                                                    <i class="uil uil-phone-alt me-1"></i>
                                                    <a :href="'https://api.whatsapp.com/send?phone=62'+payment.user.no_telp" target="_blank" v-if="payment.user.no_telp !== null">{{payment.user.no_telp}}</a>
                                                    <span v-else>belum ditambahkan</span>
                                                </span>
                                                <span v-else class="badge bg-light text-dark">
                                                    <i class="uil uil-phone-alt me-1"></i>
                                                    <span>Akun sudah dihapus</span>
                                                </span>
                                            </td>
                                            <td>
                                                <span class="d-block mb-1">{{payment.kode}}</span>
                                                <span class="badge bg-light d-block text-dark text-start">
                                                    Dipesan pada: <span>{{DateFormat(payment.createdAt)}}</span>
                                                </span>
                                            </td>
                                            <td align="center">
                                                <router-link :to="'/'+type+'/'+status+'/'+payment.kode" class="text-dark" style="text-decoration: none;">
                                                    <i class="uil uil-eye"></i> Lihat
                                                </router-link>
                                            </td>
                                        </template>
                                    </template>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="row">
                        <div class="col">
                            <Paginator v-if="payments.totalPages >= 2" @page="changePage($event)" v-model:rows="payments.limitItems" :totalRecords="payments.totalItems" />
                        </div>
                        <div class="col text-end">
                            <b>Total Harga: Rp{{NumberFormat(this.payments.total_harga)}}</b>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AdminHeader from '@/components/layouts/AdminHeader.vue'
import Breadcrumb from '@/components/layouts/Breadcrumb.vue'
import Pulse from '@/components/loadings/Pulse.vue'
import config from '@/config/app'
import Mixins from '@/mixins'

export default {
    mixins: [Mixins],
    data() {
        return {
            apiURL: config.apiURL,
            keyword: '',
            paginationSearch: false,
            type: null,
            status: null,
        }
    },
    watch: {
        keyword() {
            this.getPayments()
        },
    },
    computed: {
        ...mapGetters({
            btnLoading: 'btnLoading',
            payments: 'payments/payments',
            programTotal: 'payments/programTotal',
        }),
    },
    components: { Pulse, AdminHeader, Breadcrumb },
    created() {
        this.getType()
        this.getPayments()
    },
    methods: {
        getType() {
            const pathArray = window.location.pathname.split('/')
            const secondLevelLocation = pathArray[1]
            this.type = secondLevelLocation
            const thirdLevelLocation = pathArray[2]
            this.status = thirdLevelLocation
        },
        getPayments() {
            let data = {
                keyword: this.keyword,
                page: 0,
            }
            this.$store.dispatch('payments/getPayments', data)
        },
        changePage(event) {
            this.$store.dispatch('payments/getPayments', {
                keyword: this.keyword,
                page: event.page,
            })
        },
    },
}
</script>

<style lang="scss">
@import '@/assets/sass/admin.scss';
</style>