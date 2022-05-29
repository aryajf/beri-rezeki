<template>
    <div>
        <header id="detail-header">
            <nav class="position-absolute bg-transparent text-white">
                <div class="container-nav">
                    <div class="back-button-show">
                        <router-link id="" to="/"><i class="fa-solid fa-arrow-left"></i></router-link>
                    </div>
                </div>
            </nav>
        </header>

        <main id="detail">
            <div v-if="program.cover" id="image-header" :style="`background: url('${apiURL}/images/programs/${program.cover}');`"></div>

            <div class="container">
                <div class="col-md-12 py-3">
                    <h2 class="card-title text-center mb-3">{{program.title}}</h2>
                    <div>{{ program.short_desc }}</div>
                    <template v-if="program.type == 'Single'">
                        <p class="text-end"><strong>Rp{{NumberFormat(program.harga)}}</strong></p>
                    </template>
                    <template v-else>
                        <p class="text-start"><strong>Rp{{NumberFormat(program.total_funding)}}</strong> / <small class="text-muted">Rp{{NumberFormat(program.harga)}}</small></p>
                        <ProgressBar :value="progressFunding(program.total_funding, program.harga)"></ProgressBar>
                    </template>
                    
                    <p class="text-end"><small class="text-end">{{DateFormatExpired(program.expiredAt)}}</small></p>
                    <div class="btn-group d-flex">
                        <router-link :to="'/program/'+program.slug+'/donate'" class="d-block w-100"><button type="button" class="btn btn-info py-3 w-100" id="button"><span class="text-donasi">Donasi <i class="fa-solid fa-people-carry-box"></i></span></button></router-link>
                    </div>
                </div>
            </div>

            <div class="BeriRezeki container py-3">
                <div class="row">
                    <div class="col-md-6 text-start">
                        <h5 class="content-title">Tentang Penggalangan Dana</h5>
                    </div>
                </div>
                <div class="container text-start">
                    <div class="card-beriRezeki">
                        <div class="col-md-12 py-3">
                            <div class="card shadow-sm mx-5">
                                <img v-if="program.cover" class="bd-placeholder-img card-img-top img-fluid" width="100%" height="225" :src="`${apiURL}/images/programs/${program.cover}`" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false">
                                <img v-else class="bd-placeholder-img card-img-top img-fluid" width="100%" height="225" src="@/assets/images/image-not-available.png" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false">
                                <div class="card-body" id="card-donation-detail">
                                    <div class="text-end mb-3">
                                        <a href="index.html" class=""><i class="fa-solid fa-file-pdf"></i> Lihat Program</a>
                                    </div>
                                    <p class="card-text">{{ program.long_desc }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="BeriRezeki container py-3" v-if="programComments && programCommentsLength != 0">
                    <div class="row">
                        <div class="col-md-6 text-start">
                            <p class="content-title">{{programCommentsLength}} Komentar</p>
                        </div>
                    </div>
                    <div class="container text-start">
                        <div class="card-beriRezeki">
                            <div class="col-md-12 py-3" v-for="comment in programComments" :key="comment.id">
                                <div class="card shadow-sm mx-5">
                                    <div class="card-body">
                                        <div class="col d-flex align-items-center">
                                            <img v-if="comment.avatar" :src="apiURL+'images/avatar/'+comment.avatar" class="comment-avatar" alt="" srcset="">
                                            <img v-else src="@/assets/images/no-avatar.png" class="comment-avatar" alt="" srcset="">
                                            <div>
                                                <h5 class="fw-bold mb-0 pt-2 p-lg-2" v-if="comment.isAnonymous">Anonim</h5>
                                                <h5 class="fw-bold mb-0 pt-2 p-lg-2" v-else>{{comment.nama}}</h5>
                                            </div>
                                        </div>
                                        <p class="card-text pt-4">{{comment.messages}}</p>
                                        <hr>
                                        <div class="row">
                                            <div class="col text-start">
                                                <p><strong>5000</strong> <small class="text-muted">orang mengaminkan doa ini</small></p>
                                            </div>
                                            <div class="col text-end">
                                                <a href="#" @click.prevent="selectComment(comment.id)"><i class="fa-solid fa-comment-dots"></i> Komentari</a>&nbsp;
                                                <a href="#"><i class="fa-regular fa-heart"></i> Aamiin</a>
                                            </div>
                                        </div>
                                        <div class="card-footer py-3 border-0" style="background-color: #f8f9fa;" v-if="replykode == comment.id">
                                            <div class="d-flex flex-start w-100">
                                                <div class="form-outline w-100">
                                                    <textarea class="form-control" id="textAreaExample" style="background: #fff;" placeholder="Masukkan balasan anda" rows="3" v-model="replyMessages"></textarea>
                                                </div>
                                            </div>
                                            <div class="float-end mt-2 pt-1">
                                                <button @click="replyComment" type="button" class="btn btn-primary btn-sm">Post comment</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="BeriRezeki container py-3" v-else>
                    <h5 class="m-0">Komentar<i class="uil uil-comments ms-1"></i></h5>
                    <small>Belum ada komentar</small>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import Pulse from '@/components/loadings/Pulse.vue'
import { mapGetters } from 'vuex'
import appConfig from '@/config/app'
import Mixins from '@/mixins'

export default {
    mixins: [Mixins],
    data() {
        return {
            index: 1,
            harga: 10000,
            messages: '',
            replykode: null,
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
        this.getProgram()
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
            program: 'program/program',
            programComments: 'program/programComments',
            programCommentsLength: 'program/programCommentsLength',
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
        selectComment(id) {
            this.replykode = id
            this.replyMessages = ''
        },
        replyComment() {
            this.$store
                .dispatch('program/replyComment', {
                    messages: this.replyMessages,
                    kode: this.replykode,
                })
                .then((res) => {
                    if (res.status == 200) {
                        this.getProgram()
                        this.replykode = null
                        this.replyMessages = ''
                    }
                    this.$refs.modalClose.click()
                })
        },
        getProgram() {
            this.$store
                .dispatch('program/getProgram', this.$route.params.slug)
                .catch(() => {
                    this.$router.push({ name: 'Home' })
                })
        },
    },
}
</script>
<style lang="scss">
@import '@/assets/sass/show.scss';
</style>