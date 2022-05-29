<template>
    <div v-if="type && status && kode">
        <Breadcrumb :produk="type" :status="status" :kode="kode" />
        <div class="bg-white admin-wrapper">
            <AdminHeader />
            <div class="admin-body">
                <h1 class="admin-body-heading"><i class="uil uil-edit me-1"></i>Show Payment</h1>
                <div class="row">
                    <div class="col-md-4 checkout-method">
                        <div class="col-md-12 bg-light shadow-sm checkout-method-content">
                            <div class="checkout-text">
                                <span class="badge bg-outline-green finished"><i class="uil uil-check-circle me-1"></i>
                                    Pembayaran Selesai
                                </span>
                            </div>
                            <div class="col-md-10 px-3 mx-auto">
                                <div class="row">
                                    <div class="col-12 d-flex align-items-center">
                                        <template v-if="transaction.payment_type == 'bank_transfer'">
                                            <template v-if="transaction.va_numbers != null">
                                                <img v-if="transaction.va_numbers[0].bank == 'bca'" class="w-100" src="@/assets/images/payment/bca.png" :alt="transaction.va_numbers[0].bank == 'bca'.toUpperCase()">
                                                <img v-else-if="transaction.va_numbers[0].bank == 'bni'" class="w-100" src="@/assets/images/payment/bni.png" :alt="transaction.va_numbers[0].bank == 'bni'.toUpperCase()">
                                                <img v-else-if="transaction.va_numbers[0].bank == 'bri'" class="w-100" src="@/assets/images/payment/bri.png" :alt="transaction.va_numbers[0].bank == 'bri'.toUpperCase()">
                                            </template>
                                            <template v-else>
                                                <img class="w-100" src="@/assets/images/payment/permatabank.png" alt="PERMATA">
                                            </template>
                                        </template>
                                        <template v-else-if="transaction.payment_type == 'echannel'">
                                            <img class="w-100" src="@/assets/images/payment/mandiri.png" alt="Mandiri">
                                        </template>
                                        <template v-else-if="transaction.payment_type == 'cstore'">
                                            <img v-if="transaction.store == 'alfamart'" class="w-100" src="@/assets/images/payment/alfagroup.png" :alt="transaction.store.toUpperCase()">
                                            <img v-else-if="transaction.store == 'indomaret'" class="w-100" src="@/assets/images/payment/indomaret.png" :alt="transaction.store.toUpperCase()">
                                        </template>
                                        <template v-else>
                                            <img class="w-100" src="@/assets/images/payment/qris.png" alt="qris" v-if="transaction.payment_type == 'gopay'">
                                            <img class="w-100" src="@/assets/images/payment/shopeepay.png" alt="SHOOPEPAY" v-else-if="transaction.payment_type == 'qris'">
                                        </template>
                                    </div>
                                    <div class="col-12 text-wa mt-3 bank-info">
                                        <small>Total Pembayaran</small> <br>
                                        <span class="fw-bold">Rp{{NumberFormat(payment.total_harga)}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-8 payment-detail">
                        <div class="row">
                            <div class="col-md-12 order-info">
                                <p class="detail-heading text-wa"><i class="uil uil-invoice me-1"></i>Orderan</p>
                                <div class="line-heading"></div>
                                <template v-if="payment">
                                    <template v-if="payment.program">
                                        <a :href="homeURL+'/'+payment.program.slug" class="text-decoration-none text-wa d-block order-link">
                                            <div class="row align-items-center">
                                                <div class="col-md-3 col-4">
                                                    <img :src="apiURL+'images/programs/'+payment.program.cover" :alt="payment.program.title" class="w-100 rounded">
                                                </div>
                                                <div class="col-md-9 col-8 p-0">
                                                    <p class="fw-bold mb-1">{{ payment.program.title }}</p>
                                                    <div class="order-info-short-desc" v-html="payment.program.short_desc"></div>
                                                </div>
                                            </div>
                                        </a>
                                    </template>
                                    <template v-else>
                                        <div class="row">
                                            <div class="col-md-3 col-4">
                                                <img src="@/assets/images/image-not-available.png" alt="Not Found" class="w-100 rounded">
                                            </div>
                                            <div class="col-md-9 col-8 p-0">
                                                <p class="fw-bold mb-1">Produk Sudah Kadaluarsa</p>
                                                <p class="order-info-short-desc">Mungkin saja produk sudah dihapus</p>
                                            </div>
                                        </div>
                                    </template>
                                </template>
                            </div>
                            <div class="col-md-6 payment-info">
                                <p class="detail-heading text-wa"><i class="uil uil-bill me-1"></i>Payment Detail</p>
                                <div class="line-heading"></div>
                                <p class="detail-item"><span>Kode Order</span> <br> {{ payment.kode }}</p>
                                <p class="detail-item">
                                    <span>Status Produk</span> <br>
                                    <b class="badge bg-outline-green"><i class="uil uil-check-circle me-1"></i>Sudah selesai</b>
                                </p>
                                <p class="detail-item"><span>Total Pembayaran</span> <br> Rp{{NumberFormat(payment.total_harga)}}</p>
                                <p class="detail-item"><span>Tanggal Pemesanan</span> <br>{{ DateFormat(payment.createdAt) }}</p>
                            </div>

                            <div class="col-md-6 user-info">
                                <p class="detail-heading text-wa"><i class="uil uil-user me-1"></i>User Detail</p>
                                <div class="line-heading"></div>
                                <template v-if="payment.user">
                                    <p class="detail-item">
                                        <span>Nama Lengkap</span> <br>
                                        {{payment.user.nama}}<router-link :to="'/user/'+payment.user.id" class="text-decoration-none"><i class="uil uil-eye ms-1"></i>
                                        </router-link>
                                    </p>
                                    <p class="detail-item">
                                        <span>Email</span> <br>
                                        {{ payment.user.email }}
                                        <a :href="'mailto:'+payment.user.email" target="_blank"><i class="uil uil-envelope-upload"></i></a>
                                    </p>
                                    <p class="detail-item">
                                        <span>No. Telepon</span> <br>
                                        <template v-if="payment.user.no_telp">
                                            {{ payment.user.no_telp }}
                                            <a :href="'https://api.whatsapp.com/send?phone=62'+payment.user.no_telp" target="_blank"><i class="uil uil-phone"></i></a>
                                        </template>
                                        <template v-else>
                                            <small class="badge bg-light text-dark">Belum diisi</small>
                                        </template>
                                    </p>
                                </template>
                                <template v-else>
                                    <p class="detail-item">
                                        <span>Nama Lengkap</span> <br>
                                        <small class="badge bg-light text-dark">Akun sudah dihapus</small>
                                    </p>
                                    <p class="detail-item">
                                        <span>Email</span> <br>
                                        <small class="badge bg-light text-dark">Akun sudah dihapus</small>
                                    </p>
                                    <p class="detail-item">
                                        <span>No. Telepon</span> <br>
                                        <small class="badge bg-light text-dark">Akun sudah dihapus</small>
                                    </p>
                                </template>
                            </div>

                            <!-- COMMENTS -->
                            <template v-if="payment.status == 'Accepted'">
                                <div class="col-md-6 order-info">
                                    <p class="detail-heading text-wa"><i class="uil uil-star me-1"></i>Ulasan</p>
                                    <div class="line-heading"></div>
                                    <span v-if="(payment.comment == null)" class="badge bg-light text-darkBlue"><i class="uil uil-sad me-1"></i> Belum ada ulasan</span>
                                    <span v-else>{{ payment.comment.messages }}</span>
                                </div>
                            </template>
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
import Rolling from '@/components/loadings/Rolling.vue'
import config from '@/config/app'
import Mixins from '@/mixins'
export default {
    mixins: [Mixins],
    data() {
        return {
            apiURL: config.apiURL,
            homeURL: config.homeURL,
            type: null,
            status: null,
            kode: null,
        }
    },
    components: {
        AdminHeader,
        Breadcrumb,
        Rolling,
    },
    computed: {
        ...mapGetters({
            btnLoading: 'btnLoading',
            formErrors: 'formErrors',
            payment: 'payments/payment',
            transaction: 'payments/transaction',
        }),
    },
    created() {
        this.getType()
        this.getPayment()
    },
    methods: {
        getType() {
            const pathArray = window.location.pathname.split('/')
            const secondLevelLocation = pathArray[1]
            this.type = secondLevelLocation
            const thirdLevelLocation = pathArray[2]
            this.status = thirdLevelLocation
            const fourthLevelLocation = pathArray[3]
            this.kode = fourthLevelLocation
        },
        getPayment() {
            this.$store.dispatch('payments/getPayment', this.kode)
        },
    },
}
</script>

<style lang="scss">
@import '@/assets/sass/admin.scss';
@import '@/assets/sass/payment.scss';
</style>