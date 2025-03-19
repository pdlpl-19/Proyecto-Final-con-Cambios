<template>
  <div class="container">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="login">
      <div class="input-group">
        <label for="username">Usuario</label>
        <input v-model="username" type="text" id="username" placeholder="Nombre de usuario" required />
      </div>
      <div class="input-group">
        <label for="password">Contraseña</label>
        <input v-model="password" type="password" placeholder="Contraseña" required />
      </div>
      <button type="submit" :disabled="isLoading">Iniciar sesión</button>
    </form>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <button @click="goToRegister">Registrarse</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { apiService } from "@/services/apiService";  // Importa el servicio de la API
import Swal from 'sweetalert2';

const username = ref("");
const password = ref("");
const isLoading = ref(false);
const errorMessage = ref("");
const router = useRouter();

const login = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = "Por favor ingrese su nombre de usuario y contraseña.";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  try {
    // Usamos el servicio apiService para hacer la solicitud de login
    const response = await apiService.login(username.value, password.value);

    // Guardamos el token en el localStorage
    localStorage.setItem("authToken", response.access_token);

    // Usamos SweetAlert2 para el mensaje de éxito
    Swal.fire({
      title: 'Éxito!',
      text: 'Inicio de sesión exitoso!',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });

    // Redirigimos a la vista de Dashboard después del login exitoso
    router.push("/dashboard");
  } catch (error) {
    errorMessage.value = error.message || "Hubo un error al intentar iniciar sesión.";

    // Usamos SweetAlert2 para el mensaje de error
    Swal.fire({
      title: 'Error!',
      text: errorMessage.value,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  } finally {
    isLoading.value = false;
  }
};

// Función para redirigir al registro
const goToRegister = () => {
  router.push("/register"); // Asegúrate que la ruta "/register" esté definida en el router
};
</script>

<style scoped>
@import url(../assets/styles.scss);
</style>
