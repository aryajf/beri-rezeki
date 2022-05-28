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
                console.log(123)
                let res = await axios.get(`comments`)
                commit('SET_COMMENTS', res.data)
                console.log(res.data)
                commit('SET_LOADING', false, {root: true})
                return res.data
            }catch(err){
                commit('SET_LOADING', false, {root: true})
                return err
            }
        }
    }
})