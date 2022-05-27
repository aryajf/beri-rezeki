<template>
    <main>
        <!-- -------------------------------------------------- JUMBOTRON ------------------------------------------------>
        <div class="jumbotron pt-5">
            <div class="container">
                <div class="row">
                    <div class="col-md-6 text-start">
                        <h1>Bersatu Kita Teguh</h1>
                        <h5>Panggilan donasi untuk mereka yang membutuhkan</h5>
                        <p>Wabah Covid-19 yang disusul karantina masyarakat telah menyebabkan banyak rumah tangga kehilangan mata pencaharian dan pendapatan.</p>
                    </div>
                    <div class="col-md-6 header-image-right">
                        <img src="@/assets/images/banner.svg" alt="" class="w-100">
                    </div>
                </div>
            </div>
        </div>
        <!-- -------------------------------------------------- END JUMBOTRON -------------------------------------------->
        
        
        
        <!-- --------------------------------------------------    BANNER     -------------------------------------------->
        <div class="m-3 banner">
            <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    <div class="carousel-item active" data-bs-interval="2000">
                        <a href="#"><img src="@/assets/images/jumbotron.jpeg" class="d-block w-100 img-fluid" alt="..."></a>
                    </div>
                    <div class="carousel-item" data-bs-interval="2000">
                        <a href="#"><img src="@/assets/images/Kuning Neon Minimal Ilustratif Layanan Manusia Penggalangan Dana Facebook Foto Sampul 1.png" class="d-block w-100 img-fluid" alt="..."></a>
                    </div>
                    <div class="carousel-item" data-bs-interval="2000">
                        <a href="#"><img src="@/assets/images/Putih Trendi Fotosentris Layanan Manusia Penggalangan Dana Facebook Foto Sampul 1.png" class="d-block w-100 img-fluid" alt="..."></a>
                    </div>
                </div>
            </div>
        </div>
        <!-- --------------------------------------------------  END BANNER ---------------------------------------------->



        <!-- --------------------------------------------------  BeriDonasi ---------------------------------------------->
        <div class="BeriDonasi container py-3">
            <div class="row">
                <div class="col-md-6 text-start">
                    <p class="content-title">BeriDonasi</p>
                </div>
                <div class="col-md-6 text-end">
                    <form class="d-flex" role="search">
                        <input class="form-control me-2" v-model="keyword" type="search" placeholder="Search" aria-label="Search">
                    </form>
                </div>
            </div>
            <div class="container px-5">
                <div class="row" v-if="programs.program && programs.totalItems != 0">
                    <div class="col-md-6 py-3" v-for="program in programs.program" :key="program.id">
                        <div class="card shadow-sm">
                            <img class="bd-placeholder-img card-img-top img-fluid" width="100%" height="225" :src="`${apiURL}/images/programs/${program.cover}`" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false">
                            <div class="card-body">
                                <h5 class="card-title">{{ program.title }}</h5>
                                <p class="card-text">{{ program.short_desc }}</p>
                                <p v-if="program.type == 'Single'" class="card- text-end"><small class="text-muted text-end">Rp{{NumberFormat(program.harga)}}</small></p>
                                <template v-if="program.type == 'Crowdfunding'">
                                    <ProgressBar :value="progressFunding(program.total_funding, program.harga)">
                                    </ProgressBar>
                                    <p class="card- text-end"><small class="text-muted text-end">Rp{{NumberFormat(program.total_funding)}} / Rp{{NumberFormat(program.harga)}}</small></p>
                                </template>
                                <div class="d-flex justify-content-between align-items-center mt-3">
                                    <div class="btn-group">
                                        <router-link :to="program.slug" class="btn btn-info">Donasi</router-link>
                                    </div>
                                    <small class="text-muted text-end">{{ DateFormatExpired(program.expiredAt) }}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Message v-else severity="info" :closable="false">{{programs.message}}</Message>
    
                <Paginator aria-label="Halaman BeriDonasi" v-if="programs.totalPages >= 2" @page="changePage($event)" v-model:rows="programs.limitItems" :totalRecords="programs.totalItems" />
            </div>
        </div>
        <!-- ------------------------------------------------ END CONTENT  BeriDonasi ----------------------------------->



        <!-- ------------------------------------------------         CAROUSEL         ---------------------------------->
        <div class="my-1 mx-3">
            <div id="carouselExampleInterval" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    <div class="carousel-item active" data-bs-interval="10000">
                        <img src="@/assets/images/Putih Trendi Fotosentris Layanan Manusia Penggalangan Dana Facebook Foto Sampul 1.png" class="d-block w-100 img-fluid" alt="...">
                        <div class="container carousel-donasi">
                            <div class="carousel-caption text-start">
                                <h1>Nama Donasi</h1>
                                <p>Deskripsi</p>
                                <button class="btn btn-info" type="submit">Donasi</button>
                            </div>
                        </div>
                    </div>
                    <div class="carousel-item" data-bs-interval="2000">
                    <img src="@/assets/images/Putih Trendi Fotosentris Layanan Manusia Penggalangan Dana Facebook Foto Sampul 1.png" class="d-block w-100 img-fluid" alt="...">
                    <div class="container carousel-donasi">
                        <div class="carousel-caption text-start">
                            <h1>Nama Donasi</h1>
                            <p>Deskripsi</p>
                            <button class="btn btn-info" type="submit">Donasi</button>
                        </div>
                    </div>
                    </div>
                    <div class="carousel-item">
                    <img src="@/assets/images/Putih Trendi Fotosentris Layanan Manusia Penggalangan Dana Facebook Foto Sampul 1.png" class="d-block w-100 img-fluid" alt="...">
                    <div class="container carousel-donasi">
                        <div class="carousel-caption text-start">
                            <h1>Nama Donasi</h1>
                            <p>Deskripsi</p>
                            <button class="btn btn-info" type="submit">Donasi</button>
                        </div>
                    </div>
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>
        <!-- ---------------------------------------------------  END CONTENT CAROUSEL ----------------------------------->



        <!-- ---------------------------------------------------        BeriDoa         ---------------------------------->
        <div class="BeriDoa container py-3">
            <div class="row">
                <div class="col-md-6 text-start">
                    <p class="content-title">BeriDoa</p>
                </div>
            </div>
            <div class="container mt-5">
                <div class="row px-5 py-1">
                    <div class="col-lg-4">
                        <svg class="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 140x140" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#777"/><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>
                        <h2>Nama</h2>
                        <p>Some representative placeholder content for the three columns of text below the carousel. This is the first column.</p>
                        <p><a class="btn btn-secondary" href="#">Nama Donasi &raquo;</a></p>
                    </div>
                    <div class="col-lg-4">
                        <svg class="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 140x140" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#777"/><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>
                        <h2>Nama</h2>
                        <p>Another exciting bit of representative placeholder content. This time, we've moved on to the second column.</p>
                        <p><a class="btn btn-secondary" href="#">Nama Donasi &raquo;</a></p>
                    </div>
                    <div class="col-lg-4">
                        <svg class="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 140x140" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#777"/><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>
                        <h2>Nama</h2>
                        <p>And lastly this, the third column of representative placeholder content.</p>
                        <p><a class="btn btn-secondary" href="#">Nama Donasi &raquo;</a></p>
                    </div>
                </div>
            </div>
        </div>
        <!-- ----------------------------------------------------- END CONTENT BeriDoa ----------------------------------->



        <!-- -----------------------------------------------------      BeriRezeki     ----------------------------------->
        <div class="BeriRezeki container py-3">
            <div class="row">
                <div class="col-md-6 text-start">
                    <p class="content-title">Pilihan BeriRezeki</p>
                </div>
            </div>
            <div class="container text-start">
                <div class="card-beriRezeki">
                    <div class="col-md-12 py-3" v-for="program in crowdPrograms.program" :key="program.id">
                        <div class="card shadow-sm mx-5">
                            <img class="bd-placeholder-img card-img-top img-fluid" width="100%" height="225" src="@/assets/images/Kuning Neon Minimal Ilustratif Layanan Manusia Penggalangan Dana Facebook Foto Sampul 1.png" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false">
                            <div class="card-body">
                                <h5 class="card-title">{{program.title}}</h5>
                                <p class="card-text">{{program.short_desc}}</p>
                                <ProgressBar :value="progressFunding(program.total_funding, program.harga)">
                                </ProgressBar>
                                <p class="card- text-end"><small class="text-muted text-end">Rp{{NumberFormat(program.total_funding)}} / Rp{{NumberFormat(program.harga)}}</small></p>
                                <div class="d-flex justify-content-between align-items-center mt-3">
                                    <div class="btn-group">
                                        <router-link :to="program.slug" class="btn btn-info">Donasi</router-link>
                                    </div>
                                    <small class="text-muted text-end">{{ DateFormatExpired(program.expiredAt) }}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-center">
                <hr size="3" width="100%" color="black">
                <button type="button" class="btn btn-info">Lihat Semua</button>
            </div>
        </div>
        <!-- ------------------------------------------------- END CONTENT BeriRezeki ------------------------------------>
    </main>
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Rolling from '@/components/loadings/Rolling.vue'
// import Comments from '@/components/layouts/Comments.vue'
import appConfig from '@/config/app'
import store from '@/store'

