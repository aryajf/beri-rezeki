import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "404" */ '@/components/errors/404.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "Home" */ '@/views/Home.vue'),
    beforeEnter: () => {
      window.scrollTo(0, 0)
    }
  },
  {
    path: '/program/:slug',
    name: 'Show',
    component: () => import(/* webpackChunkName: "Show" */ '@/views/Show.vue'),
    beforeEnter: () => {
      window.scrollTo(0, 0)
    }
  },

  // AUTHENTICATION
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/auth/Login.vue'),
    beforeEnter: (to, from, next) => {
      window.scrollTo(0, 0)
      if(store.getters['auth/authenticated']){
        return next({
          name : 'Home'
        })
      }
      next()
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "Register" */ '@/views/auth/Register.vue'),
    beforeEnter: (to, from, next) => {
      window.scrollTo(0, 0)
      if(store.getters['auth/authenticated']){
        return next({
          name : 'Home'
        })
      }
      next()
    }
  },
  {
    path: '/forgot',
    name: 'Forgot',
    component: () => import(/* webpackChunkName: "Forgot" */ '@/views/auth/Forgot.vue'),
  },
  {
    path: '/verify/:email/:token',
    name: 'Verify',
    component: () => import(/* webpackChunkName: "Verify" */ '@/views/auth/Verify.vue'),
  },
  {
    path: '/password/update/:email/:token',
    name: 'UpdatePassword',
    component: () => import(/* webpackChunkName: "UpdatePassword" */ '@/views/auth/UpdatePassword.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "Profile" */ '@/views/auth/Profile.vue'),
    beforeEnter: (to, from, next) => {
      window.scrollTo(0, 0)
      if(!store.getters['auth/authenticated']){
        return next({
          name : 'Home'
        })
      }
      next()
    }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes
})

export default router
