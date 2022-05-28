<template>
    <div class="modal fade" id="createUserModal" tabindex="-1" aria-labelledby="createUserModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="createUserModalLabel">Buat User Baru</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="submit">
                        <div class="form-group">
                            <label for="">Nama Lengkap <span class="text-danger text-sm" v-if="formErrors.nama">*{{formErrors.nama[0]}}</span></label>
                            <div class="input-group mb-3">
                                <span class="input-group-text"><i class="uil uil-user"></i></span>
                                <input type="text" class="form-control" placeholder="Masukkan nama disini" :class="{'is-invalid': formErrors.nama && formErrors.nama.length > 0}" v-model="form.nama">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="">Email <span class="text-danger text-sm" v-if="formErrors.email">*{{formErrors.email[0]}}</span></label>
                            <div class="input-group mb-3">
                                <span class="input-group-text">@</span>
                                <input type="email" class="form-control" placeholder="Masukkan email disini" :class="{'is-invalid': formErrors.email && formErrors.email.length > 0}" v-model="form.email">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="">Password <span class="text-danger text-sm" v-if="formErrors.password">*{{formErrors.password[0]}}</span></label>
                            <div class="input-group mb-3">
                                <span class="input-group-text"><i class="uil uil-key-skeleton-alt"></i></span>
                                <input type="password" class="form-control" placeholder="Masukkan password disini" :class="{'is-invalid': formErrors.password && formErrors.password.length > 0}" v-model="form.password">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="">Confirm Password <span class="text-danger text-sm" v-if="formErrors.confirmPassword">*{{formErrors.confirmPassword[0]}}</span></label>
                            <div class="input-group mb-3">
                                <span class="input-group-text"><i class="uil uil-key-skeleton"></i></span>
                                <input type="password" class="form-control" placeholder="Konfirmasi password disini" :class="{'is-invalid': formErrors.confirmPassword && formErrors.confirmPassword.length > 0}" v-model="form.confirmPassword">
                            </div>
                        </div>

                        <div class="float-start">
                            <button type="button" class="btn btn-outline-secondary btn-sm float-start me-2" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn bg-wa btn-sm float-start d-flex" :disabled="btnLoading">Submit
                                <span v-if="btnLoading" class="ms-1">
                                    <Pulse />
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Pulse from '@/components/loadings/Pulse.vue'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            form: {
                nama: '',
                email: '',
                password: '',
                confirmPassword: '',
            },
        }
    },
    components: { Pulse },
    computed: {
        ...mapGetters({
            btnLoading: 'btnLoading',
            formErrors: 'formErrors',
        }),
    },
    methods: {
        submit() {
            this.$store.dispatch('user/createUser', this.form).then((res) => {
                if (res.status === true) {
                    this.form.nama = ''
                    this.form.email = ''
                    this.form.password = ''
                    this.form.confirmPassword = ''
                }
            })
        },
    },
}
</script>