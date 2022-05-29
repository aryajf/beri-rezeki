<template>
    <div class="payment-wrapper">
        <div class="container">
            <div class="row">
                <div class="col-md-8">
                    <!-- PAYMENT BANNER -->
                    <div class="payment-banner">
                        <h1>Menunggu Pembayaran <i class="uil uil-clock-three ms-1"></i></h1>
                        <span>Segera selesaikan pembayaran anda</span>
                    </div>

                    <!-- PAYMENT MENU -->
                    <div class="payment-menu">
                        <div class="payment-menu-scroll">
                            <router-link to="/pending" class="btn btn-sm"><i class="uil uil-clock-three me-1"></i>Menunggu Pembayaran <span class="badge badge-total">{{pending.totalItems}}</span></router-link>
                            <router-link to="/accepted" class="btn btn-sm"><i class="uil uil-check-circle me-1"></i>Riwayat Pembelian <span class="badge badge-total">{{accepted.totalItems}}</span></router-link>
                        </div>
                    </div>

                    <!-- PAYMENT LIST  -->
                    <template class="mb-4" v-if="loadingStatus">
                        <div class="row mb-3" v-for="index in 5" :key="index">
                            <div class="col-4">
                                <Skeleton width="100%" height="7rem"></Skeleton>
                            </div>
                            <div class="col-8">
                                <div class="row">
                                    <div class="col-6">
                                        <Skeleton width="14rem" height="1.5rem" class="mb-2"></Skeleton>
                                    </div>
                                    <div class="col-4 offset-2">
                                        <Skeleton width="100%" height="1.5rem" class="mb-2"></Skeleton>
                                    </div>
                                </div>
                                <Skeleton width="100%" height="2rem" class="mb-2"></Skeleton>
                                <Skeleton width="50%" class="mb-2"></Skeleton>
                                <Skeleton width="100%"></Skeleton>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <template v-if="pending.payments">
                            <div class="mb-4" v-for="payment in pending.payments" :key="payment.id">
                                <div class="row">
                                    <template v-if="payment.program !== null">
                                        <router-link class="col-4" :to="'/'+payment.status[0].toLowerCase() + payment.status.slice(1)+'/'+payment.kode">
                                            <img class="img-fluid rounded" :src="apiURL+'/images/programs/'+payment.program.cover" :alt="payment.program.title">
                                        </router-link>
                                        <div class="col-8 payment-text">
                                            <span class="badge bg-outline-blue">
                                                Tersisa: <vue-countdown :time="countDown(payment.expiredAt)" v-slot="{ hours, minutes, seconds }">{{ hours }} jam, {{ minutes }} menit, {{ seconds }} detik.</vue-countdown>
                                            </span>
                                            <br class="break">
                                            <router-link :to="'/'+payment.status[0].toLowerCase() + payment.status.slice(1)+'/'+payment.kode" class="payment-title">{{payment.program.title}}</router-link>
                                            <div class="payment-short-desc" v-html="ShortText(payment.program.short_desc)"></div>
                                            <span class="payment-harga">Rp{{NumberFormat(payment.total_harga)}}</span>

                                            <router-link :to="'/'+payment.status[0].toLowerCase() + payment.status.slice(1)+'/'+payment.kode" class="btn-pay">Lihat Detail Pembelian <i class="uil uil-angle-double-right"></i></router-link>
                                            <a href="#" @click="deletePending(payment.kode)" class="btn-delete text-danger" title="Hapus"><i class="uil uil-trash-alt"></i></a>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="col-4">
                                            <img class="img-fluid rounded" src="@/assets/images/image-not-available.png">
                                        </div>
                                        <div class="col-8 payment-text">
                                            <span class="badge bg-outline-yellow">
                                                Tersisa: <vue-countdown :time="countDown(payment.expiredAt)" v-slot="{ hours, minutes, seconds }">{{ hours }} jam, {{ minutes }} menit, {{ seconds }} detik.</vue-countdown>
                                            </span>
                                            <br class="break">
                                            <p class="payment-title">Program Sudah Kadaluarsa</p>
                                            <p class="payment-short-desc">Mungkin saja program sudah dihapus. Terima kasih sudah mempercayai kami</p>
                                            <span class="payment-harga">Rp{{NumberFormat(payment.total_harga)}}</span>

                                            <router-link :to="'/'+payment.status[0].toLowerCase() + payment.status.slice(1)+'/'+payment.kode" class="btn-pay">Lihat Detail Pembelian <i class="uil uil-angle-double-right"></i></router-link>
                                        </div>
                                    </template>
                                </div>
                                <hr>
                            </div>
                        </template>
                        <template v-else>
                            <div class="alert alert-warning"><i class="uil uil-confused me-1"></i>{{ pending.message }}</div>
                        </template>
                    </template>
                    <Paginator v-if="pending.totalPages >= 2" @page="changePage($event)" v-model:rows="pending.limitItems" :totalRecords="pending.totalItems" />
                </div>
                <div class="col-md-4 payment-list">
                    <PaymentNotification />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PaymentNotification from '@/components/layouts/PaymentNotification.vue'
import appConfig from '@/config/app'
import { mapGetters } from 'vuex'
import Mixins from '@/mixins'
export default {
    setup() {
        return {
            apiURL: appConfig.apiURL,
        }
    },
    mixins: [Mixins],
    components: { PaymentNotification },
    computed: {
        ...mapGetters({
            btnLoading: 'btnLoading',
            loadingStatus: 'loadingStatus',
            formErrors: 'formErrors',
            pending: 'payments/pending',
            accepted: 'payments/accepted',
        }),
    },
    mounted() {
        this.getPayment()
        this.countDown()
    },
    methods: {
        getPayment() {
            this.$store.dispatch('payments/getPayment', { status: 'accepted' })
            this.$store.dispatch('payments/getPayment', { status: 'pending' })
        },
        changePage(event) {
            this.$store.dispatch('payments/getPayment', {
                status: 'accepted',
                page: event.page,
            })
            this.$store.dispatch('payments/getPayment', {
                status: 'pending',
                page: event.page,
            })
        },
        deletePending(kode) {
            this.$confirm.require({
                message: 'Apa anda yakin ingin membatalkan pembayaran ?',
                header: 'Cancel Payment',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                accept: () => {
                    this.$store.dispatch('payments/cancelPayment', kode)
                },
                reject: () => {
                    this.$confirm.close()
                },
            })
        },
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/sass/banner.scss';
@import '@/assets/sass/payment.scss';
</style>