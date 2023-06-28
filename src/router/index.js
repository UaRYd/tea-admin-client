import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    children: [
      {
        path: '/admin/index',
        component:  () => import('../views/sys-admin/AdminIndexView.vue')
      },
      {
        path: '/admin/content/tag/type/add-new',
        component: () => import('../views/sys-admin/product/TagAddNewView.vue')
      },
      {
        path: '/admin/content/tag/type/list',
        component: () => import('../views/sys-admin/product/TagTypeListView.vue')
      },
      {
        path: '/admin/content/tag/add-new',
        component: () => import('../views/sys-admin/product/TagAddNewView.vue')
      },
      {
        path: '/admin/content/tag/list',
        component: () => import('../views/sys-admin/product/TagListView.vue')
      },
      {
        path: '/admin/content/user/add-new',
        component: () => import('../views/sys-admin/product/UserAddNewView.vue')
      }
    ]
  },
  {
    path: '/login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
