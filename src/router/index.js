import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import DashboardView from '@/views/DashboardView.vue';
import CentrosView from '@/views/CentrosView.vue';
import CitasView from '@/views/CitasView.vue';
import PerfilView from '@/views/PerfilView.vue';
import TodasLasCitasView from '@/views/TodasLasCitasView.vue';

const routes = [
  { path: '/', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/login', component: LoginView },
  { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/centros', component: CentrosView },
  { path: '/citas', component: CitasView },
  { path: '/perfil', component: PerfilView },
  { path: '/todas-las-citas', component: TodasLasCitasView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});


router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('authToken'); // Cambiar 'token' a 'authToken'
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/'); // Si no está autenticado, redirigir al login
  } else {
    next(); // Si está autenticado o no requiere autenticación, continuar
  }
});


export default router;
