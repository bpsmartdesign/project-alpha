import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '../views/app/Index.vue'
import Dashboard from '../views/app/dashboard/Index.vue'
import Reports from '../views/app/reports/Index.vue'
import Services from '../views/app/services/Index.vue'
import CategorySettings from '../views/app/settings/Category.vue'
import FournisseurSettings from '../views/app/settings/Fournisseur.vue'
import ServiceSettings from '../views/app/settings/Service.vue'
import UserSettings from '../views/app/settings/Utilisateur.vue'
import Others from '../views/app/others/Index.vue'
import Error from '../views/app/Error.vue'
import Profile from '../views/app/user/profile.vue'
import UserLogin from '../views/user/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: App,
    redirect: '/app/reports',
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('alpha-user-connected') != null && localStorage.getItem('alpha-user-connected').length > 0) {
        next()
      } else {
        localStorage.removeItem('alpha-user-connected')
        next({ name: 'user/login' })
      }
    },
    children: [
      {
        path: 'app/dashboard',
        component: Dashboard
      },
      {
        path: 'app/reports',
        component: Reports
      },
      {
        path: 'app/services',
        component: Services
      },
      {
        path: 'app/category-settings',
        component: CategorySettings
      },
      {
        path: 'app/fournisseur-settings',
        component: FournisseurSettings
      },
      {
        path: 'app/service-settings',
        component: ServiceSettings
      },
      {
        path: 'app/user-settings',
        component: UserSettings
      },
      {
        path: 'app/others',
        component: Others
      },
      {
        path: '/profile',
        component: Profile
      }
    ]
  },
  {
    path: '/error',
    component: Error
  },
  {
    path: '/login',
    name: 'user/login',
    component: UserLogin
  }
]

const router = new VueRouter({
  routes
})

export default router