// SWIPER
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import SwiperCore, { FreeMode } from 'swiper'
SwiperCore.use([FreeMode])

const loadingStatus = computed(() => store.getters['loadingStatus'])
const btnLoading = computed(() => store.getters['btnLoading'])
const programs = computed(() => store.getters['program/programs'])
const singlePrograms = computed(
    () => store.getters['program/singlePrograms']
)
const crowdPrograms = computed(() => store.getters['program/crowdPrograms'])

const apiURL = ref(appConfig.apiURL)
const keyword = ref('')
const index = ref(null)
const paginationSearch = ref(false)

watch(keyword, () => {
    search()
})

onMounted(() => {
    getPrograms()
    // getSinglePrograms()
    getCrowdfundingPrograms()
})

const getPrograms = () => {
    paginationSearch.value = false
    store.dispatch('program/getPrograms', {keyword: keyword.value})
}
// const getSinglePrograms = () => {
//     paginationSearch.value = false
//     store.dispatch('program/getSinglePrograms', {})
// }
const getCrowdfundingPrograms = () => {
    paginationSearch.value = false
    store.dispatch('program/getCrowdfundingPrograms', {})
}

const changePage = (event) => {
    if (paginationSearch.value == true) {
        const data = { keyword: keyword.value, page: event.page }
        store.dispatch('program/searchProgram', { keyword: keyword.value, page: event.page })
    } else {
        store.dispatch('program/getPrograms', {page: event.page})
    }
}
const changePageSingle = (event) => {
    store.dispatch('program/getSinglePrograms', {page: event.page})
}

const changePageCrowd = (event) => {
    store.dispatch('program/getCrowdfundingPrograms', {page: event.page})
}

const search = () => {
    paginationSearch.value = true
    if (keyword.value != '') {
        store.dispatch('program/getPrograms', { keyword: keyword.value })
    } else {
        getPrograms()
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/sass/home.scss';
.swiper-slide:hover {
    background-color: #f5f5f5;
    transition: 0.15s ease-out;
}
</style>
