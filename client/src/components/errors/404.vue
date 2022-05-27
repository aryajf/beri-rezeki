<template>
    <div class="error-wrapper d-flex align-items-center">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <img src="@/assets/images/404.png" alt="404" class="w-100">
                </div>
                <div class="col-md-6 d-flex align-items-center">
                    <div>
                        <span class="d-block text-darkBlue number">404</span>
                        <span class="d-block text-darkBlue heading">PAGE NOT FOUND</span>
                        <p class="caption text-wa text-center">Halaman yang anda kunjungi tidak ditemukan atau mungkin sudah kadaluarsa</p>
                        <div class="text-center"><router-link to="/" class="btn text-darkBlue"><i class="fa-solid fa-arrow-left me-1"></i>Kembali ke halaman utama</router-link></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scope>
.error-wrapper {
    min-height: 100vh;
    .number,
    .heading {
        font-weight: 500;
        font-family: Belligan;
        text-align: center;
    }
    .number {
        font-size: 10rem;
        line-height: 100px;
    }
    .heading {
        font-size: 3.5rem;
    }
    .caption {
        font-size: 1.5rem;
        font-weight: 400;
    }
}

@media screen and (max-width: 768px) {
    .error-wrapper {
        .number {
            font-size: 4rem;
            line-height: 50px;
            margin-top: 50px;
        }
        .heading {
            font-size: 2rem;
        }
        .caption {
            font-size: 1rem;
        }
    }
}
</style>