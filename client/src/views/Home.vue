<template>
    <div>
        <!-- HEADER -->
        <div class="header d-flex">
            <div class="container">
                <div class="row">
                    <div class="col-md-6 header-image-left">
                        <img src="@/assets/images/urban.png" alt="Welcome" class="w-100">
                    </div>
                    <div class="col-md-6 d-flex justify-content-center align-items-center header-text">
                        <div>
                            <h1 data-aos="fade-right">
                                Dukung Pemberdayaan Masyarakat Bersama
                                <span class="logo-text-st">Pojok</span>
                                <span class="logo-text-nd">laku</span>
                            </h1>
                            <p>Memudahkan transaksi pembelian barang & jasa serta memyalurkan dana sosial perusahaan/perorangan untuk kegiatan Pemberdayaan Masyarakat</p>
                            <router-link to="/about" class="btn bg-yellow text-white me-2"><i class="uil uil-building me-1"></i>Tentang Pojoklaku</router-link>
                            <a href="#product" class="btn outline-yellow">Explore</a>
                        </div>
                    </div>
                    <div class="col-md-6 header-image-right">
                        <img src="@/assets/images/urban.png" alt="Welcome" class="w-100">
                    </div>
                </div>
            </div>
        </div>

        <!-- ABOUT -->
        <div class="about">
            <div class="container">
                <div class="row">
                    <div class="col-md-5 about-image">
                        <img src="@/assets/images/wisata-edukasi.png" alt="wisata edukasi" class="w-100">
                    </div>
                    <div class="col-md-7 about-text">
                        <span class="content-badge badge bg-outline-blue">Pojoklaku</span>
                        <h2 class="content-heading logo-text">Apa sih
                            <span class="logo-text">
                                <span class="logo-text-st">Pojok</span>
                                <span class="logo-text-nd">laku</span>?
                            </span>
                        </h2>
                        <p>Kondisi ekonomi yang makin terasa sulit ditahun 2020 akibat Pandemi yang hadir, memaksa kita untuk harus melakukan transaksi dari rumah. Mulai dari belanja barang dan jasa hingga menyalurkan zakat, infaq dan sodaqoh. Maka dengan alasan ini lahirlah
                            <span class="logo-text">
                                <span class="logo-text-st">Pojok</span>
                                <span class="logo-text-nd">laku</span>
                            </span>.
                        </p>
                        <router-link to="/about" class="btn btn-sm outline-darkBlue"><i class="uil uil-link me-1"></i>Lihat Selengkapnya</router-link>
                    </div>
                </div>
            </div>
        </div>

        <!-- TESTIMONI -->
        <div class="testimoni">
            <div class="container">
                <div class="text-center">
                    <span class="content-badge badge bg-outline-blue">Testimoni</span>
                    <h2 class="content-heading">
                        Kata Mereka Tentang <br>
                        <span class="logo-text-st">Pojok</span>
                        <span class="logo-text-nd">laku</span>
                    </h2>
                </div>

                <div class="row">
                    <swiper :breakpoints='{
                        "640": {
                            "slidesPerView": 1,
                            "spaceBetween": 20
                        },
                        "768": {
                            "slidesPerView": 2,
                            "spaceBetween": 40
                        },
                        "1024": {
                            "slidesPerView": 3,
                            "spaceBetween": 50
                        }
                    }' :loop="true" :centeredSlides="true" :grabCursor="true" :freeMode="true" class="mySwiper">
                        <swiper-slide class="testimoni-item">
                            <div>
                                <blockquote class="blockquote fst-italic feedback-word">
                                    <p>"Kereeen, mempunyai tujuan yang sangat mulia. Dan begitu kami berkunjung di Pojok Wisata ini, sambutan yang hangat oleh tim Pojok Wisata, membuat saya yakin, dan ingin menjadi bagian untuk bermanfaat bagi orang sebanyak-banyaknya."
                                    </p>
                                </blockquote>
                                <figcaption class="blockquote-footer">Haekal Ramadhan</figcaption>
                            </div>
                        </swiper-slide>
                        <swiper-slide class="testimoni-item">
                            <div>
                                <blockquote class="blockquote fst-italic feedback-word">
                                    <p>"Alhamdulillah dari sini anak2 dapat belajar banyak tentang pengolahan sampah dan tanaman hidroponik,padahal awalnya sempat kurang tertarik anak2 ketika dibilang ke bank sampah (karena kurangnya pemahaman tentang pemanfaatan sampah) 😊😊 Salam kangen pengen kesana lagi dr kami guru dan anak2 SDIT Al-amanah 😊🙏😘"
                                    </p>
                                </blockquote>
                                <figcaption class="blockquote-footer">Haru Icha</figcaption>
                            </div>
                        </swiper-slide>
                        <swiper-slide class="testimoni-item">
                            <div>
                                <blockquote class="blockquote fst-italic feedback-word">
                                    <p>"Banyak ilmu di Pojok Wisata, salah satunya tentang bagaimana memanfaatkan sampah untuk menjadi rupiah. Disini kita menjadi sadar bahwa peduli tentang sampah akan membawa banyak manfaat. Teman-teman dari Pojok Wisata memiliki kompetensi tinggi tentang bagaimana kita menyikapi sampah"
                                    </p>
                                </blockquote>
                                <figcaption class="blockquote-footer">Vendy Sukmawan</figcaption>
                            </div>
                        </swiper-slide>
                        <swiper-slide class="testimoni-item">
                            <div>
                                <blockquote class="blockquote fst-italic feedback-word">
                                    <p>"Pojok Wisata is very well managed waste bank in Indonesia esp in Jakarta. They started from basic level and now they developed become an advanced waste bank. They capture all environmental economic aspects & welcome all stakeholders to be their partners. I appreciate Bank Sampah Pojok Wisata & all the best 👍"
                                    </p>
                                </blockquote>
                                <figcaption class="blockquote-footer">N Widyaningsih</figcaption>
                            </div>
                        </swiper-slide>
                        <swiper-slide class="testimoni-item">
                            <div>
                                <blockquote class="blockquote fst-italic feedback-word">
                                    <p>"Kereeen, mempunyai tujuan yang sangat mulia. Dan begitu kami berkunjung di Pojok Wisata, sambutan yang hangat oleh founder, membuat saya yakin, dan ingin menjadi bagian untuk bermanfaat bagi orang sebanyak-banyaknya."
                                    </p>
                                </blockquote>
                                <figcaption class="blockquote-footer">Haekal Ramadhan</figcaption>
                            </div>
                        </swiper-slide>
                        <swiper-slide class="testimoni-item">
                            <div>
                                <blockquote class="blockquote fst-italic feedback-word">
                                    <p>"Tempat yg bagus buat meningkatkan kepedulian akan lingkungan. Ada hasil kreasi daur ulang plastik, ada bank sampah, ada penjelasan ttg cara bertanam hidroponik, ada fasilitas nyicil emas. Buat yg belum pernah rekomended sih buat nambah wawasan. (:"
                                    </p>
                                </blockquote>
                                <figcaption class="blockquote-footer">Fazli Alfa</figcaption>
                            </div>
                        </swiper-slide>
                        <swiper-slide class="testimoni-item">
                            <div>
                                <blockquote class="blockquote fst-italic feedback-word">
                                    <p>"Pojoklaku sangat menginspirasi kami. Semangat para pengurus utk terus memajukan koperasi patut dijadikan contoh oleh para generasi muda. Produk2 di Pojoklaku jg mampu diadaptasi di tempat lain siapapun dpt bersinergi positif dengan Pojoklaku. Maju terus & tetap semangat!"
                                    </p>
                                </blockquote>
                                <figcaption class="blockquote-footer">Diary Mila</figcaption>
                            </div>
                        </swiper-slide>
                    </swiper>
                </div>
            </div>
        </div>

        <div class="faq" id="faq">
            <div class="container">
                <div class="row">
                    <div class="col-md-6 faq-image-left">
                        <img src="@/assets/images/faq.png" alt="faq" class="w-100">
                    </div>
                    <div class="col-md-6">
                        <span class="content-badge badge bg-outline-blue">FAQ</span>
                        <h2 class="content-heading">Frequently Asked <br> Question</h2>
                        <FAQ />
                    </div>
                    <div class="col-md-6 faq-image-right">
                        <img src="@/assets/images/faq.png" alt="faq" class="w-100">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
// SWIPER
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import SwiperCore, { FreeMode } from 'swiper'
SwiperCore.use([FreeMode])

// FAQ
import FAQ from '@/components/layouts/FAQ.vue'
</script>

<style lang="scss" scoped>
@import '@/assets/sass/home.scss';
.swiper-slide:hover {
    background-color: #f5f5f5;
    transition: 0.15s ease-out;
}
</style>
