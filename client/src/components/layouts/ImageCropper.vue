<template>
    <div>
        <div class="modal fade" id="avatarModal" tabindex="-1" aria-labelledby="avatarModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="avatarModalLabel"><i class="uil uil-user-circle me-1"></i>Change Avatar</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ref="modalClose"></button>
                    </div>
                    <div class="modal-body text-center">
                        <div class="avatarPreview rounded-circle shadow-sm mb-3">
                            <img v-if="user.avatar" :src="apiURL+'images/avatar/'+user.avatar" class="w-100" alt="avatar">
                            <img v-else src="@/assets/images/no-avatar.png" class="w-100" alt="avatar">
                        </div>
                        <div class="form-group mb-3">
                            <label for="avatar">
                                <span class="btn btn-sm bg-yellow"><i class="uil uil-export me-1"></i>Select Avatar</span>
                                <button id="saveBtn" class="btn btn-sm btn-primary ms-2 d-none" @click="updateAvatar" :disabled="btnLoading">
                                    <div class="d-flex">
                                        <span>Simpan</span>
                                        <template v-if="btnLoading">
                                            <Pulse />
                                        </template>
                                        <template v-else><i class="uil uil-save ms-1"></i></template>
                                    </div>
                                </button>
                            </label>
                            <input type="file" class="d-none" id="avatar" v-on:change="onImageChange">
                        </div>
                        <div id="cropper-canvas" class="d-none">
                            <vue-cropper ref="cropper" alt="Crop Image" :background="false" :zoomable="true" :movable="false" :aspect-ratio="1 / 1" preview=".avatarPreview" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import useEmitter from '@/config/emitter'
import store from '@/store'
import appConfig from '@/config/app'
import VueCropper from 'vue-cropperjs'
import Pulse from '@/components/loadings/Pulse.vue'

let fileName = ref('')
const apiURL = ref(appConfig.apiURL)
const cropper = ref(null)
const modalClose = ref(null)

const btnLoading = computed(() => store.getters['btnLoading'])
const formErrors = computed(() => store.getters['formErrors'])
const user = computed(() => store.getters['auth/user'])
const emitter = useEmitter()

const onImageChange = (e) => {
    let file = e.target.files || e.dataTransfer.files
    if (!file.length) {
        return
    }
    let fileType = file[0].type
    if (
        fileType == 'image/png' ||
        fileType == 'image/jpg' ||
        fileType == 'image/jpeg' ||
        fileType == 'image/gif'
    ) {
        fileName = file[0].name
        createImage(file[0])
    } else {
        e.target.value = ''
        window.notyf.error('Avatar harus gambar (PNG, JPG, JPEG, GIF)')
    }
}

const createImage = (file) => {
    let reader = new FileReader()
    reader.onload = (e) => {
        let saveBtn = document.getElementById('saveBtn')
        let cropperCanvas = document.getElementById('cropper-canvas')
        saveBtn.classList.remove('d-none')
        cropperCanvas.classList.remove('d-none')
        cropper.value.replace(e.target.result)
    }
    reader.readAsDataURL(file)
}

const updateAvatar = () => {
    if (cropper.value.getCroppedCanvas() == null) {
        window.notyf.error('Pilih avatar terlebih dahulu')
    } else {
        cropper.value.getCroppedCanvas().toBlob((blob) => {
            const data = new FormData()
            data.append('avatar', blob, fileName)
            store.dispatch('auth/updateAvatar', data).then((res) => {
                if (res.status === 200) {
                    cropper.value.destroy()
                    modalClose.value.click()
                    let cropperCanvas =
                        document.getElementById('cropper-canvas')
                    cropperCanvas.classList.add('d-none')
                    setTimeout(function () {
                        emitter.emit('avatar', res.data.avatar)
                    }, 3000)
                }
            })
        })
    }
}
</script>

<style lang="scss">
.avatarPreview {
    height: 150px !important;
    width: 150px !important;
    margin: 0 auto;
    overflow: hidden;
    background: #efece8;
}
.avatarPreview img {
    max-width: 100%;
}
</style>