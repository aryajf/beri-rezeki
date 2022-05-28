import axios from 'axios'
import appConfig from '@/config/app'
import router from '@/router'

export default({
    namespaced: true,
    state:{
        pending: [],
        accepted: [],
        payment: [],
        show: []
    },
    getters:{
        pending(state){
            return state.pending
        },
        accepted(state){
            return state.accepted
        },
        payment(state){
            return state.payment
        },
        show(state){
            return state.show
        }
    },
    mutations: {
        SET_PENDING(state, data){
            state.pending = data
        },
        SET_ACCEPTED(state, data){
            state.accepted = data
        },
        SET_PAYMENT(state, data){
            state.payment = data
        },
        SET_SHOW(state, data){
            state.show = data
        },
        CANCEL_PAYMENT(state, kode){
            state.pending.splice(state.pending.findIndex(function(i){
                return i.kode === kode;
            }), 1);
        },
    },
    actions: {
        async getShow({commit}, data){
            let proposal = await axios.get(`payment/proposal/${data.status}/${data.kode}`).then(res => {
                commit('SET_PAYMENT', res.data.payment)
                commit('SET_SHOW', res.data.data)
                return res.data.data
            }).catch(err => {
                window.location.href= appConfig.homeURL + '/notfound'
                return err.response
            })

            return proposal
        },
        async getPayment({commit}, data){
            commit('SET_LOADING', true, {root: true})
            let payment
            // Cek jika parameter page ada maka masuk ke get tanpa ?page=
            data.page == null ? payment = axios.get(`payment/proposal/${data.status}`) : payment = axios.get(`payment/proposal/${data.status}?page=${data.page}`)
            await payment.then(res=>{
                if(data.status){
                    commit(`SET_${data.status.toUpperCase()}`, res.data)
                }
                commit('SET_LOADING', false, {root: true})
                return res.data
            }).catch(err => {
                commit('SET_LOADING', false, {root: true})
                return err.response
            })
        },
        async cancelPayment({state, commit, dispatch}, kode){
            commit('SET_LOADING', true, {root: true})
            let cancel = await axios.delete(`payment/cancel/${kode}`).then(res=>{
                if(state.pending.length == 1){
                    commit('CANCEL_PAYMENT', kode)
                }
                dispatch("getPayment", {status:'pending'})
                commit('SET_LOADING', false, {root: true})
                window.notyf.success(res.data.message)
                return res.data
            }).catch(err => {
                commit('SET_LOADING', false, {root: true})
                window.notyf.error(err.response.data.message)
                return err.response
            })

            return cancel
        },
        async buyProposal({commit, dispatch}, data){
            commit('SET_BUTTON_LOADING', true, {root: true})
            try{
                let res = await axios.put(`payment/buy/proposal/${data.slug}`, data)
                dispatch("getPayment", {status:'pending'})
                dispatch("getPayment", {status:'accepted'})
                commit('SET_BUTTON_LOADING', false, {root: true})
                window.notyf.success(res.data.message)
                router.push('/pending/'+res.data.response.order_id)
                return res.data
            }catch(err){
                commit('SET_BUTTON_LOADING', false, {root: true})
                window.notyf.error(err.response.data.message)
                return err.response
            }
        }
    }
})