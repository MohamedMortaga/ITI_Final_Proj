// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

import Logout from '@/views/Logout.vue';
import Home from '@/views/Home.vue';
import Errorr from '@/components/pages/Errorr.vue';
import Login from '@/views/Login.vue';
import Signup from '@/views/Signup.vue';

const routes = [
  { path: '/', component: Login, alias: '/login' },
  { path: '/Home', component: Home, alias: '/home' },
  { path: '/Logout', component: Logout },
  { path: '/:pathMatch(.*)*', component: Errorr, meta: { hideNavbar: true } },
  { path: '/Signup', component: Signup },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
