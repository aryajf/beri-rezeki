import { createStore } from 'vuex'
import auth from './modules/auth'
import comments from './modules/comments'
import payments from './modules/payments'
import program from './modules/program'

export default createStore({
  state: {
    btnLoading: false,
    formErrors: [],
    loadingStatus: false
  },
  mutations: {
    SET_BUTTON_LOADING(state, status){
      state.btnLoading = status
    },
    SET_FORM_ERRORS(state, errors){
      state.formErrors = errors
    },
    SET_LOADING(state, status){
      state.loadingStatus = status
    },
    loadingStatus(state){
      return state.loadingStatus
    },
  },
  actions: {
  },
  getters: {
    btnLoading(state){
      return state.btnLoading
    },
    formErrors(state){
      return state.formErrors
    }
  },
  modules: {
    auth, comments, payments, program
  }
})
