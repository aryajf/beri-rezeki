import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import appConfig from "./config/app"

import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
    onRegistered(r) {
        r && setInterval(() => {
            r.update()
        }, 60 * 60 * 1000 /* 1 hour: timeout in milliseconds */)
    },
    onNeedRefresh() {
        // show a prompt to user
    },
    onOfflineReady() {
        // show a ready to work offline to user
    },
})
updateSW()

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import "@popperjs/core"

// Primevue
import PrimeVue from 'primevue/config'

import "primevue/resources/themes/saga-blue/theme.css"
import "primevue/resources/primevue.min.css"
import "primeicons/primeicons.css"

// Axios
import axios from 'axios'
axios.defaults.baseURL = appConfig.apiURL

// Mitt
import mitt from 'mitt'
const emitter = mitt()

// Notyf
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'
window.notyf = new Notyf({duration: 4000})

// Vue Countdown
import VueCountdown from '@chenfengyuan/vue-countdown'

import Mixins from '@/mixins'
import '@/store/subscriber'
store.dispatch('auth/attempt', localStorage.getItem('token')).then(() => {
    const app = createApp(App)
    app.config.globalProperties.emitter = emitter
    app.use(store).use(router).use(PrimeVue).mixin(Mixins).component(VueCountdown.name, VueCountdown).mount('#app')
})