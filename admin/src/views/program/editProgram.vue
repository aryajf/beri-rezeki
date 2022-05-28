<template>
    <div>
        <Breadcrumb :program_slug="program.slug" />
        <!-- CROP COVER MODAL -->
        <div class="modal fade" id="cropModal" tabindex="-1" aria-labelledby="cropModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="cropModalLabel"><i class="uil uil-image-edit me-1"></i>Choose Cover</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <div class="coverPreview shadow-sm mb-3 text-center">
                            <img v-if="program.cover" :src="`${apiURL}images/programs/${program.cover}`" class="w-100" alt="cover">
                            <img v-else src="@/assets/images/image-not-available.png" class="w-100" alt="cover">
                        </div>
                        <div class="form-group mb-3">
                            <label for="cover">
                                <span class="btn btn-sm bg-az"><i class="uil uil-export me-1"></i>Pilih Cover</span>
                                <button id="saveBtn" class="btn btn-sm btn-primary ms-2 d-none" data-bs-dismiss="modal" @click="cropCover" :disabled="btnLoading">
                                    <div class="d-flex">
                                        <span>Simpan</span>
                                        <template v-if="btnLoading">
                                            <Pulse />
                                        </template>
                                        <template v-else><i class="uil uil-save ms-1"></i></template>
                                    </div>
                                </button>
                            </label>
                            <input type="file" class="d-none" id="cover" v-on:change="onImageChange">
                        </div>
                        <div id="cropper-canvas" class="d-none">
                            <vue-cropper ref="cropper" alt="Crop Image" :background="false" :zoomable="true" :movable="false" :aspect-ratio="16 / 9" preview=".coverPreview" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- EDIT PROPOSAL -->
        <div class="bg-white admin-wrapper">
            <AdminHeader />
            <div class="admin-body">
                <h1 class="admin-body-heading"><i class="uil uil-edit me-1"></i>Edit Program</h1>
                <form action="#" @submit.prevent="submit">
                    <div class="row">
                        <div class="col-xl-4 col-12">
                            <div class="form-group">
                                <img v-if='imagePreview' :src="imagePreview" alt="image" class="added-image w-100">
                                <img v-else-if="program.cover" :src="`${apiURL}images/programs/${program.cover}`" :alt="program.cover" class="added-image w-100">

                                <label data-bs-toggle="modal" data-bs-target="#cropModal" class="mt-2">
                                    <span class="btn bg-secondary text-white btn-sm">Ganti Cover<i class="uil uil-image-upload ms-1"></i></span>
                                </label>
                            </div>

                            <div class="form-group">
                                <div class="row">
                                    <label for="" class="form-label">
                                        Pilih Program
                                        <span class="text-danger text-sm" v-if="formErrors.pdf_file">*{{formErrors.pdf_file[0]}}</span>
                                    </label>
                                    <div class="col-xl-2 col-3 d-flex align-items-center">
                                        <label for="pdf">
                                            <img src="@/assets/images/pdf-file.png" alt="pdf" class="w-100 cursor-pointer">
                                        </label>
                                        <input type="file" class="d-none" id="pdf" v-on:change="onPDFChange">
                                    </div>
                                    <div class="col-xl-10 col-9 d-flex align-items-center">
                                        <div>
                                            <label for="pdf" class="cursor-pointer">
                                                <span class="text-wa fw-bold d-block">
                                                    {{ form.pdf_file ? pdfName : program.title }}
                                                </span>
                                                <span class="text-secondary text-sm">
                                                    {{ pdfSize }}
                                                </span>
                                            </label>
                                            <input type="file" class="d-none" id="pdf" v-on:change="onPDFChange">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-8 col-12">
                            <div class="form-group">
                                <label for="">
                                    Judul Program
                                    <span class="text-danger text-sm" v-if="formErrors.title">*{{formErrors.title[0]}}</span>
                                </label>
                                <input type="text" class="form-control" :class="{'is-invalid': formErrors.title && formErrors.title.length > 0}" placeholder="Masukkan judul" v-model="program.title">
                            </div>
                            <div class="form-group">
                                <label for="">
                                    Tipe Program
                                    <span class="text-danger text-sm" v-if="formErrors.type">*{{formErrors.type[0]}}</span>
                                </label>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="type" value="Single" v-model="type" id="type1" checked>
                                    <label class="form-check-label" for="type1">
                                        Single Program
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="type" value="Crowdfunding" v-model="type" id="type2">
                                    <label class="form-check-label" for="type2">
                                        Crowd Funding Program
                                    </label>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="">
                                    Tanggal Berakhir
                                    <span class="text-danger text-sm" v-if="formErrors.expiredAt">*{{formErrors.expiredAt[0]}}</span>
                                </label>
                                <div class="input-group">
                                <Calendar id="icon" v-model="form.expiredAt" :showIcon="true" class="w-100" dateFormat="dd / mm / yy" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="">
                                    <template v-if="type == 'Single'">Harga</template><template v-else-if="type == 'Crowdfunding'">Maksimal Harga</template>
                                    <span class="text-danger text-sm" v-if="formErrors.harga">*{{formErrors.harga[0]}}</span>
                                </label>
                                <div class="p-inputgroup">
                                    <span class="p-inputgroup-addon">
                                        Rp
                                    </span>
                                    <InputNumber class="w-100" :min="10000" :class="{'is-invalid': formErrors.harga && formErrors.harga.length > 0}" :placeholder="type == 'Single' ? 'Masukkan harga' : 'Masukkan maksimal harga'" v-model="form.harga" mode="decimal" />
                                </div>
                                <div><small>Minimal harga Rp10.000</small></div>
                            </div>
                            <div class="form-group">
                                <label for="">
                                    Deskripsi Singkat
                                    <span class="text-danger text-sm" v-if="formErrors.short_desc">*{{formErrors.short_desc[0]}}</span>
                                </label>
                                <Editor :class="{'p-invalid': formErrors.short_desc && formErrors.short_desc.length > 0}" v-model="form.short_desc" editorStyle="height: 100px">
                                    <template #toolbar>
                                        <span class="ql-formats">
                                            <button class="ql-bold"></button>
                                            <button class="ql-italic"></button>
                                            <button class="ql-underline"></button>
                                        </span>
                                    </template>
                                </Editor>
                            </div>
                            <div class="form-group">
                                <label for="">
                                    Content Program
                                    <span class="text-danger text-sm" v-if="formErrors.long_desc">*{{formErrors.long_desc[0]}}</span>
                                </label>
                                <Editor :class="{'p-invalid': formErrors.long_desc && formErrors.long_desc.length > 0}" v-model="form.long_desc" editorStyle="height: 200px" />
                            </div>

                            <button type="submit" class="btn bg-wa btn-sm d-flex" :disabled="btnLoading">
                                Simpan
                                <template v-if="btnLoading">
                                    <Pulse />
                                </template>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex"
