<template>
    <div class="admin-header bg-light rounded-top">
        <div class="admin-header-heading">
            <p class="m-0 p-0">
                <a target="_blank" class="text-darkBlue fw-bold" v-if="url == 'program'" :href="homeURL">{{ url }}</a>
                <a target="_blank" class="text-darkBlue fw-bold" v-else>{{ url }}</a>
            </p>
            <span>Kelola managemen {{ url }}</span>
        </div>
    </div>
</template>

<script>
import appConfig from '@/config/app'
export default {
    mounted() {
        this.getHeading()
    },
    data() {
        return {
            url: this.$route.path.split('/')[1],
            homeURL: appConfig.homeURL
        }
    },

    methods: {
        getHeading() {
            if (this.$route.path.split('/')[2] == 'accepted') {
                this.url = 'transaksi'
            }
        },
    },
}
</script>