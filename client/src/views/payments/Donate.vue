<template>
    <div class="container my-5" >
        <div class="text-start pt-5">
            <p class="text-judul"> <i class="fa-solid fa-clipboard-list"></i>  Donasi Kamu</p>
        </div>

        <div class="card" style="border: none;">
            <div class="row">
                <div class="col-md-6">
                    <img v-if="program.cover" :src="`${apiURL}/images/programs/${program.cover}`" class="img-fluid" alt="..." style="width: 100%; height: 100%;">
                    <img v-else src="@/assets/images/image-not-available.png" class="img-fluid" alt="..." style="width: 100%; height: 100%;">
                </div>
                <div class="col-md-6 text-start">
                    <div class="card-body">
                        <h5 class="card-title">{{ program.title }}</h5>
                        <div>{{program.short_desc}}</div>
                        <template v-if="program.type == 'Single'">
                            <p class="card- text-end"><strong>Rp{{NumberFormat(program.harga)}}</strong></p>
                        </template>
                        <template v-else>
                            <ProgressBar :value="progressFunding(program.total_funding, program.harga)"></ProgressBar>
                            <p class="card- text-start"><strong>Rp{{NumberFormat(program.total_funding)}}</strong> / <small class="text-muted">Rp{{NumberFormat(program.harga)}}</small></p>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        
        <template v-if="program.type == 'Crowdfunding'">
            <div class="col-md-6 text-start pt-3">
                <p class="text-judul"> <i class="fa-solid fa-sack-dollar"></i> Jumlah Donasi</p>
            </div>
            <div class="row">
                <div class="col-md-2 text-center">
                    <span>Rp</span>
                </div>
                <div class="col-md-10">
                    <form class="d-flex">
                        <InputNumber placeholder="1.000" class="w-100" :min="0" :max="99999999999" v-model="harga" mode="decimal" />
                    </form>
                </div>
            </div>
        </template>

        <div class="col-md-6 text-start pt-3">
            <p class="text-judul"> <i class="fa-solid fa-comment-dots"></i> Pesan / Salam</p>
        </div>
        <div class="row">
            <div class="col-md-12">
                <form class="d-flex">
                    <Textarea class="w-100" placeholder="Kirimkan salam untuk program ini 🥰" v-model="messages" :autoResize="true" rows="3" />
                </form>
            </div>
        </div>
        <template v-if="messages != ''">
            <div class="d-flex">
                <div class="col-10">
                    <label class="form-check-label" for="isAnonymous">Sembunyikan nama saya</label>
                </div>
                <div class="col-2">
                    <div class="form-check form-switch d-flex justify-content-end">
                        <input class="form-check-input" type="checkbox" id="isAnonymous" v-model="isAnonymous" value="true">
                    </div>
                </div>
            </div>
        </template>
        
        <div class="col pt-3">
            <p class="text-judul">Pilih Metode Pembayaran</p>
        </div>

        <div class="container">
            <div class="accordion" id="accordionExample">
                <div class="accordion" id="accordionPanelsStayOpenExample">
                    <template v-if="harga >= 10000 || harga == null">
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="panelsStayOpen-bank">
                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-bankCollapse" aria-expanded="true" aria-controls="panelsStayOpen-bankCollapse">
                                    <i class="uil uil-university me-1"></i>Transfer Bank (Min Rp10.000,00)
                                </button>
                            </h2>
                            <div id="panelsStayOpen-bankCollapse" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-bank">
                                <div class="accordion-body">
                                    <ul class="list-group">
                                        <label>
                                            <li class="list-group-item">
                                                <div>
                                                    <img src="@/assets/images/payment/bni.png" alt="bni">
                                                    <span>BNI Virtual Account</span>
                                                </div>
                                                <input class="form-check-input me-1" v-model="method" value="bni" type="radio">
                                            </li>
                                        </label>
                                        <label>
                                            <li class="list-group-item">
                                                <div>
                                                    <img src="@/assets/images/payment/bri.png" alt="bri">
                                                    <span>BRI Virtual Account</span>
                                                </div>
                                                <input class="form-check-input me-1" v-model="method" value="bri" type="radio">
                                            </li>
                                        </label>
                                        <label>
                                            <li class="list-group-item">
                                                <div>
                                                    <img src="@/assets/images/payment/permatabank.png" alt="permatabank">
                                                    <span>Permata Virtual Account</span>
                                                </div>
                                                <input class="form-check-input me-1" v-model="method" value="permata" type="radio">
                                            </li>
                                        </label>
                                        <label>
                                            <li class="list-group-item">
                                                <div>
                                                    <img src="@/assets/images/payment/mandiri.png" alt="mandiri">
                                                    <span>Mandiri Bill Payment</span>
                                                </div>
                                                <input class="form-check-input me-1" v-model="method" value="mandiri" type="radio">
                                            </li>
                                        </label>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="panelsStayOpen-counter">
                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-counterCollapse" aria-expanded="false" aria-controls="panelsStayOpen-counterCollapse">
                                    <i class="uil uil-shop me-1"></i>Bayar di Counter Terdekat (Min Rp10.000,00)
                                </button>
                            </h2>
                            <div id="panelsStayOpen-counterCollapse" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-counter">
                                <div class="accordion-body">
                                    <ul class="list-group">
                                        <label>
                                            <li class="list-group-item">
                                                <div>
                                                    <img src="@/assets/images/payment/alfagroup.png" alt="alfagroup">
                                                    <span>CStore Alfagroup</span>
                                                </div>
                                                <input class="form-check-input me-1" v-model="method" value="alfamart" type="radio">
                                            </li>
                                        </label>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="panelsStayOpen-eWallet">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-eWalletCollapse" aria-expanded="true" aria-controls="panelsStayOpen-eWalletCollapse">
                                <i class="uil uil-wallet me-1"></i>Bayar dengan E-Wallet / QRIS (Min Rp1.000,00)
                            </button>
                        </h2>
                        <div id="panelsStayOpen-eWalletCollapse" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-eWallet">
                            <div class="accordion-body">
                                <ul class="list-group">
                                    <label>
                                        <li class="list-group-item">
                                            <div>
                                                <img src="@/assets/images/payment/qris.png" alt="qris">
                                                <span>Pay with E-Wallet</span>
                                            </div>
                                            <input class="form-check-input me-1" v-model="method" value="gopay" type="radio">
                                        </li>
                                    </label>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row pt-3">
            <div class="col-md-10 text-start">
                <p class="text-judul"> <i class="fa-solid fa-hand-holding-dollar"></i> Total Bayar</p>
            </div>
            <div class="col-md-2 text-end">
                <strong>Rp<template v-if="program.type == 'Single'">{{NumberFormat(program.harga)}}</template><template v-else-if="program.type == 'Crowdfunding'">{{NumberFormat(harga)}}</template></strong>
            </div>
            <button @click="donate" type="submit" :disabled="btnLoading" class="btn btn-success py-3">Bayar Sekarang <Rolling v-if="btnLoading" /><i v-else class="fa-regular fa-circle-check"></i>
            </button>
        </div>
    </div>
