import { createRouter, createWebHistory } from 'vue-router'
import { getAuth } from 'firebase/auth'

import Logout from '@/views/Logout.vue'
import Home from '@/views/Home.vue'
import Errorr from '@/components/pages/Errorr.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import AddProduct from '@/views/AddProduct.vue'
import ProductDetails from '@/views/ProductDetails.vue'

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: { hideNavbar: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { hideNavbar: true }
  },
  {
    path: '/home',
    name: 'HomePage',
    component: Home,
    meta: { requiresAuth: true }
  },
  { path: '/logout', component: Logout },
  { path: '/addProduct', component: AddProduct },
  { path: '/:pathMatch(.*)*', component: Errorr, meta: { hideNavbar: true } },
  { path: '/product/:id', component: ProductDetails, name: 'ProductDetails' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
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