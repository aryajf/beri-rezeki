<template>
    <div class="breadcrumb-panel">
        <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='currentColor'/%3E%3C/svg%3E&#34;)" aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <router-link to="/"><i class="uil uil-estate me-1"></i>Home</router-link>
                </li>

                <!-- PAYMENTS -->
                <template v-if="$route.path == '/payments'">
                    <li class="breadcrumb-item active" aria-current="page">Payments</li>
                </template>

                <!-- PROGRAM -->
                <template v-if="$route.path == '/program'">
                    <li class="breadcrumb-item active" aria-current="page">Program</li>
                </template>
                <template v-if="$route.path == '/program/single'">
                    <li class="breadcrumb-item">
                        <router-link to="/program">Program</router-link>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">Single</li>
                </template>
                <template v-if="$route.path == '/program/crowdfunding'">
                    <li class="breadcrumb-item">
                        <router-link to="/program">Program</router-link>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">Crowdfunding</li>
                </template>
                <template v-if="$route.path == '/program/create'">
                    <li class="breadcrumb-item">
                        <router-link to="/program">Program</router-link>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">Create</li>
                </template>
                <template v-if="program_slug">
                    <li class="breadcrumb-item">
                        <router-link to="/program">Program</router-link>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">Edit</li>
                </template>

                <template v-if="produk && status">
                    <li class="breadcrumb-item">
                        <span v-if="produk == 'nyimas'">{{produk.charAt(0).toUpperCase() + produk.slice(1)}}</span>
                        <router-link v-else :to="'/'+produk">{{produk.charAt(0).toUpperCase() + produk.slice(1)}}</router-link>
                    </li>
                    <template v-if="kode">
                        <li class="breadcrumb-item">
                            <router-link :to="'/'+produk+'/'+status">{{status.charAt(0).toUpperCase() + status.slice(1)}}</router-link>
                        </li>
                        <li class="breadcrumb-item active" aria-current="page">{{kode}}</li>
                    </template>
                    <template v-else>
                        <li class="breadcrumb-item active" aria-current="page">{{status.charAt(0).toUpperCase() + status.slice(1)}}</li>
                    </template>
                </template>

                <!-- USER -->
                <template v-if="$route.path == '/user'">
                    <li class="breadcrumb-item active" aria-current="page">User</li>
                </template>

                <template v-if="user">
                    <li class="breadcrumb-item">
                        <router-link to="/user">User</router-link>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">{{user}}</li>
                </template>

                <template v-if="$route.path == '/user/verified'">
                    <li class="breadcrumb-item">
                        <router-link to="/user">User</router-link>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">Verified</li>
                </template>

                <template v-if="$route.path == '/user/unverified'">
                    <li class="breadcrumb-item">
                        <router-link to="/user">User</router-link>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">Unverified</li>
                </template>
            </ol>
        </nav>
    </div>
</template>

<script>
export default {
    props: [
        'produk',
        'status',
        'kode',
        'program_slug',
        'user',
    ],
}
</script>

<style lang="scss" scoped>
.breadcrumb-panel {
    white-space: nowrap;
}

.breadcrumb-item > a {
    text-decoration: none;
}

@media screen and (max-width: 768px) {
    .breadcrumb-panel {
        padding-top: 10px;
        overflow-x: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;

        &::-webkit-scrollbar {
            display: none;
        }
        nav {
            width: 650px;
        }
    }
}
</style>