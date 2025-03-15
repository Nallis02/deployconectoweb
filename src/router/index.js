import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import Pedidos from '../components/TablaPedidos.vue'; 

const routes = [
  { path: '/', component: Home },
  { path: '/pedidos', component: Pedidos } 
];

const router = createRouter({
  history: createWebHistory('#'),
  routes
});

export default router;

