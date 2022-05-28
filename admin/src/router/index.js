import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import appConfig from '@/config/app'

const routes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => window.location.href= appConfig.homeURL + '/notfound'
  },

  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "Home" */ '@/views/Home.vue'),
    beforeEnter: () => {
      window.scrollTo(0, 0)
      if(store.getters['auth/authenticated'] && store.getters['auth/user'].data.role != 'Admin'){
        window.location.href= appConfig.homeURL + '/notfound'
      }
      // next()
    }
  },

  // PROGRAM
  {
    path: '/program',
    name: 'Program',
    component: () => import(/* webpackChunkName: "Program" */ '@/views/program/Program.vue'),
    beforeEnter: () => {
      window.scrollTo(0, 0)
      if(store.getters['auth/authenticated'] && store.getters['auth/user'].data.role != 'Admin'){
        window.location.href= appConfig.homeURL + '/notfound'
      }
      // next()
    }
  },
  {
    path: '/program/single',
    name: 'program.single',
    component: () => import(/* webpackChunkName: "SingleProgram" */ '@/views/program/SingleProgram.vue'),
    beforeEnter: () => {
      window.scrollTo(0, 0)
      if(store.getters['auth/authenticated'] && store.getters['auth/user'].data.role != 'Admin'){
        window.location.href= appConfig.homeURL + '/notfound'
      }
      // next()
    }
  },
  {
    path: '/program/crowdfunding',
    name: 'program.crowdfunding',
    component: () => import(/* webpackChunkName: "CrowdfundingProgram" */ '@/views/program/CrowdProgram.vue'),
    beforeEnter: () => {
      window.scrollTo(0, 0)
      if(store.getters['auth/authenticated'] && store.getters['auth/user'].data.role != 'Admin'){
        window.location.href= appConfig.homeURL + '/notfound'
      }
      // next()
    }
  },
  {
    path: '/program/create',
    name: 'program.create',
    component: () => import(/* webpackChunkName: "CreateProgram" */ '@/views/program/CreateProgram.vue'),
    beforeEnter: () => {
      window.scrollTo(0, 0)
      if(store.getters['auth/authenticated'] && store.getters['auth/user'].data.role != 'Admin'){
        window.location.href= appConfig.homeURL + '/notfound'
      }
      // next()
    }
  },
  {
    // PAYMENTS
    path: '/program/accepted',
    name: 'program.accepted',
    component: () => import(/* webpackChunkName: "ProgramAccepted" */ '@/views/payments/Program.vue'),
    beforeEnter: () => {
      window.scrollTo(0, 0)
      if(store.getters['auth/authenticated'] && store.getters['auth/user'].data.role != 'Admin'){
        window.location.href= appConfig.homeURL + '/notfound'
      }
      // next()
    }
  },
  {
    path: '/program/edit/:slug',
    name: 'program.edit',
    component: () => import(/* webpackChunkName: "EditProgram" */ '@/views/program/EditProgram.vue'),
    beforeEnter: () => {
      window.scrollTo(0, 0)
      if(store.getters['auth/authenticated'] && store.getters['auth/user'].data.role != 'Admin'){
        window.location.href= appConfig.homeURL + '/notfound'
      }
      // next()
    }
  },

  // USERS
  {
    path: '/user',
    name: 'User',
    component: () => import(/* webpackChunkName: "User" */ '@/views/user/User.vue'),
    beforeEnter: () => {
      window.scrollTo(0, 0)
      if(store.getters['auth/authenticated'] && store.getters['auth/user'].data.role != 'Admin'){
        window.location.href= appConfig.homeURL + '/notfound'
      }
      // next()
    }
  },
  {
    path: '/user/:id',
    name: 'user.show',
    component: () => import(/* webpackChunkName: "ShowUser" */ '@/views/user/Show.vue'),
    beforeEnter: () => {
      window.scrollTo(0, 0)
      if(store.getters['auth/authenticated'] && store.getters['auth/user'].data.role != 'Admin'){
        window.location.href= appConfig.homeURL + '/notfound'
      }
      // next()
    }
  },
  {
    path: '/:type/:status/:kode',
    name: 'ShowPayment',
    component: () => import(/* webpackChunkName: "ShowPayment" */ '@/views/payments/Show.vue'),
    beforeEnter: () => {
      window.scrollTo(0, 0)
      if(store.getters['auth/authenticated'] && store.getters['auth/user'].data.role != 'Admin'){
        window.location.href= appConfig.homeURL + '/notfound'
      }
      // next()
    }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes
})

export default router
