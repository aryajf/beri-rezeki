import axios from 'axios'
import router from '@/router'

export default{
    namespaced: true,
    state: {
        programs: [],
        program: [],
        programTotal: 0,
        singleTotal: 0,
        crowdTotal: 0,
    },
    mutations: {
        SET_PROGRAMS(state, data){
            state.programs = data
        },
        SET_PROGRAM(state, data){
            state.program = data
        },
        SET_ALL_PROGRAM_TOTAL(state, data){
            state.programTotal = data
        },
        SET_SINGLE_PROGRAM_TOTAL(state, data){
            state.singleTotal = data
        },
        SET_CROWDFUNDING_PROGRAM_TOTAL(state, data){
            state.crowdTotal = data
        },
        REMOVE_PROGRAM(state, slug){
            state.program.splice(state.program.findIndex(function(i){
                return i.slug === slug;
            }), 1);
        },
    },
    actions: {
        async setTotalProgram({commit}){
            try{
                let program = await axios.get(`program`)
                commit('SET_ALL_PROGRAM_TOTAL', program.data.totalItems)
                let single = await axios.get(`program?type=single`)
                commit('SET_SINGLE_PROGRAM_TOTAL', single.data.totalItems)
                let crowd = await axios.get(`program?type=crowdfunding`)
                commit('SET_CROWDFUNDING_PROGRAM_TOTAL', crowd.data.totalItems)
                return res.data
            }catch(err){
                return err.response
            }
        },
        async getPrograms({commit}, {page, keyword, type}){
            try{
                let res
                if(type){
                    // Cek jika parameter page ada maka masuk ke get program dengan type tanpa ?page=
                    page != null ? res = await axios.get(`program?type=${type}&page=${page}&keyword=${keyword}`) : res = await axios.get(`program?type=${type}&keyword=${keyword}`)
                }else{
                    // Cek jika parameter page ada maka masuk ke get program tanpa ?page=
                    page != null ? res = await axios.get(`program?page=${page}&keyword=${keyword}`) : res = await axios.get(`program?keyword=${keyword}`)
                }
                commit('SET_PROGRAMS', res.data)
                return res.data
            }catch(err){
                return err
            }
        },
        async getProgram({commit}, slug){
            try{
                let response = await axios.get(`program/${slug}`)
                commit('SET_PROGRAM', response.data.program)
                return response
            }catch(err){
                return err.response
            }
        },
        async storeProgram({commit, dispatch}, credentials){
            commit('SET_BUTTON_LOADING', true, {root: true})
            commit('SET_FORM_ERRORS', [], {root: true})          
            try{
                let response = await axios.post('program', credentials)
                setTimeout(function () {
                    window.notyf.success(response.data.message)
                    commit('SET_BUTTON_LOADING', false, {root: true})        
                    router.push('/program')
                    dispatch("getPrograms", {keyword: ''})
                    dispatch("getPrograms", {type: 'Single', keyword: ''})
                    dispatch("getPrograms", {type: 'Crowdfunding', keyword: ''})
                    dispatch("setTotalProgram")
                }, 3500)
                return response
            }catch(err){
                if(err.response){
                    if(err.response.data.errors){
                        commit('SET_FORM_ERRORS', err.response.data.errors, {root: true})
                    }
                    commit('SET_BUTTON_LOADING', false, {root: true})
                    window.notyf.error(err.response.data.message)
                }
                return err.response
            }
        },
        async updateProgram({commit, dispatch}, [slug, credentials]){
            commit('SET_BUTTON_LOADING', true, {root: true})
            commit('SET_FORM_ERRORS', [], {root: true})          
            try{
                let response = await axios.put(`program/${slug}`, credentials)
                setTimeout(function () {
                    window.notyf.success(response.data.message)
                    commit('SET_BUTTON_LOADING', false, {root: true})        
                    router.push('/program')
                    dispatch("getPrograms", {keyword: ''})
                    dispatch("getPrograms", {type: 'Single', keyword: ''})
                    dispatch("getPrograms", {type: 'Crowdfunding', keyword: ''})
                    dispatch("setTotalProgram")
                }, 3500)
                return response
            }catch(err){
                if(err.response){
                    if(err.response.data.errors){
                        commit('SET_FORM_ERRORS', err.response.data.errors, {root: true})
                    }
                    commit('SET_BUTTON_LOADING', false, {root: true})
                    window.notyf.error(err.response.data.message)
                }
                return err.response
            }
        },
        async deleteProgram({commit, dispatch}, slug){
            commit('SET_BUTTON_LOADING', true, {root: true})
            try{
                let response = await axios.delete(`program/${slug}`)
                commit('REMOVE_PROGRAM', slug)
                dispatch("getPrograms", {keyword: ''})
                dispatch("getPrograms", {type: 'Single', keyword: ''})
                dispatch("getPrograms", {type: 'Crowdfunding', keyword: ''})
                dispatch("setTotalProgram")
                commit('SET_BUTTON_LOADING', false, {root: true})        
                window.notyf.success(response.data.message)
                return response
            }catch(err){
                if(err.response){
                    commit('SET_BUTTON_LOADING', false, {root: true})
                    window.notyf.error(err.response.data.message)
                }
                return err.response
            }
        }
    },
    getters: {
        programs(state){
            return state.programs
        },
        program(state){
            return state.program
        },
        programTotal(state){
            return state.programTotal
        },
        singleTotal(state){
            return state.singleTotal
        },
        crowdTotal(state){
            return state.crowdTotal
        }
    }
}