// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router.js';
import './assets/main.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import './styles/variables.css';
import './assets/main.css';
import i18n from './i18n.js';

// Set RTL or LTR on initial load
const lang = localStorage.getItem('lang') || i18n.global.locale;
if (lang === 'ar') {
  document.documentElement.setAttribute('dir', 'rtl');
  document.body.style.textAlign = 'right';
} else {
  document.documentElement.setAttribute('dir', 'ltr');
  document.body.style.textAlign = 'left';
}

// createApp(App).use(router).mount('#app');
const app = createApp(App);

app.config.devtools = true;

app.use(i18n);
app.use(router).mount('#app');

