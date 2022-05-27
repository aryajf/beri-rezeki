<template>
    <div>
        
    </div>
</template>

<!-- <script>
import Pulse from '@/components/loadings/Pulse.vue'
import { mapGetters } from 'vuex'
import appConfig from '@/config/app'
import Mixins from '@/mixins'

export default {
    mixins: [Mixins],
    data() {
        return {
            page: 'overview',
            index: 1,
            harga: 10000,
            messages: '',
            replykode: null,
            baseComment: null,
            replyMessages: '',
            isAnonymous: false,
        }
    },
    setup() {
        return {
            apiURL: appConfig.apiURL,
            baseURL: appConfig.baseURL,
            homeURL: appConfig.homeURL,
        }
    },
    created() {
        this.getProposal()
    },
    watch: {
        messages() {
            if (this.messages == '') this.isAnonymous = false
        },
    },
    components: { Pulse },
    computed: {
        ...mapGetters({
            loadingStatus: 'loadingStatus',
            btnLoading: 'btnLoading',
            authenticated: 'auth/authenticated',
            proposal: 'proposal/proposal',
            proposalComments: 'proposal/proposalComments',
            proposalCommentsLength: 'proposal/proposalCommentsLength',
            user: 'auth/user',
        }),
    },
    methods: {
        checkProfile() {
            return this.authenticated && this.user.user_status == 'Verified'
        },
        checkExpired(expiredAt) {
            const now = new Date()
            return new Date(expiredAt) - now >= 0
        },
        changePage(e) {
            return e == 'overview'
                ? (this.page = 'overview')
                : (this.page = 'PDF')
        },
        selectComment(comment) {
            this.replykode = comment.id
            this.baseComment = comment
        },
        replyComment() {
            this.$store
                .dispatch('proposal/replyComment', {
                    messages: this.replyMessages,
                    kode: this.replykode,
                })
                .then((res) => {
                    if (res.status == 200) {
                        this.getProposal()
                        this.replykode = null
                        this.replyMessages = ''
                    }
                    this.$refs.modalClose.click()
                })
        },
        getProposal() {
            this.$store
                .dispatch('proposal/getProposal', this.$route.params.slug)
                .catch(() => {
                    this.$router.push({ name: 'Home' })
                })
        },
    },
}
</script> -->
<style lang="scss">
@import '@/assets/sass/show.scss';
</style>