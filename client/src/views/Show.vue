<template>
    <div>
        <header id="detail-header">
            <nav class="position-absolute bg-transparent text-white">
                <div class="container-nav">
                    <div class="logo">
                        <router-link id="" to="/"><i class="fa-solid fa-arrow-left"></i></router-link>
                    </div>
                </div>
            </nav>
        </header>

        <main id="detail">
            <div id="image-header" v-bind:style="{ backgroundImage: 'url(`@/assets/images/Kuning\ Neon\ Minimal\ Ilustratif\ Layanan\ Manusia\ Penggalangan\ Dana\ Facebook\ Foto\ Sampul\ 1.png`)'}">
            <!-- <div id="image-header" v-bind:style="{ backgroundImage: activeColor, fontSize: fontSize + 'px' }"> -->
                <div class="container-fluid"></div>
            </div>

            <div class="container">
                <div class="col-md-12 py-3">
                    <h2 class="card-title text-center mb-3"> Donasi Badai Lia</h2>
                    <p class="text-start"><strong>Rp100.000.000</strong> / <small class="text-muted">Rp120.000.000</small></p>
                    <ProgressBar :value="progressFunding()"></ProgressBar>
                    
                    <p class="text-end"><small class="text-end">Donasi ditutup 9 hari lagi</small></p>
                    <div class="btn-group d-flex">
                        <button type="button" class="btn btn-info py-3" id="button"><span class="text-donasi">Donasi <i class="fa-solid fa-people-carry-box"></i></span></button>
                    </div>
                </div>
            </div>

            <div class="BeriRezeki container py-3">
                <div class="row">
                    <div class="col-md-6 text-start">
                        <p class="content-title">Tentang Penggalangan Dana</p>
                    </div>
                </div>
                <div class="container text-start">
                    <div class="card-beriRezeki">
                        <div class="col-md-12 py-3">
                            <div class="card shadow-sm mx-5">
                                <img class="bd-placeholder-img card-img-top img-fluid" width="100%" height="225" src="@/assets/images/Kuning Neon Minimal Ilustratif Layanan Manusia Penggalangan Dana Facebook Foto Sampul 1.png" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false">
                                <div class="card-body" id="card-donation-detail">
                                    <div class="text-end mb-3">
                                        <a href="index.html" class=""><i class="fa-solid fa-file-pdf"></i>Lihat Proposal</a>
                                    </div>
                                    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="BeriRezeki container py-3">
                    <div class="row">
                        <div class="col-md-6 text-start">
                            <p class="content-title">Pilihan BeriRezeki</p>
                        </div>
                    </div>
                    <div class="container text-start">
                        <div class="card-beriRezeki">
                            <div class="col-md-12 py-3">
                                <div class="card shadow-sm mx-5">
                                    <div class="card-body">
                                        <div class="col d-flex align-items-start">
                                            <svg class="bd-placeholder-img rounded-circle" width="40" height="40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 140x140" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#777"/><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>
                                            <div>
                                                <h5 class="fw-bold mb-0 pt-2 p-lg-2">Featured title</h5>
                                            </div>
                                        </div>
                                        <p class="card-text pt-4">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                        <hr>
                                        <div class="row">
                                            <div class="col text-start">
                                                <p><strong>5000</strong> <small class="text-muted">orang mengaminkan doa ini</small></p>
                                            </div>
                                            <div class="col text-end">
                                                <a href="index.html"><i class="fa-solid fa-comment-dots"></i>Komentari</a>
                                                <a href="index.html"><i class="fa-regular fa-heart"></i>Aamiin</a>
                                            </div>
                                        </div>
                                        <div class="card-footer py-3 border-0" style="background-color: #f8f9fa;">
                                            <div class="d-flex flex-start w-100">
                                                <div class="form-outline w-100">
                                                    <textarea class="form-control" id="textAreaExample" rows="4" style="background: #fff;"></textarea>
                                                </div>
                                            </div>
                                                <div class="float-end mt-2 pt-1">
                                                    <button type="button" class="btn btn-primary btn-sm">Post comment</button>
                                                </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12 py-3">
                                <div class="card shadow-sm mx-5">
                                    <div class="card-body">
                                        <div class="col d-flex align-items-start">
                                            <svg class="bd-placeholder-img rounded-circle" width="40" height="40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 140x140" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#777"/><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>
                                            <div>
                                                <h5 class="fw-bold mb-0 pt-2 p-lg-2">Featured title</h5>
                                            </div>
                                        </div>
                                        <p class="card-text pt-4">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                        <hr>
                                        <div class="row">
                                            <div class="col text-start">
                                                <p><strong>5000</strong> <small class="text-muted">orang mengaminkan doa ini</small></p>
                                            </div>
                                            <div class="col text-end">
                                                <a href="index.html"><i class="fa-solid fa-comment-dots"></i>Komentari</a>
                                                <a href="index.html"><i class="fa-solid fa-heart"></i>Aamiin</a>
                                            </div>
                                        </div>
                                        <div class="card-footer py-3 border-0" style="background-color: #f8f9fa;">
                                            <div class="d-flex flex-start w-100">
                                                <div class="form-outline w-100">
                                                    <textarea class="form-control" id="textAreaExample" rows="4" style="background: #fff;"></textarea>
                                                </div>
                                            </div>
                                                <div class="float-end mt-2 pt-1">
                                                    <button type="button" class="btn btn-primary btn-sm">Post comment</button>
                                                </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="text-center">
                        <hr size="3" width="100%" color="black">
                        <button type="button" class="btn btn-info" id="button">Lihat Semua</button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<!-- <script>
import Pulse from '@/components/loadings/Pulse.vue'
import { mapGetters } from 'vuex'
import appConfig from '@/config/app'
import Mixins from '@/mixins'

export default {
    mixins: [Mixins],
    data() {
        return {
            page: 'overview',
            index: 1,
            harga: 10000,
            messages: '',
            replykode: null,
            baseComment: null,
            replyMessages: '',
            isAnonymous: false,
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
        this.getProposal()
    },
    watch: {
        messages() {
            if (this.messages == '') this.isAnonymous = false
        },
    },
    components: { Pulse },
    computed: {
        ...mapGetters({
            loadingStatus: 'loadingStatus',
            btnLoading: 'btnLoading',
            authenticated: 'auth/authenticated',
            proposal: 'proposal/proposal',
            proposalComments: 'proposal/proposalComments',
            proposalCommentsLength: 'proposal/proposalCommentsLength',
            user: 'auth/user',
        }),
    },
    methods: {
        checkProfile() {
            return this.authenticated && this.user.user_status == 'Verified'
        },
        checkExpired(expiredAt) {
            const now = new Date()
            return new Date(expiredAt) - now >= 0
        },
        changePage(e) {
            return e == 'overview'
                ? (this.page = 'overview')
                : (this.page = 'PDF')
        },
        selectComment(comment) {
            this.replykode = comment.id
            this.baseComment = comment
        },
        replyComment() {
            this.$store
                .dispatch('proposal/replyComment', {
                    messages: this.replyMessages,
                    kode: this.replykode,
                })
                .then((res) => {
                    if (res.status == 200) {
                        this.getProposal()
                        this.replykode = null
                        this.replyMessages = ''
                    }
                    this.$refs.modalClose.click()
                })
        },
        getProposal() {
            this.$store
                .dispatch('proposal/getProposal', this.$route.params.slug)
                .catch(() => {
                    this.$router.push({ name: 'Home' })
                })
        },
    },
}
</script> -->
<style lang="scss">
@import '@/assets/sass/show.scss';
</style>