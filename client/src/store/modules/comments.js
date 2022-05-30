import axios from 'axios'
import appConfig from '@/config/app'

export default({
    namespaced: true,
    state:{
        comments: []
    },
    getters:{
        comments(state){
            return state.comments
        }
    },
    mutations: {
        SET_COMMENTS(state, data){
            state.comments = data
        }
    },
    actions: {
        async getComments({commit}){
            commit('SET_LOADING', true, {root: true})
            try{
                let res = await axios.get(`comments`)
                commit('SET_COMMENTS', res.data)
                commit('SET_LOADING', false, {root: true})
                return res.data
            }catch(err){
                commit('SET_LOADING', false, {root: true})
                return err
            }
        },
        async likeComment({commit}, kode){
            commit('SET_BUTTON_LOADING', true, {root: true})
            let reply = await axios.post(`comment/like/${kode}`).then(res => {
                console.log(kode)
                commit('SET_BUTTON_LOADING', false, {root: true})
                window.notyf.success(res.data.message)
                return res
            }).catch(err => {
                commit('SET_BUTTON_LOADING', false, {root: true})
                return err.response
            })
            return reply
        },
        async replyComment({commit},data){
            commit('SET_BUTTON_LOADING', true, {root: true})
            let reply = await axios.post(`product/reply/${data.kode}`, {messages: data.messages}).then(res => {
                commit('SET_BUTTON_LOADING', false, {root: true})
                window.notyf.success(res.data.message)
                return res
            }).catch(err => {
                commit('SET_BUTTON_LOADING', false, {root: true})
                window.notyf.error(err.response.data.message)
                return err.response
            })
            return reply
        }
    }
})