</template>

<script>
import Rolling from '@/components/loadings/Rolling.vue'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import { mapGetters } from 'vuex'
import appConfig from '@/config/app'
import Mixins from '@/mixins'

export default {
    mixins: [Mixins],
    data() {
        return {
            harga: null,
            messages: '',
            isAnonymous: false,
            method: '',
        }
    },
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
    watch: {
        messages() {
            if (this.messages == '') this.isAnonymous = false
        },
    },
    components: { Rolling, InputNumber, Textarea },
    computed: {
        sip: {
            get: function () {
                return this.harga.toFixed(2)
            },
            set: function (newValue) {
                this.harga = newValue
            },
        },
        ...mapGetters({
            loadingStatus: 'loadingStatus',
            btnLoading: 'btnLoading',
            authenticated: 'auth/authenticated',
            program: 'program/program',
            user: 'auth/user',
        }),
    },
    methods: {
        getProgram() {
            this.$store
                .dispatch('program/getProgram', this.$route.params.slug)
                .catch(() => {
                    this.$router.push({ name: 'Home' })
                })
        },
        donate() {
            let data
            if (this.program.type == 'Single') {
                data = {
                    slug: this.$route.params.slug,
                    method: this.method,
                    messages: this.messages,
                    isAnonymous: this.isAnonymous,
                }
            } else if (this.program.type == 'Crowdfunding') {
                data = {
                    slug: this.$route.params.slug,
                    method: this.method,
                    harga: this.harga,
                    messages: this.messages,
                    isAnonymous: this.isAnonymous,
                }
            }
            this.$store.dispatch('payments/donate', data)
        },
    },
}
</script>
<style lang="scss">
.p-inputnumber-input {
    direction: rtl !important;
}
</style>

<style lang="scss" scoped>
@import '@/assets/sass/home.scss';
@import '@/assets/sass/donate.scss';
</style>