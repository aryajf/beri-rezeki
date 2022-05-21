import store from '@/store/'
import axios from 'axios'
import appConfig from "@/config/app"

// Cross Domain Storage
import createHost from 'cross-domain-storage/host'
createHost([
    {
        origin: appConfig.adminURL,
        allowedMethods: ['get', 'remove'],
    },
])

store.subscribe((mutation) => {
    switch(mutation.type){
        case 'auth/SET_TOKEN':
            if(mutation.payload){
                axios.defaults.headers.common['Authorization'] = mutation.payload
                
                localStorage.setItem('token', mutation.payload)
                
            }else{
                axios.defaults.headers.common['Authorization'] = null
                localStorage.removeItem('token')
            }
        break
    }
})