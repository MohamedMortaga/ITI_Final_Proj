import { createRouter, createWebHistory } from 'vue-router'
import Logout from '@/views/Logout.vue'
import Home from '@/views/Home.vue'
import Errorr from '@/components/pages/Errorr.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'

const routes = [
  { path: '/', redirect: '/login' }, 
  { path: '/login', component: Login },
  { path: '/home', component: Home, name: 'HomePage' },
  { path: '/logout', component: Logout },
  { path: '/signup', component: Signup },
  { path: '/admin', component: AdminDashboard },
  { path: '/:pathMatch(.*)*', component: Errorr, meta: { hideNavbar: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
