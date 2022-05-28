<template>
    <div class="row d-flex justify-content-around">
        <div class="col-12 col-md-4">
            <h4 class="text-center">Jumlah Produk</h4>
            <Chart type="pie" :data="productData" />
        </div>
        <div class="col-12 col-md-8">
            <h4 class="text-center">Jumlah Pembayaran</h4>
            
            <div class="w-100 text-end my-3">
            <span class="p-float-label p-input-icon-right">
                <i class="pi pi-spinner" v-if="btnLoading" /><i class="pi pi-calendar" v-else />
                <InputNumber :disabled="btnLoading" mode="decimal" :useGrouping="false" v-model="year" placeholder="Cari tahun" />
            </span>
            </div>
            <Chart ref="paymentChart" type="bar" :data="paymentData" />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import InputNumber from 'primevue/inputnumber'
import moment from 'moment'
import Chart from 'primevue/chart'
export default {
    created() {
        this.getAllPayments()
        this.getProducts()
    },
    computed: {
        ...mapGetters({
            btnLoading: 'btnLoading',
        }),
    },
    watch: {
        year() {
            this.changeYear()
        },
    },
    methods: {
        changeYear(){
            this.getAllPayments()
            this.$refs.paymentChart.chart.update()
        },
        getAllPayments() {
            this.$store.dispatch("payments/getAllPayments", this.year).then(res => {
                this.paymentData = {
                    labels: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
                    datasets: [
                        {
                            label: 'Program',
                            backgroundColor: '#EC615B',
                            data: res.count.program
                        },
                    ]
                }
            })
        },
        getProducts() {
            this.$store.dispatch("totalProducts").then(res => {
                this.productData = {
                labels: ['Program'],
                datasets: [
                    {
                        data: res,
                        backgroundColor: ["#EC615B"],
                        hoverBackgroundColor: ["#db524d"]
                    },
                ]
            }
            })
        },
    },
    components: { Chart, InputNumber },
    data() {
        return {
            year: parseInt(moment(new Date()).format('YYYY')),
            paymentData: null,
            productData: null,
        }
    }
}
</script>