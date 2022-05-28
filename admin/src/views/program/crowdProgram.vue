<template>
    <div>
        <Breadcrumb />
        <DeleteModal :program_slug="program_slug"></DeleteModal>
        <div class="bg-white admin-wrapper">
            <AdminHeader />
            <div class="admin-body">
                <div class="row">
                    <div class="col-xl-9 col-12 top-button">
                        <router-link to="/program/create" class="btn bg-wa btn-sm"><i class="uil uil-plus"></i> Buat program
                        </router-link>
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
                        <router-link to="/program" class="btn btn-sm"><i class="uil uil-file-bookmark-alt me-1"></i>
                            Semua Program <span class="badge bg-wa ms-1">{{programTotal}}</span>
                        </router-link>
                        <router-link to="/program/single" class="btn btn-sm"><i class="uil uil-file-bookmark-alt me-1"></i>
                            Single Program <span class="badge bg-wa ms-1">{{singleTotal}}</span>
                        </router-link>
                        <router-link to="/program/crowdfunding" class="btn btn-sm"><i class="uil uil-file-bookmark-alt me-1"></i>
                            Crowdfunding Program <span class="badge bg-wa ms-1">{{programs.totalItems}}</span>
                        </router-link>
                    </div>
                </div>

                <template v-if="programs.program && programs.totalItems != 0">
                    <div class="row">
                        <div class="table-responsive mb-3">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col" class="th-cover"><i class="uil uil-image me-2"></i>Cover</th>
                                        <th scope="col" class="th-judul"><i class="uil uil-file me-2"></i>Program</th>
                                        <th scope="col" class="th-deskripsi"><i class="uil uil-text-fields me-2"></i>Deskripsi Singkat</th>
                                        <th scope="col" class="th-tanggal"><i class="uil uil-calendar-alt me-2"></i>Tanggal</th>
                                        <th scope="col" class="th-aksi">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in programs.program" :key="item.id">
                                        <td class="fw-bold">{{ index+1 }}</td>
                                        <td>
                                            <img :src="`${apiURL}images/programs/${item.cover}`" :alt="item.title" class="w-100 rounded">
                                        </td>
                                        <td>
                                            <span class="d-block mb-1">{{item.title}}</span>
                                            <span class="badge bg-sm me-1">Rp{{NumberFormat(item.harga)}}</span>
                                            <span class="badge" :class="item.type == 'Single' ? 'bg-az' : 'bg-ed'">{{item.type}}</span>
                                        </td>
                                        <td v-html="ShortText(item.short_desc)"></td>
                                        <td>
                                            <span class="badge bg-light d-block text-dark text-start mb-2">Dibuat: <span class="d-block">{{DateFormat(item.createdAt)}}</span></span>
                                            <span class="badge bg-dark d-block text-start">Berakhir: <span class="d-block">{{DateFormat(item.expiredAt)}}</span></span>
                                        </td>
                                        <td align="center">
                                            <a :href="homeURL+'/'+item.slug" class="text-dark fs-4" target="_blank">
                                                <i class="uil uil-eye"></i>
                                            </a>
                                            <router-link :to="'/program/edit/'+item.slug" class="text-primary fs-4"><i class="uil uil-edit"></i></router-link>
                                            <a href="#" class="text-danger fs-4" @click.prevent="getDeleteModal(item.slug)" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="uil uil-trash-alt"></i></a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Paginator v-if="programs.totalPages >= 2" @page="changePage($event)" v-model:rows="programs.limitItems" :totalRecords="programs.totalItems" />
                </template>
                <Message v-else severity="info" :closable="false">{{programs.message}}</Message>
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
import config from '@/config/app'
import Mixins from '@/mixins'

export default {
    mixins: [Mixins],
    data() {
        return {
            apiURL: config.apiURL,
            homeURL: config.homeURL,
            program_slug: null,
            keyword: '',
            type: 'program',
        }
    },
    watch: {
        keyword() {
            this.getPrograms()
        },
    },
    computed: {
        ...mapGetters({
            btnLoading: 'btnLoading',
            programs: 'program/programs',
            programTotal: 'program/programTotal',
            singleTotal: 'program/singleTotal',
            acceptedTotal: 'payments/acceptedTotal',
        }),
    },
    components: { Pulse, AdminHeader, DeleteModal, Breadcrumb },
    created() {
        this.getPrograms('crowdfunding')
        this.setTotalProgram()
        this.getType()
    },
    methods: {
        getType() {
            const pathArray = window.location.pathname.split('/')
            const secondLevelLocation = pathArray[1]
            this.type = secondLevelLocation
        },
        getDeleteModal(slug) {
            this.program_slug = slug
        },
        getPrograms() {
            this.$store.dispatch('program/getPrograms', { page: 0, keyword: this.keyword, type: 'crowdfunding'})
        },
        setTotalProgram() {
            this.$store.dispatch('program/setTotalProgram')
        },
        changePage(event) {
            this.$store.dispatch('program/searchProgram', {
                page: event.page,
                keyword: this.keyword,
                type: 'crowdfunding'
            })
        }
    },
}
</script>

<style lang="scss">
@import '@/assets/sass/admin.scss';
</style>