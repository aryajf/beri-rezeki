<template>
    <div>
        <!-- MODAL LOGIN ALERT -->
        <div class="modal fade" ref="loginModal" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="loginModalLabel"><i class="uil uil-bell me-2"></i>Pemberitahuan</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Kamu harus login terlebih dahulu sebelum memesan
                    </div>
                    <div class="modal-footer">
                        <a href="#" @click="toLogin()" data-bs-dismiss="modal" class="btn btn-sm btn-primary">Login</a>
                    </div>
                </div>
            </div>
        </div>

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
            <div v-if="program.cover" id="image-header" :style="`background: url('${apiURL}/images/programs/${program.cover}')`"></div>

            <div class="container">
                <div class="col-md-12 py-3">
                    <h2 class="card-title text-center mb-3">{{program.title}}</h2>
                    <div v-html="program.short_desc"></div>
                    <template v-if="program.type == 'Single'">
                        <p class="text-end"><strong>Rp{{NumberFormat(program.harga)}}</strong></p>
                    </template>
                    <template v-else>
                        <p class="text-start"><strong>Rp{{NumberFormat(program.total_funding)}}</strong> / <small class="text-muted">Rp{{NumberFormat(program.harga)}}</small></p>
                        <ProgressBar :value="progressFunding(program.total_funding, program.harga)"></ProgressBar>
                    </template>
                    
                    <p class="text-end"><small class="text-end">{{DateFormatExpired(program.expiredAt)}}</small></p>
                    <div class="btn-group d-flex">
                        <template v-if="authenticated">
                            <router-link v-if="authenticated.role == 'Member'" :to="'/program/'+program.slug+'/donate'" class="d-block w-100"><button type="button" class="btn btn-info py-3 w-100" id="button"><span class="text-donasi">Donasi <i class="fa-solid fa-people-carry-box"></i></span></button></router-link>
                        </template>
                        <a v-else data-bs-toggle="modal" data-bs-target="#loginModal" class="d-block w-100"><button type="button" class="btn btn-info py-3 w-100" id="button"><span class="text-donasi">Donasi <i class="fa-solid fa-people-carry-box"></i></span></button></a>
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
                                    <div class="text-end mb-3" v-if="program.pdf_file">
                                        <a target="_blank" :href="`${apiURL}/pdf/programs/${program.pdf_file}`" class=""><i class="fa-solid fa-file-pdf" download></i> Lihat Program</a>
                                    </div>
                                    <div class="card-text my-3" v-html="program.long_desc"></div>
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
                                            <template v-if="comment.avatar">
                                                <img v-if="comment.isAnonymous" src="@/assets/images/no-avatar.png" class="comment-avatar" alt="User Avatar" srcset="">
                                                <img v-else :src="apiURL+'/images/avatars/'+comment.avatar" class="comment-avatar rounded-circle" alt="User Avatar" srcset="">
                                            </template>
                                            <img v-else src="@/assets/images/no-avatar.png" class="comment-avatar" alt="User Avatar" srcset="">
                                            <div>
                                                <h5 class="fw-bold mb-0" v-if="comment.isAnonymous">Anonim</h5>
                                                <h5 class="fw-bold mb-0" v-else>{{comment.nama}}</h5>
                                                <small class="d-block comment-date text-secondary">{{DateFormat(comment.updatedAt)}}</small>
                                            </div>
                                        </div>
                                        <p class="card-text pt-4">{{comment.messages}}</p>
                                        <hr>
                                        <div class="row">
                                            <div class="col text-start">
                                                <p><strong>{{comment.likes.length}}</strong> <small class="text-muted">orang mengaminkan doa ini</small></p>
                                            </div>
                                            <div class="col text-end">
                                                <template v-if="authenticated">
                                                    <a href="#" v-if="authenticated.role == 'Admin' && comment.reply_comments.length === 0" @click.prevent="selectComment(comment.id)"><i class="fa-solid fa-comment-dots"></i> Komentari</a>&nbsp;
                                                    <button class="btn" v-if="checkLike(authenticated.likes, comment.likes)" :disabled="btnLoading" href="#" @click.prevent="likeComment(comment.id)"><i class="fa-solid fa-heart"></i> Aamiin</button>
                                                    <button class="btn" v-else :disabled="btnLoading" href="#" @click.prevent="likeComment(comment.id)"><i class="fa-regular fa-heart"></i> Aamiin</button>
                                                </template>
                                                <a v-else data-bs-toggle="modal" data-bs-target="#loginModal"><i class="fa-regular fa-heart"></i> Aamiin</a>
                                            </div>
                                        </div>
                                        <div class="card-footer py-3 border-0" style="background-color: #f8f9fa;" v-if="authenticated && authenticated.role == 'Admin' && replykode == comment.id">
                                            <div class="d-flex flex-start w-100">
                                                <div class="form-outline w-100">
                                                    <textarea class="form-control" id="textAreaExample" style="background: #fff;" placeholder="Masukkan balasan anda" rows="3" v-model="replyMessages"></textarea>
                                                </div>
                                            </div>
                                            <div class="float-end mt-2 pt-1">
                                                <button @click="replyComment" type="button" class="btn btn-primary btn-sm">Post comment</button>
                                            </div>
                                        </div>
                                        <template v-if="comment.reply_comments.length !== 0">
                                        <h6 class="fw-bold mt-3">Balasan dari admin:</h6>
                                        <div class="mt-3" v-for="reply_comment in comment.reply_comments" :key="reply_comment.id">
                                            <div class="d-flex justify-content-start">
                                                <div class="comment-user-avatar" :class="user.role == 'Admin' && comment.reply_comments.length === 0  ? '' : 'offset-md-2'">
                                                    <img v-if="reply_comment.isAnonymous" src="@/assets/images/no-avatar.png" class="comment-avatar rounded-circle" alt="Anonim">
                                                    <img v-else-if="reply_comment.avatar" :src="apiURL+'/images/avatars/'+reply_comment.avatar" class="comment-avatar rounded-circle" :alt="reply_comment.nama">
                                                    <img v-else src="@/assets/images/no-avatar.png" class="comment-avatar" :alt="reply_comment.nama">
                                                </div>
                                                <div class="comment-user-name d-flex align-items-center">
                                                    <div>
                                                        <h5 class="d-block fw-bold mb-0">{{reply_comment.nama}} <i class="uil uil-check-circle text-success"></i></h5>
                                                        <small class="d-block comment-date text-secondary">{{DateFormat(reply_comment.updatedAt)}}</small>
                                                        <span class="d-block my-3 comment-text">{{reply_comment.messages}}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
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
                .dispatch('comments/replyComment', {
                    messages: this.replyMessages,
                    kode: this.replykode,
                })
                .then((res) => {
                    if (res.status == 200) {
                        this.getProgram()
                        this.replykode = null
                        this.replyMessages = ''
                    }
                })
        },
        checkLike(authenticated, comment){
            let result = authenticated.filter(function(o1){
                // filter out (!) items in result2
                return comment.some(function(o2){
                    return o1.id === o2.id;          // assumes unique id
                });
            })
            if(result.length == 1){
                return true
            }
            return false
        },
        likeComment(kode) {
            this.$store.dispatch('comments/likeComment', kode).then((res) => {
                if (res.status == 200) {
                    this.getProgram()
                    this.getProfile()
                }
            })
        },
        getProgram() {
            this.$store
                .dispatch('program/getProgram', this.$route.params.slug)
                .catch(() => {
                    this.$router.push({ name: 'Home' })
                })
        },
        getProfile() {
            if(this.authenticated){
                this.$store.dispatch('auth/getProfile')
            }
        },
        toLogin(){
            this.$router.push("/login")
        }
    },
}
</script>
<style lang="scss">
@import '@/assets/sass/show.scss';
</style>