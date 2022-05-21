<template>
    <div class="footer-wrapper">
        <!-- WAVE -->
        <FooterWave />

        <!-- FOOTER -->
        <div class="footer">
            <div class="container">
                <div class="row">
                    <div class="col-md-5">
                        <div class="col-md-12 footer-content">
                            <img src="@/assets/images/logo.png" alt="logo" class="logo">
                            <span class="company-desc">Memudahkan transaksi pembelian barang & jasa serta memyalurkan dana sosial perusahaan / perorangan untuk kegiatan Pemberdayaan Masyarakat</span>
                            <div class="socmed-icon">
                                <a href="https://www.facebook.com/profile.php?id=100073414557051" target="_blank"><img src="@/assets/images/socmed/facebook.svg" alt="facebook"></a>
                                <a href="https://www.instagram.com/pola.pojoklaku/" target="_blank"><img src="@/assets/images/socmed/instagram.svg" alt="instagram"></a>
                                <a href="https://api.whatsapp.com/send?phone=6281292751775" target="_blank"><img src="@/assets/images/socmed/whatsapp.svg" alt="whatsapp"></a>
                            </div>
                        </div>
                    </div>

                    <div class="offset-md-3 col-md-4">
                        <div class="col-md-12 footer-content">
                            <div class="title">
                                <span>Hubungi Kami<i class="uil uil-phone-alt ms-1"></i></span>
                                <div class="line"></div>
                            </div>
                            <ul>
                                <li>
                                    <span class="fw-bold">Telp<i class="uil uil-phone-alt ms-1"></i></span>
                                    (021) 2246 1474
                                </li>
                                <li>
                                    <span class="fw-bold">Phone<i class="uil uil-mobile-android-alt ms-1"></i></span>
                                    0812 9275 1775
                                </li>
                                <li>
                                    <span class="fw-bold">Address <i class="uil uil-map-marker ms-1"></i></span>
                                    Jl. Swadaya No.1 RT 010/02 Komplek PLN Gas Klender – Jakarta Timur 13930
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <span class="footer-text">&copy; <a href="https://berirezeki.digitalinteraktif.com" class="fw-bold text-decoration-none link">Beri Rezeki</a> | All Right Reserved</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import FooterWave from '@/components/waves/FooterWave.vue'
</script>

<style lang="scss" scoped>
@import '@/assets/sass/footer.scss';
</style>