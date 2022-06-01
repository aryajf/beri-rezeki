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

// PrimeVue
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import ProgressBar from 'primevue/progressbar'
import Message from 'primevue/message'
import ConfirmDialog from 'primevue/confirmdialog'
import InputNumber from 'primevue/inputnumber'
import Paginator from 'primevue/paginator'
import "primevue/resources/themes/saga-blue/theme.css"
import "primevue/resources/primevue.min.css"
import "primeicons/primeicons.css"

// Axios
import axios from 'axios'
axios.defaults.baseURL = appConfig.apiURL

// Progressbar Loading
import VueProgressBar from "@aacassandra/vue3-progressbar"
const options = {
    color: "#045256",
    failedColor: "#AA0022",
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

// Notyf
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'
window.notyf = new Notyf()

// Vue Cropper
import 'cropperjs/dist/cropper.css'

import VueCountdown from '@chenfengyuan/vue-countdown'

import '@/store/subscriber'

// Cross Domain Storage
import createGuest from 'cross-domain-storage/guest'
window.bazStorage = createGuest(appConfig.homeURL)

window.bazStorage.get('token', function(error, value) {
    store.dispatch('auth/attempt', value).then(() => {
        if(value == null){
            window.location.href = appConfig.homeURL
        }else{
            const app = createApp(App)
            app.use(store).use(router).use(PrimeVue).use(ConfirmationService).use(VueProgressBar, options).component("ProgressBar", ProgressBar).component("Message", Message).component("InputNumber", InputNumber).component("Button", Button).component("Calendar", Calendar).component("Dropdown", Dropdown).component("ConfirmDialog", ConfirmDialog).component("Paginator", Paginator).component(VueCountdown.name, VueCountdown).mount('#app')
        }
    })
})
