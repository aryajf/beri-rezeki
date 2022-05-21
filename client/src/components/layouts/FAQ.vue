<template>
    <div class="accordion" id="FAQ">
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    <i class="uil uil-plus me-3 text-yellow"></i>Bagaimana cara menghubungi Pojoklaku jika ada pertanyaan saya yang tidak terjawab?
                </button>
            </h2>
            <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#FAQ">
                <div class="accordion-body">
                    Dapat menghubungi Call Center kami di <strong>0812 9275 1775</strong> atau dapat melalui halaman contact pojoklaku.
                </div>
            </div>
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingSix">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
                    <i class="uil uil-plus me-3 text-yellow"></i>
                    Siapa saja yang bisa bergabung dalam program Pojok Sosial dan Pojok Investasi?
                </button>
            </h2>
            <div id="collapseSix" class="accordion-collapse collapse" aria-labelledby="headingSix" data-bs-parent="#FAQ">
                <div class="accordion-body">
                    Semua bisa bergabung di Pojok Sosial dan Pojok Investasi, baik individu maupun perusahaan.
                </div>
            </div>
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingTwo">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    <i class="uil uil-plus me-3 text-yellow"></i>Siapa saja yang bisa berkunjung ke Pojok Wisata?
                </button>
            </h2>
            <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#FAQ">
                <div class="accordion-body">
                    Yang bisa berkunjung ke Pojok Wisata adalah <strong>semua kalangan</strong>. Mulai dari usia 5 tahun hingga lansia. Dengan rincian tujuan : Field Trip, Study Tour, Study Tiru, Study Banding dan Duplikasi.
                </div>
            </div>
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingFour">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                    <i class="uil uil-plus me-3 text-yellow"></i>
                    Apa saja merchandise yang bisa didapat di Pojok Wisata?
                </button>
            </h2>
            <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#FAQ">
                <div class="accordion-body">
                    Merchandise yang bisa didapatkan diantaranya : benih, bibit sayur, Mini Kit Hidroponik, Starter Kit Hidroponik, kaos, topi, mug, tumbler, Dompet Recycle.
                </div>
            </div>
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingThree">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    <i class="uil uil-plus me-3 text-yellow"></i>
                    Apakah Pojok NyiMas bisa untuk nasabah luar daerah?
                </button>
            </h2>
            <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#FAQ">
                <div class="accordion-body">
                    <strong>Bisa</strong>, Sebab Pojok NyiMas bekerja sama dengan jasa pengiriman emas terpercaya yakni <strong>RPX</strong>. Dimana kualitas jasa antarnya sudah terpercaya dan pengiriman ini pun dijamin Asuransi.
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.accordion-item {
    border: none;
    background: #f6f8fd;
    .accordion-button {
        font-size: 17px;
        background: none;
        color: #323b46;
        &:after {
            display: none;
        }
        &:active {
            background: #f0f4ff;
        }
        &:focus {
            background: #f0f4ff;
        }
        &:not(.collapsed) {
            color: #323b46;
            background: #f0f4ff;
        }
    }
    .accordion-body {
        font-size: 17px;
        color: #323b46;
    }
}

@media screen and (max-width: 768px) {
    .accordion-item {
        .accordion-button {
            font-size: 15px;
        }
        .accordion-body {
            font-size: 15px;
        }
    }
}
</style>