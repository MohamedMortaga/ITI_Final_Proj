import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Logout from './components/pages/Logout.vue';
import Home from './components/pages/Home.vue';
import Errorr from './components/pages/Errorr.vue';
import Login from './components/pages/Login.vue';
import Signup from './components/pages/Signup.vue';
import './assets/main.css'
const routes = [
    { path: '/', component: Login ,alias: '/login' },
    { path: '/Home', component: Home, alias: '/home' },
    { path: '/Logout', component: Logout },
    { path: '/:pathMatch(.*)*', component: Errorr, meta: { hideNavbar: true } },
    { path: '/Signup', component: Signup },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

createApp(App).use(router).mount('#app');