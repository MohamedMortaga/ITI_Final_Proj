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




// createApp(App).use(router).mount('#app');
const app = createApp(App);

app.config.devtools = true; 

app.use(router).mount('#app');

