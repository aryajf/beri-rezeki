<template>
    <div>
        <Breadcrumb />
        <div class="bg-light p-4 rounded">
            <h4 data-aos="flip-right" class="alert-heading mb-3">Halo admin 👋</h4>
            <p>
                Selamat datang, kelola program donasi disini.
            </p>
            <hr>
            <p class="mb-0">Berikut laporan detail berupa chart dan kalender dari seluruh program donasi website BeriRezeki</p>
        </div>
        <Chart class="my-4" />
        <div class="calendar-panel">
            <Calendar class="my-4" />
        </div>
    </div>
</template>

<script>
import Breadcrumb from '@/components/layouts/Breadcrumb.vue'
import Chart from '@/components/layouts/Chart.vue'
import Calendar from '@/components/layouts/Calendar.vue'
import Mixins from '@/mixins'
export default {
    mixins: [Mixins],
    components: { Breadcrumb, Calendar, Chart },
}
</script>

<style lang="scss">
.calendar-panel {
    overflow-x: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &:-webkit-scrollbar {
        display: none;
    }
}
.calendar-main {
    padding: 0 !important;
}
</style>