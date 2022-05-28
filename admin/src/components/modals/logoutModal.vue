<template>
    <div class="modal fade" id="signoutModal" tabindex="-1" aria-labelledby="signoutModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="signoutModalLabel"><i class="uil uil-bell me-2"></i>Pemberitahuan</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Apa kamu yakin ingin keluar dari akun ini?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">Tidak</button>
                    <button @click="logout" type="button" data-bs-dismiss="modal" class="btn btn-sm btn-primary">Yakin</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import store from '@/store'
const logout = () => {
    store.dispatch('auth/logout')
}
</script>

<style>
</style>