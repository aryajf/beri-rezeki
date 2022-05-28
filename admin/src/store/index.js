import { createStore } from 'vuex'
import auth from './modules/auth'
import axios from 'axios'
import program from './modules/program'
import payments from './modules/payments'
import user from './modules/user'

export default createStore({
  state: {
    btnLoading: false,
    formErrors: {}
  },
  mutations: {
    SET_BUTTON_LOADING(state, status){
      state.btnLoading = status
    },
    SET_FORM_ERRORS(state, errors){
      state.formErrors = errors
    },
  },
  actions: {
    async totalProducts(){
      let product = await axios.get(`product`).then(res => {
        return res.data.data
      }).catch(err => {
        return err.response
      })

      return product
    },
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
    auth, program, payments, user
  }
})
