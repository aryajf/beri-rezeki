<template>
    <div class="paymentNotificationAccordion" id="accordionPanelsStayOpenExample">
        <div class="accordion-item">
            <h2 class="accordion-header" id="panelsStayOpen-headingOne">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                    <i class="uil uil-bell me-2"></i>Notifikasi
                </button>
            </h2>
            <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
                <div class="accordion-body">
                    <strong class="d-block text-wa mb-2">Info Penting</strong>
                    <template v-if="$route.path == '/pending'">
                        <p v-if="pending.totalItems == 0">{{ infoMessage }}</p>
                        <p v-else>Segera selesaikan pembayaran anda</p>
                    </template>
                    <template v-else-if="$route.path == '/accepted'">
                        <p v-if="accepted.totalItems == 0">{{ infoMessage }}</p>
                        <p v-else>Terimakasih sudah membeli dan mempercayai produk kami 😊</p>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            infoMessage: 'Belum ada info penting',
        }
    },
    computed: {
        ...mapGetters({
            accepted: 'payments/accepted',
            unpaid: 'payments/unpaid',
            pending: 'payments/pending',
        }),
    },
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
    .paymentNotificationAccordion {
        position: fixed;
        bottom: 70px;
        width: 95%;
        left: 2.5%;
        border: none !important;
    }
}
</style>