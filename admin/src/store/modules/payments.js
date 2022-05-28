import axios from 'axios'

export default{
    namespaced: true,
    state: {
        all_payments: [],
        payments: [],
        payment: [],
        transaction: [],
    },
    mutations: {
        SET_ALL_PAYMENTS(state, data){
            state.all_payments = data
        },
        SET_PAYMENTS(state, data){
            state.payments = data
        },
        SET_PAYMENT(state, data){
            state.payment = data
        },
        SET_TRANSACTION(state, data){
            state.transaction = data
        },
    },
    actions: {
        async getAllPayments({commit}, year){
            commit('SET_BUTTON_LOADING', true, {root: true})
            let payments = await axios.get(`accepted?year=${year}`).then(res => {
                commit('SET_ALL_PAYMENTS', res.data)
                commit('SET_BUTTON_LOADING', false, {root: true})
                return res.data
            }).catch(err => {
                commit('SET_BUTTON_LOADING', false, {root: true})
                return err.response
            })

            return payments
        },
        async getPayments({commit}, {keyword, page}){
            try{
                let res
                page == null ? res = await axios.get(`history?keyword=${keyword}`) : res = await axios.get(`history?keyword=${keyword}&page=${page}`)
                commit('SET_PAYMENTS', res.data)
                return res.data
            }catch(err){
                return err.response
            }
        },
        async getPayment({commit}, kode){
            try{
                let res = await axios.get(`history/${kode}`)
                commit('SET_TRANSACTION', res.data.payment)
                commit('SET_PAYMENT', res.data.data)
                return res.data
            }catch(err){
                return err.response
            }
        },
    },
    getters: {
        all_payments(state){
            return state.all_payments
        },
        payments(state){
            return state.payments
        },
        payment(state){
            return state.payment
        },
        transaction(state){
            return state.transaction
        },
    }
}