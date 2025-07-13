import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Products from './components/pages/Products.vue';
import Home from './components/pages/Home.vue';
import Errorr from './components/pages/Errorr.vue';
import CreateProduct from './components/pages/CreateProduct.vue';
import './assets/main.css'
const routes = [
    { path: '/', component: Home, alias: '/home' },
    { path: '/products', component: Products },
    { path: '/:pathMatch(.*)*', component: Errorr, meta: { hideNavbar: true } },
    { path: '/modify', component: CreateProduct },
    { path: '/modify/:id', component: CreateProduct },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

createApp(App).use(router).mount('#app');