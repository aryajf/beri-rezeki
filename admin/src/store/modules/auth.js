import axios from 'axios'
import router from "@/router"
import config from "@/config/app"

export default{
    namespaced: true,
    state:{
        token: '',
        user: []
    },
    mutations: {
        SET_TOKEN(state, token){
            state.token = token
        },
        SET_USER(state, data){
            state.user = data
        }
    },
    actions: {
        async attempt({commit, state}, token){
            if(token){
                commit('SET_TOKEN', token)
            }
            if(!state.token){
                return
            }

            await axios.get('profile').then(res => {
                if(res.data.data.role !== 'Admin'){
                    window.location.href = config.homeURL
                    return
                }
                commit('SET_USER', res.data)
            }).catch(() => {
                commit('SET_USER', [])
                commit('SET_TOKEN', null)
                window.location.href = config.homeURL
            })
        },
        async updateProfile({commit}, credentials){
            commit('SET_FORM_ERRORS', {}, {root: true})
            commit('SET_BUTTON_LOADING', true, {root: true})

            let data = await axios.put('profile/update', credentials).then(res => {
                commit('SET_BUTTON_LOADING', false, {root: true})
                window.notyf.success(res.data.message)
                return res.data.data
            }).catch(err => {
                if(err.response.data.errors){
                    commit('SET_FORM_ERRORS', err.response.data.errors, {root: true})
                }
                commit('SET_BUTTON_LOADING', false, {root: true})
                window.notyf.error(err.response.data.message)
                return err.response
            })
            return data
        },
        async changePassword({commit},credentials){
            commit('SET_FORM_ERRORS', {oldPassword: [], newPassword: [], confirmNewPassword: []}, {root: true})
            commit('SET_BUTTON_LOADING', true, {root: true})
            await axios.post('password/change', credentials).then(res => {
                commit('SET_BUTTON_LOADING', false, {root: true})
                window.notyf.success(res.data.message)
                router.push('/profile')
            }).catch(err => {
                if(err.response.data.errors){
                    commit('SET_FORM_ERRORS', err.response.data.errors, {root: true})
                }
                commit('SET_BUTTON_LOADING', false, {root: true})
                window.notyf.error(err.response.data.message)
            })
        },
        async logout({commit}){
            window.bazStorage.remove('token', function() {})
            commit('SET_TOKEN', null)
            commit('SET_USER', [])
            window.notyf.success("Berhasil Logout")
            setTimeout(() => {
                window.location.href = config.homeURL
            }, 900)
        }
    },
    getters: {
        authenticated(state){
            return state.token && state.user && state.user.data.role == 'Admin'
        },
        user(state){
            return state.user
        }
    }
}