import axios from 'axios'
import appConfig from '@/config/app'

export default({
    namespaced: true,
    state:{
        programs: [],
        singlePrograms: [],
        crowdPrograms: [],
        programCommentsLength: 0,
        programComments: [],
        program: [],
        results: [],
    },
    getters:{
        programs(state){
            return state.programs
        },
        singlePrograms(state){
            return state.singlePrograms
        },
        crowdPrograms(state){
            return state.crowdPrograms
        },
        programComments(state){
            return state.programComments
        },
        programCommentsLength(state){
            return state.programCommentsLength
        },
        program(state){
            return state.program
        },
        results(state){
            return state.results
        }
    },
    mutations: {
        SET_PROGRAMS(state, data){
            state.programs = data
        },
        SET_SINGLE_PROGRAMS(state, data){
            state.singlePrograms = data
        },
        SET_CROWDFUNDING_PROGRAMS(state, data){
            state.crowdPrograms = data
        },
        SET_PROGRAM_COMMENTS(state, comments){
            state.programComments = comments
        },
        SET_PROGRAM_COMMENTS_LENGTH(state, length){
            state.programCommentsLength = length
        },
        SET_PROGRAM(state, data){
            state.program = data
        },
        SET_RESULTS(state, data){
            state.results = data
        }
    },
    actions: {
        async getPrograms({commit}, {page, keyword}){
            commit('SET_LOADING', true, {root: true})
            try{
                let res
                // Cek jika parameter data yang isinya page & keyword tidak ada maka masuk ke search program tanpa ?page=
                page == null ? res = await axios.get(`program?keyword=${keyword}`) : res = await axios.get(`program?keyword=${keyword}&page=${data.page}`)
                commit('SET_BUTTON_LOADING', false, {root: true})
                commit('SET_PROGRAMS', res.data)
                commit('SET_LOADING', false, {root: true})
                return res.data
            }catch(err){
                commit('SET_BUTTON_LOADING', false, {root: true})
                commit('SET_LOADING', false, {root: true})
                return err
            }
        },
        async getSinglePrograms({commit}, {page}){
            commit('SET_LOADING', true, {root: true})
            try{
                let res
                // Cek jika parameter page kosong maka masuk ke get program tanpa ?page=
                page == null ? res = await axios.get('program?type=single') : res = await axios.get(`program?type=single&page=${page}`)
                commit('SET_SINGLE_PROGRAMS', res.data)
                commit('SET_LOADING', false, {root: true})
                return res.data
            }catch(err){
                commit('SET_LOADING', false, {root: true})
                return err
            }
        },
        async getCrowdfundingPrograms({commit}, {page}){
            commit('SET_LOADING', true, {root: true})
            try{
                let res
                // Cek jika parameter page kosong maka masuk ke get program tanpa ?page=
                page == null ? res = await axios.get('program?type=crowdfunding') : res = await axios.get(`program?type=crowdfunding&page=${page}`)
                commit('SET_CROWDFUNDING_PROGRAMS', res.data)
                commit('SET_LOADING', false, {root: true})
                return res.data
            }catch(err){
                commit('SET_LOADING', false, {root: true})
                return err
            }
        },
        async getProgram({commit},slug){
            commit('SET_LOADING', true, {root: true})
            let program = axios.get(`program/${slug}`).then(res => {
                commit('SET_PROGRAM', res.data.program)
                commit('SET_PROGRAM_COMMENTS', res.data.comments)
                commit('SET_PROGRAM_COMMENTS_LENGTH', res.data.comments_length)
                commit('SET_LOADING', false, {root: true})
                return res.data
            }).catch(err => {
                window.location.href= appConfig.homeURL + '/notfound'
                return err.response
            })
            return program
        }
    }
})