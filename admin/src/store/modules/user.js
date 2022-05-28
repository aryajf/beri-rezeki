import axios from 'axios'

export default{
    namespaced: true,
    state: {
        users: [],
        user: null,
        users_verified: [],
        users_unverified: [],
    },
    mutations: {
        SET_USERS(state, data){
            state.users = data
        },
        SET_USER(state, data){
            state.user = data
        },
        SET_USERS_VERIFIED(state, data){
            state.users_verified = data
        },
        SET_USERS_UNVERIFIED(state, data){
            state.users_unverified = data
        },
        DELETE_USERS(state, id){
            state.pending.splice(state.users.findIndex(function(i){
                return i.id === id;
            }), 1);
        },
    },
    actions: {
        async getUsers({commit}, page){
            try{
                let res
                page == null ? res = await axios.get('user') : res = await axios.get(`user?page=${page}`)
                commit('SET_USERS', res.data)
                return res
            }catch(err){
                return err.response
            }
        },
        async showUser({commit}, id){
            try{
                let res = await axios.get(`user/${id}`)
                commit('SET_USER', res.data.user)
                return res
            }catch(err){
                return err.response
            }
        },
        async createUser({commit, dispatch}, credentials){
            commit('SET_FORM_ERRORS', {}, {root: true})
            commit('SET_BUTTON_LOADING', true, {root: true})
            let create = await axios.post('user', credentials).then(res => {
                commit('SET_BUTTON_LOADING', false, {root: true})        
                window.notyf.success(res.data.message)
                dispatch('getUsers')
                return res.data
            }).catch(err => {
                if(err.response.data.errors){
                    commit('SET_FORM_ERRORS', err.response.data.errors, {root: true})
                }
                commit('SET_BUTTON_LOADING', false, {root: true})
                window.notyf.error(err.response.data.message)
            })
            return create
        },
        async getStatusUsers({commit},data){
            try{
                let res
                data.page == null ? res = await axios.get(`user/status/${data.status}`) : res = await axios.get(`user/status/${data.status}?page=${data.page}`)
                if(data.status == 'verified'){
                    commit('SET_USERS_VERIFIED', res.data)
                }
                if(data.status == 'unverified'){
                    commit('SET_USERS_UNVERIFIED', res.data)
                }
                return res
            }catch(err){
                return err.response
            }
        },
        async searchUsers({commit},data){
            commit('SET_BUTTON_LOADING', true, {root: true})
            try{
                let res
                if(!data.status){
                    // Cek jika parameter data yang isinya page & keyword tidak ada maka masuk ke search users tanpa ?page=
                    data.page == null ? res = await axios.get(`user/search/${data.keyword}`) : res = await axios.get(`user/search/${data.keyword}?page=${data.page}`)
                    commit('SET_BUTTON_LOADING', false, {root: true})
                    commit('SET_USERS', res.data)
                }else{
                    if(data.status == 'verified'){
                        data.page == null ? res = await axios.get(`user/search/${data.status}/${data.keyword}`) : res = await axios.get(`user/search/${data.status}/${data.keyword}?page=${data.page}`)
                        commit('SET_BUTTON_LOADING', false, {root: true})
                        commit('SET_USERS_VERIFIED', res.data)
                    }
                    if(data.status == 'unverified'){
                        data.page == null ? res = await axios.get(`user/search/${data.status}/${data.keyword}`) : res = await axios.get(`user/search/${data.status}/${data.keyword}?page=${data.page}`)
                        commit('SET_BUTTON_LOADING', false, {root: true})
                        commit('SET_USERS_UNVERIFIED', res.data)
                    }
                }
                return res.data
            }catch(err){
                commit('SET_BUTTON_LOADING', false, {root: true})
                return err
            }
        },
        async deleteUser({state, commit, dispatch}, id){
            commit('SET_BUTTON_LOADING', true, {root: true})
            let deleteUser = await axios.delete(`user/${id}`).then(response => {
                if(state.users.length == 1){
                    commit('DELETE_USERS', id)
                }
                commit('SET_BUTTON_LOADING', false, {root: true})        
                window.notyf.success(response.data.message)
                dispatch("getUsers")
                return response
            }).catch(err => {
                if(err.response){
                    commit('SET_BUTTON_LOADING', false, {root: true})
                    window.notyf.error(err.response.data.message)
                }
                return err.response
            })
            return deleteUser
        }
    },
    getters: {
        users(state){
            return state.users
        },
        user(state){
            return state.user
        },
        users_verified(state){
            return state.users_verified
        },
        users_unverified(state){
            return state.users_unverified
        },
    }
}