import config from "@/config/app"
import AdminHeader from "@/components/layouts/AdminHeader.vue"
import Breadcrumb from "@/components/layouts/Breadcrumb.vue"
import Pulse from "@/components/loadings/Pulse.vue"
import VueCropper from "vue-cropperjs"
import Editor from 'primevue/editor'

export default {
    created() {
        this.getProgram()
    },
    data() {
        return {
            apiURL: config.apiURL,
            form: {
                cover: "",
                pdf_file: "",
                long_desc: "",
                short_desc: "",
                harga: 10000,
                expiredAt: "",
            },
            type: "",
            coverName: "",
            imagePreview: "",
            pdfName: "",
            pdfSize: "",
        }
    },
    components: { AdminHeader, Pulse, Breadcrumb, VueCropper, Editor },
    computed: {
        ...mapGetters({
            btnLoading: "btnLoading",
            formErrors: "formErrors",
            program: "program/program",
        }),
    },
    methods: {
        getProgram() {
            this.$store
                .dispatch("program/getProgram", this.$route.params.slug)
                .then((res) => {
                    this.pdfSize = this.formatBytes(res.data.programSize)
                    this.form.long_desc = res.data.program.long_desc
                    this.form.short_desc = res.data.program.short_desc
                    this.type = res.data.program.type
                    this.form.harga = res.data.program.harga
                    this.form.expiredAt = new Date(res.data.program.expiredAt)
                })
        },
        onImageChange(e) {
            let file = e.target.files || e.dataTransfer.files
            if (!file.length) {
                return
            }
            let fileType = file[0].type
            if (
                fileType == "image/png" ||
                fileType == "image/jpg" ||
                fileType == "image/jpeg" ||
                fileType == "image/gif"
            ) {
                this.coverName = file[0].name
                this.createImage(file[0])
            } else {
                e.target.value = ""
                window.notyf.error("Cover harus gambar (PNG, JPG, JPEG, GIF)")
            }
        },

        onPDFChange(e) {
            let file = e.target.files || e.dataTransfer.files
            if (!file.length) {
                return
            }
            let fileType = file[0].type
            if (fileType == "application/pdf") {
                this.form.pdf_file = file[0]
                this.pdfName = file[0].name
                this.pdfSize = this.formatBytes(file[0].size)
            } else {
                e.target.value = ""
                window.notyf.error("Format program harus PDF")
            }
        },
        createImage(file) {
            let reader = new FileReader()
            reader.onload = (e) => {
                let saveBtn = document.getElementById("saveBtn")
                let cropperCanvas = document.getElementById("cropper-canvas")
                saveBtn.classList.remove("d-none")
                cropperCanvas.classList.remove("d-none")
                this.$refs.cropper.replace(e.target.result)
            }
            reader.readAsDataURL(file)
        },
        formatBytes(a, b = 2) {
            if (0 === a) return "0 Bytes"
            const c = 0 > b ? 0 : b,
                d = Math.floor(Math.log(a) / Math.log(1024))

            return (
                parseFloat((a / Math.pow(1024, d)).toFixed(c)) +
                "" +
                ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
            )
        },
        cropCover() {
            this.imagePreview = this.$refs.cropper
                .getCroppedCanvas()
                .toDataURL()
            this.form.cover = this.$refs.cropper
                .getCroppedCanvas()
                .toBlob((blob) => {
                    this.form.cover = blob
                })
        },
        submit() {
            const cover = new File([this.form.cover], this.coverName, {
                lastModified: this.form.cover.lastModified,
                type: this.form.cover.type,
            })
            const data = new FormData()
            data.append("cover", cover)
            data.append("pdf_file", this.form.pdf_file)
            data.append("title", this.program.title)
            data.append("short_desc", this.form.short_desc)
            data.append("long_desc", this.form.long_desc)
            data.append("harga", this.form.harga)
            data.append("type", this.type)
            data.append("expiredAt", this.form.expiredAt)

            this.$store
                .dispatch("program/updateProgram", [
                    this.$route.params.slug,
                    data,
                ])
        },
    },
}
</script>

<style lang="scss">
@import "@/assets/sass/admin.scss";
@import "@/assets/sass/form.scss";
</style>