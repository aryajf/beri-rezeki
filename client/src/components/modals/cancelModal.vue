<template>
    <div class="modal fade" id="cancelModal" tabindex="-1" aria-labelledby="cancelModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="cancelModalLabel">Delete Confirmation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Anda yakin ingin menghapusnya?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary btn-sm" data-bs-dismiss="modal" ref="modalClose">Tidak</button>

                    <!-- DELETE PROGRAM -->
                    <button :disabled="btnLoading" type="button" class="btn btn-danger btn-sm d-flex" @click="deleteProgram(program_slug)" v-if="program_slug != null">
                        Hapus
                        <template v-if="btnLoading">
                            <Pulse />
                        </template>
                    </button>

                    <!-- DELETE USER -->
                    <button :disabled="btnLoading" type="button" class="btn btn-danger btn-sm d-flex" @click="deleteUser(user_id)" v-else-if="user_id != null">
                        Hapus
                        <template v-if="btnLoading">
                            <Pulse />
                        </template>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pulse from '@/components/loadings/Pulse.vue'
export default {
    props: [
        'program_slug',
        'user_id',
    ],
    components: { Pulse },
    computed: {
        ...mapGetters({
            btnLoading: 'btnLoading',
        }),
    },
    methods: {
        deleteProgram(slug) {
            this.$store
                .dispatch('program/deleteProgram', slug)
                .then((res) => {
                    if (res.status === 200) {
                        this.$refs.modalClose.click()
                    }
                })
        },
        deleteUser(id) {
            this.$store.dispatch('user/deleteUser', id).then((res) => {
                if (res.status === 200) {
                    this.$refs.modalClose.click()
                }
            })
        },
    },
}
</script>

<style>
</style>