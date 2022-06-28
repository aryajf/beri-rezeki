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
import ConfirmationService from 'primevue/confirmationservice'
import ConfirmDialog from 'primevue/confirmdialog'
import ProgressBar from 'primevue/progressbar'
import Message from 'primevue/message'
import Paginator from 'primevue/paginator'
import Skeleton from 'primevue/skeleton'

// Axios
import axios from 'axios'
axios.defaults.baseURL = appConfig.apiURL

// Progressbar Loading
import VueProgressBar from "@aacassandra/vue3-progressbar"
const options = {
    color: "#045256",
    failedColor: "#ec615b",
    thickness: "5px",
    transition: {
        speed: "0.2s",
        opacity: "0.6s",
        termination: 300,
    },
    autoRevert: true,
    location: "top",
    inverse: false,
}

// Mitt
import mitt from 'mitt'
const emitter = mitt()

// Notyf
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'
window.notyf = new Notyf({duration: 4000})

// Vue Countdown
import VueCountdown from '@chenfengyuan/vue-countdown'

// Swiper
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Vue Cropper
import 'cropperjs/dist/cropper.css'

import Mixins from '@/mixins'
import '@/store/subscriber'
store.dispatch('auth/attempt', localStorage.getItem('token')).then(() => {
    const app = createApp(App)
    app.config.globalProperties.emitter = emitter
    app.use(store).use(router).use(ConfirmationService).use(PrimeVue).use(VueProgressBar, options).mixin(Mixins).component(VueCountdown.name, VueCountdown).component("ConfirmDialog", ConfirmDialog).component("ProgressBar", ProgressBar).component("Message", Message).component("Paginator", Paginator).component("Skeleton", Skeleton).mount('#app')
})