import { createApp } from 'vue'
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.css';
import BootstrapVue3 from 'bootstrap-vue-3';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import router from "./router/index";
import './style.css';

const app = createApp(App);
app.use(BootstrapVue3);
app.use(router);
app.mount('#app');
