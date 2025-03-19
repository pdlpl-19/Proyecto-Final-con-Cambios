<template>
  <div class="profile-container">
    <h3>Editar Perfil</h3>
    <form @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="name">Nombre:</label>
        <input
          type="text"
          id="name" 
          v-model="userProfile.name"
          placeholder="Nombre"
          required
        />
      </div>

      <div class="form-group">
        <label for="lastname">Apellido:</label>
        <input
          type="text"
          id="lastname"
          v-model="userProfile.lastname"
          placeholder="Apellido"
          required
        />
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input
          type="email"
          id="email"
          v-model="userProfile.email"
          placeholder="Email"
          required
        />
      </div>

      <div class="form-group">
        <label for="phone">Teléfono:</label>
        <input
          type="text"
          id="phone"
          v-model="userProfile.phone"
          placeholder="Teléfono"
          required
        />
      </div>

      <button type="submit" class="submit-btn">Actualizar Perfil</button>
    </form>

    <!-- Botón de "Volver atrás" -->
    <button @click="goBack" class="back-btn">Volver atrás</button>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { apiService } from '@/services/apiService'; // Asegúrate de que esta ruta esté correcta

// Estado del perfil del usuario
const userProfile = ref({
  name: '',
  lastname: '',
  email: '',
  phone: '',
});

const errorMessage = ref('');
const successMessage = ref('');

// Función para cargar los datos del perfil al montar el componente
const loadUserProfile = async () => {
  try {
    const data = await apiService.getProfile();  // Obtener datos del perfil del usuario
    userProfile.value = {
      name: data.name,
      lastname: data.lastname,
      email: data.email,
      phone: data.phone,
    };
  } catch (error) {
    errorMessage.value = 'Error al cargar los datos del perfil.';
  }
};

// Cargar los datos del perfil cuando el componente se monta
onMounted(() => {
  loadUserProfile();
});

// Función para actualizar el perfil
const updateProfile = async () => {
  try {
    // Preparar los datos del perfil para la solicitud PATCH
    const updatedProfile = {
      name: userProfile.value.name,
      lastname: userProfile.value.lastname,
      email: userProfile.value.email,
      phone: userProfile.value.phone,
    };

    // Enviar los datos del perfil a la API
    const response = await apiService.updateProfile(updatedProfile);

    // Si la actualización es exitosa
    successMessage.value = 'Perfil actualizado correctamente.';
    errorMessage.value = ''; // Limpiar cualquier error previo
  } catch (error) {
    errorMessage.value = error.message || 'Error al actualizar el perfil.';
    successMessage.value = ''; // Limpiar mensaje de éxito en caso de error
  }
};

// Función para regresar a la página anterior
const goBack = () => {
  window.history.back();
};
</script>

<style scoped>
@import url(../assets/PerfilViewStyles.scss);
</style>
