<template>
  <div class="content">
    <!-- Botón Atrás -->
    <button @click="goBack" class="back-button">Atrás</button>

    <h3>Centros Disponibles</h3>
    <div v-if="centers.length > 0">
      <ul>
        <li v-for="center in centers" :key="center.nombre">
          <strong>{{ center.nombre }}</strong><br />
          <em>{{ center.direccion }}</em>
        </li>
      </ul>
    </div>
    <p v-else>No hay centros disponibles.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { apiService } from '../services/apiService';  // Asegúrate de tener el path correcto

const centers = ref([]);
const router = useRouter();

// Función para ir atrás
const goBack = () => {
  router.back(); // Retrocede a la página anterior en el historial
};

// Función para obtener los centros usando el apiService
const fetchCenters = async () => {
  try {
    const data = await apiService.getCenters(); // Llamamos al método getCenters del apiService
    centers.value = data.map(center => ({
      nombre: center.name,
      direccion: center.address,
    }));
  } catch (error) {
    console.error('Error al obtener centros:', error);
  }
};

onMounted(() => {
  fetchCenters(); // Llamamos a la función para obtener los centros al montar el componente
});
</script>

<style scoped>
@import url(../assets/styles.scss);
</style>
