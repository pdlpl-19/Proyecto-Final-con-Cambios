import { createApp } from 'vue';  // Asegúrate de que solo haya una vez esta importación
import App from './App.vue';
import router from './router';
import Swal from 'sweetalert2';

const app = createApp(App);
app.use(router);
app.mount('#app');
