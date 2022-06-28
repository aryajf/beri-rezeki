<template>
    <div class="container mt-5">
        <template v-if="comments.totalItems == 0">
            <div class="alert alert-warning">Belum ada yang berkomentar</div>
        </template>
        <template v-else>
            <swiper :breakpoints='{
                "640": {
                    "slidesPerView": 1,
                    "spaceBetween": 10
                },
                "768": {
                    "slidesPerView": 2,
                    "spaceBetween": 20
                },
                "1024": {
                    "slidesPerView": 3,
                    "spaceBetween": 30
                }
            }' :loop="true" :centeredSlides="true" :grabCursor="true" :freeMode="true" class="mySwiper">
                <swiper-slide class="comment-item-home" v-for="comment in comments.comments" :key="comment.id">
                    <div>
                        <div class="d-flex justify-content-center">
                            <img v-if="(comment.user) && (comment.user.avatar !== null)" :src="`${apiURL}//images/avatars/${comment.user.avatar}`" class="w-25 rounded-circle" :alt="comment.messages">
                            <img v-else src="@/assets/images/no-avatar.png" class="w-25" :alt="comment.messages">
                        </div>
                        <h2 class="text-center mt-1">{{comment.user.nama}}</h2>
                        <div class="text-center my-3">{{comment.messages}}</div>
                        <div class="text-center"><router-link :to="'/program/'+comment.program.slug" class="btn btn-info btn-donate">{{comment.program.title}} <i class="fa fa-arrow-right"></i></router-link></div>
                        <hr>
                        <small class="d-block text-center"><span class="fw-bold">{{comment.likes.length}}</span> orang mengaminkan doa ini</small>
                    </div>
                </swiper-slide>
            </swiper>
        </template>
    </div>
</template>

<script setup>
// SETUP
import { ref, computed, onMounted } from 'vue'
import appConfig from '@/config/app'
import store from '@/store'

// SWIPPER
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import SwiperCore, { FreeMode } from 'swiper'
SwiperCore.use([FreeMode])

// GETTERS
const comments = computed(() => store.getters['comments/comments'])
const user = computed(() => store.getters['auth/user'])

// APPS
const apiURL = ref(appConfig.apiURL)

onMounted(() => {
    getComments()
})

const getComments = () => {
    store.dispatch('comments/getComments')
}
</script>

<style lang="scss">
@import '@/assets/sass/comment.scss';
.swiper-slide:hover {
    background-color: #f5f5f5;
    transition: 0.15s ease-out;
}
</style>