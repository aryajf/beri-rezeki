<template>
    <div v-if="program.user">
        <!-- DONATE -->
        <div class="donate-wrapper d-flex justify-content-center align-items-center">
            <template v-if="program.status == 'Pending'">
                <div class="col-md-9 donate-wrapper-spacing">
                    <router-link to="/pending" class="back-button"><i class="uil uil-angle-left-b me-1"></i>Kembali ke halaman menunggu pembayaran</router-link>
                    <div class="row">
                        <div class="col-md-5 donate-method">
                            <div class="col-md-12 bg-light shadow-sm donate-method-content">
                                <div class="donate-text">
                                    <p class="donate-heading">Segera Selesaikan Pembayaranmu</p>
                                    <span class="badge bg-outline-blue countdown"><i class="uil uil-hourglass me-1"></i>
                                        <vue-countdown :time="countDown(program.expiredAt)" v-slot="{ hours, minutes, seconds }">{{ hours }} jam, {{ minutes }} menit, {{ seconds }} detik.</vue-countdown>
                                    </span>
                                </div>
                                <div class="col-md-10 px-3 mx-auto">
                                    <div class="row">
                                        <template v-if="payment.payment_type == 'bank_transfer'">
                                            <template v-if="payment.va_numbers != null">
                                                <div class="col-9 mb-3 bank-info">
                                                    <small>Nomor Virtual Account</small> <br>
                                                    <span id="NumberCode" class="fw-bold">{{payment.va_numbers[0].va_number}}</span>
                                                    <small id="copy-to-clipboard" class="text-secondary d-block cursor-pointer" href="#" @click.prevent="copyNumber"><i class="uil uil-copy-alt"></i> Salin Nomor</small>
                                                </div>
                                                <div class="col-3 d-flex align-items-center">
                                                    <img v-if="payment.va_numbers[0].bank == 'bca'" class="w-100" src="@/assets/images/payment/bca.png" :alt="payment.va_numbers[0].bank == 'bca'.toUpperCase()">
                                                    <img v-else-if="payment.va_numbers[0].bank == 'bni'" class="w-100" src="@/assets/images/payment/bni.png" :alt="payment.va_numbers[0].bank == 'bni'.toUpperCase()">
                                                    <img v-else-if="payment.va_numbers[0].bank == 'bri'" class="w-100" src="@/assets/images/payment/bri.png" :alt="payment.va_numbers[0].bank == 'bri'.toUpperCase()">
                                                </div>
                                                <div class="col-12 bank-info">
                                                    <small>Total Pembayaran</small> <br>
                                                    <span class="fw-bold">Rp{{NumberFormat(program.total_harga)}}</span>
                                                </div>
                                                <div v-if="program.comment" class="col-12 bank-info">
                                                    <small>Komentar</small> <br>
                                                    <span class="fw-bold">{{ program.comment.messages }}</span>
                                                </div>
                                            </template>
                                            <template v-else>
                                                <div class="col-9 mb-3 bank-info">
                                                    <small>Nomor Virtual Account</small> <br>
                                                    <span id="NumberCode" class="fw-bold">{{payment.permata_va_number}}</span>
                                                    <small id="copy-to-clipboard" class="text-secondary d-block cursor-pointer" href="#" @click.prevent="copyNumber"><i class="uil uil-copy-alt"></i> Salin Nomor</small>
                                                </div>
                                                <div class="col-3 d-flex align-items-center">
                                                    <img class="w-100" src="@/assets/images/payment/permatabank.png" alt="PERMATA">
                                                </div>
                                                <div class="col-12 bank-info">
                                                    <small>Total Pembayaran</small> <br>
                                                    <span class="fw-bold">Rp{{NumberFormat(program.total_harga)}}</span>
                                                </div>
                                            </template>
                                        </template>

                                        <template v-else-if="payment.payment_type == 'echannel'">
                                            <div class="col-9 mb-3 bank-info">
                                                <small>Kode Perusahaan</small> <br>
                                                <span class="fw-bold">{{payment.biller_code}}</span>
                                            </div>
                                            <div class="col-3 d-flex align-items-center">
                                                <img class="w-100" src="@/assets/images/payment/mandiri.png" alt="Mandiri">
                                            </div>
                                            <div class="col-9 mb-3 bank-info">
                                                <small>Kode Pembayaran</small> <br>
                                                <span id="NumberCode" class="fw-bold">{{payment.bill_key}}</span>
                                                <small id="copy-to-clipboard" class="text-secondary d-block cursor-pointer" href="#" @click.prevent="copyNumber"><i class="uil uil-copy-alt"></i> Salin Nomor</small>
                                            </div>
                                            <div class="col-12 bank-info">
                                                <small>Total Pembayaran</small> <br>
                                                <span class="fw-bold">Rp{{NumberFormat(program.total_harga)}}</span>
                                            </div>
                                        </template>

                                        <template v-else-if="payment.payment_type == 'cstore'">
                                            <div class="col-9 mb-3 bank-info">
                                                <small>Kode Pembayaran</small> <br>
                                                <span id="NumberCode" class="fw-bold">{{payment.payment_code}}</span>
                                                <small id="copy-to-clipboard" class="text-secondary d-block cursor-pointer" href="#" @click.prevent="copyNumber"><i class="uil uil-copy-alt"></i> Salin Nomor</small>
                                            </div>
                                            <div class="col-3 d-flex align-items-center">
                                                <img v-if="payment.store == 'alfamart'" class="w-100" src="@/assets/images/payment/alfagroup.png" :alt="payment.store.toUpperCase()">
                                                <img v-else-if="payment.store == 'indomaret'" class="w-100" src="@/assets/images/payment/indomaret.png" :alt="payment.store.toUpperCase()">
                                            </div>
                                            <div class="col-12 bank-info">
                                                <small>Total Pembayaran</small> <br>
                                                <span class="fw-bold">Rp{{NumberFormat(program.total_harga)}}</span>
                                            </div>
                                        </template>

                                        <div v-else-if="payment.payment_type == 'gopay'" class="text-center">
                                            <img :src="'https://api.veritrans.co.id/v2/gopay/' + payment.transaction_id +'/qr-code'" alt="GOPAY QR-CODE" class="w-75 mb-4"><br>
                                            <img src="@/assets/images/payment/qris.png" alt="qris" class="w-25">
                                        </div>
                                        <div v-else-if="payment.payment_type == 'qris'" class="text-center">
                                            <img :src="'https://api.veritrans.co.id/v2/qris/shopeepay/sppq_' + payment.transaction_id + '/qr-code'" alt="SHOPEEPAY QR-CODE" class="w-75 mb-4"><br>
                                            <img src="@/assets/images/payment/shopeepay.png" alt="SHOOPEPAY" class="w-25">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <a href="https://api.whatsapp.com/send?phone=6281292751775" target="_blank" class="btn btn-chat w-100">
                                <i class="uil uil-whatsapp me-2"></i>Whatsapp Ke Admin
                            </a>
                        </div>

                        <div class="col-md-7 donate-detail">
                            <div class="col-md-12">
                                <div class="row">
                                    <div class="col-md-12 order-info">
                                        <p class="detail-heading"><i class="uil uil-invoice me-1"></i>Program Donasi</p>
                                        <div class="line-heading"></div>
                                        <template v-if="program.program !== null">
                                            <router-link :to="'/program/'+program.program.slug" class="text-decoration-none d-block order-link text-darkBlue">
                                                <div class="row">
                                                    <div class="col-md-3 col-4">
                                                        <img :src="apiURL+'/images/programs/'+program.program.cover" :alt="program.program.title" class="w-100 rounded">
                                                    </div>
                                                    <div class="col-md-9 col-8 p-0">
                                                        <p class="fw-bold mb-1">{{ program.program.title }}</p>
                                                        <div class="order-info-short-desc">Rp{{ NumberFormat(program.program.harga) }}</div>
                                                    </div>
                                                </div>
                                            </router-link>
                                        </template>
                                        <template v-else>
                                            <div class="row">
                                                <div class="col-md-3 col-4">
                                                    <img src="@/assets/images/image-not-available.png" alt="Not Found" class="w-100 rounded">
                                                </div>
                                                <div class="col-md-9 col-8 p-0">
                                                    <p class="fw-bold mb-1">Program Sudah Kadaluarsa</p>
                                                    <p class="order-info-short-desc">Mungkin saja program sudah dihapus. Terima kasih sudah mempercayai kami</p>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                    <div class="col-md-6 payment-info">
                                        <p class="detail-heading"><i class="uil uil-bill me-1"></i>Payment Detail</p>
                                        <div class="line-heading"></div>
                                        <p class="detail-item"><span>Kode Order</span> <br> {{ program.kode }}</p>
                                        <p class="detail-item"><span>Total Pembayaran</span> <br> Rp{{NumberFormat(program.total_harga)}}</p>
                                        <p class="detail-item"><span>Tanggal Pemesanan</span> <br>{{ DateFormat(program.createdAt) }}</p>
                                        <p class="detail-item"><span>Akhir Pembayaran</span> <br>{{ DateFormat(program.expiredAt) }}</p>
                                    </div>
                                    <div class="col-md-6 user-info">
                                        <p class="detail-heading"><i class="uil uil-user me-1"></i>User Detail</p>
                                        <div class="line-heading"></div>
                                        <p class="detail-item"><span>Nama Lengkap</span> <br> {{ program.user.nama }} </p>
                                        <p class="detail-item"><span>Email</span> <br> {{ program.user.email }} </p>
                                        <p class="detail-item">
                                            <span>No. Telepon</span> <br>
                                            <template v-if="program.user.no_telp">{{ program.user.no_telp }}</template>
                                            <template v-else><small class="badge bg-light text-dark">Belum diisi</small></template>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <template v-else>
                <div class="col-md-9 donate-wrapper-spacing">
                    <router-link to="/accepted" class="back-button"><i class="uil uil-angle-left-b me-1"></i>Kembali ke halaman riwayat pembayaran</router-link>
                    <div class="row">
                        <div class="col-md-5 donate-method">
                            <div class="col-md-12 bg-light shadow-sm donate-method-content">
                                <div class="donate-text">
                                    <span class="badge bg-outline-green finished"><i class="uil uil-check-circle me-1"></i>
                                        Pembayaran Selesai
                                    </span>
                                </div>
                                <div class="col-md-10 px-3 mx-auto">
                                    <div class="row">
                                        <div class="col-9 mb-3 bank-info">
                                            <small>Total Pembayaran</small> <br>
                                            <span class="fw-bold">Rp{{NumberFormat(program.total_harga)}}</span>
                                        </div>
                                        <div class="col-3 d-flex align-items-center">
                                            <template v-if="payment.payment_type == 'bank_transfer'">
                                                <template v-if="payment.va_numbers != null">
                                                    <img v-if="payment.va_numbers[0].bank == 'bca'" class="w-100" src="@/assets/images/payment/bca.png" :alt="payment.va_numbers[0].bank == 'bca'.toUpperCase()">
                                                    <img v-else-if="payment.va_numbers[0].bank == 'bni'" class="w-100" src="@/assets/images/payment/bni.png" :alt="payment.va_numbers[0].bank == 'bni'.toUpperCase()">
                                                    <img v-else-if="payment.va_numbers[0].bank == 'bri'" class="w-100" src="@/assets/images/payment/bri.png" :alt="payment.va_numbers[0].bank == 'bri'.toUpperCase()">
                                                </template>
                                                <template v-else>
                                                    <img class="w-100" src="@/assets/images/payment/permatabank.png" alt="PERMATA">
                                                </template>
                                            </template>
                                            <template v-else-if="payment.payment_type == 'echannel'">
                                                <img class="w-100" src="@/assets/images/payment/mandiri.png" alt="Mandiri">
                                            </template>
                                            <template v-else-if="payment.payment_type == 'cstore'">
                                                <img v-if="payment.store == 'alfamart'" class="w-100" src="@/assets/images/payment/alfagroup.png" :alt="payment.store.toUpperCase()">
                                                <img v-else-if="payment.store == 'indomaret'" class="w-100" src="@/assets/images/payment/indomaret.png" :alt="payment.store.toUpperCase()">
                                            </template>
                                            <template v-else>
                                                <img class="w-100" src="@/assets/images/payment/qris.png" alt="qris" v-if="payment.payment_type == 'gopay'">
                                                <img class="w-100" src="@/assets/images/payment/shopeepay.png" alt="SHOOPEPAY" v-else-if="payment.payment_type == 'qris'">
                                            </template>
                                        </div>
                                        <div v-if="payment.settlement_time" class="col-12 mb-3 bank-info">
                                            <small>Tanggal Pembayaran</small> <br>
                                            <span class="fw-bold">{{ DateFormat(payment.settlement_time) }}</span>
                                        </div>
                                        <div v-if="program.comment" class="col-12 bank-info">
                                            <small>Komentar</small> <br>
                                            <span class="fw-bold">{{ program.comment.messages }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <a href="https://api.whatsapp.com/send?phone=6281292751775" target="_blank" class="btn btn-chat w-100">
                                <i class="uil uil-whatsapp me-2"></i>Whatsapp Ke Admin
                            </a>
                        </div>
                        <div class="col-md-7 donate-detail">
                            <div class="col-md-12">
                                <div class="row">
                                    <div class="col-md-12 order-info">
                                        <p class="detail-heading"><i class="uil uil-invoice me-1"></i>Program Donasi</p>
                                        <div class="line-heading"></div>
                                        <template v-if="program.program !== null">
                                            <router-link :to="'/program/'+program.program.slug" class="text-decoration-none d-block order-link text-darkBlue">
                                                <div class="row">
                                                    <div class="col-md-3 col-4">
                                                        <img :src="apiURL+'/images/programs/'+program.program.cover" :alt="program.program.title" class="w-100 rounded">
                                                    </div>
                                                    <div class="col-md-9 col-8 p-0">
                                                        <p class="fw-bold mb-1">{{ program.program.title }}</p>
                                                        <div class="order-info-short-desc" v-html="ShortText(program.program.short_desc)"></div>
                                                    </div>
                                                </div>
                                            </router-link>
                                        </template>
                                        <template v-else>
                                            <div class="row">
                                                <div class="col-md-3 col-4">
                                                    <img src="@/assets/images/image-not-available.png" alt="Not Found" class="w-100 rounded">
                                                </div>
                                                <div class="col-md-9 col-8 p-0">
                                                    <p class="fw-bold mb-1">Program Sudah Kadaluarsa</p>
                                                    <p class="order-info-short-desc">Mungkin saja program sudah dihapus. Terima kasih sudah mempercayai kami</p>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                    <div class="col-md-6 payment-info">
                                        <p class="detail-heading"><i class="uil uil-bill me-1"></i>Payment Detail</p>
                                        <div class="line-heading"></div>
                                        <p class="detail-item"><span>Kode Order</span> <br> {{ program.kode }}</p>
                                        <p class="detail-item"><span>Total Pembayaran</span> <br> Rp{{NumberFormat(program.total_harga)}}</p>
                                        <p class="detail-item"><span>Tanggal Pemesanan</span> <br>{{ DateFormat(program.createdAt) }}</p>
                                        <template v-if="program.status == 'Accepted'">
                                            <p class="detail-item"><span>Status</span> <br> <b class="badge bg-outline-green"><i class="uil uil-check me-1"></i>Sudah selesai</b></p>
                                        </template>
                                    </div>
                                    <div class="col-md-6 user-info">
                                        <p class="detail-heading"><i class="uil uil-user me-1"></i>User Detail</p>
                                        <div class="line-heading"></div>
                                        <p class="detail-item"><span>Nama Lengkap</span> <br> {{ program.user.nama }} </p>
                                        <p class="detail-item"><span>Email</span> <br> {{ program.user.email }} </p>
                                        <p class="detail-item">
                                            <span>No. Telepon</span> <br>
                                            <template v-if="program.user.no_telp">{{ program.user.no_telp }}</template>
                                            <template v-else><small class="badge bg-light text-dark">Belum diisi</small></template>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import appConfig from '@/config/app'
import Mixins from '@/mixins'

export default {
    mixins: [Mixins],
    setup() {
        return {
            apiURL: appConfig.apiURL,
            baseURL: appConfig.baseURL,
            homeURL: appConfig.homeURL,
        }
    },
    created() {
        this.getProgram()
    },
    computed: {
        ...mapGetters({
            btnLoading: 'btnLoading',
            authenticated: 'auth/authenticated',
            payment: 'payments/payment',
            program: 'payments/show',
            user: 'auth/user',
        }),
    },
    methods: {
        getProgram() {
            const data = {
                status: this.$route.params.status,
                kode: this.$route.params.kode,
            }
            this.$store.dispatch('payments/getShow', data)
        },
    },
}
</script>
<style lang="scss">
@import '@/assets/sass/transaction.scss';
</style>