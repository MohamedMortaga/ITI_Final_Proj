import { createRouter, createWebHistory } from 'vue-router'
import { getAuth } from 'firebase/auth'

import Logout from '@/views/Logout.vue'
import Home from '@/views/Home.vue'
import Errorr from '@/components/pages/Errorr.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import ProductDetails from '@/views/ProductDetails.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  {
    path: '/home',
    name: 'HomePage',
    component: Home,
    meta: { requiresAuth: true }
  },
  { path: '/logout', component: Logout },
  { path: '/admin', component: AdminDashboard },
  { path: '/:pathMatch(.*)*', component: Errorr, meta: { hideNavbar: true } },
  { path: '/product/:id', component: ProductDetails, name: 'ProductDetails' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


router.beforeEach((to, from, next) => {
  const auth = getAuth()
  const user = auth.currentUser

  if (to.meta.requiresAuth && !user) {
    next('/login')
  } else {
    next()
  }
})

export default router
