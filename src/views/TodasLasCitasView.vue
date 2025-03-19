<template>
  <div class="content">
    <h3>Todas las Citas</h3>
    <div v-if="appointments.length > 0">
      <ul>
        <li v-for="appointment in appointments" :key="appointment.id">
          <p><strong>Centro:</strong> {{ appointment.center }}</p>
          <p><strong>Fecha y Hora:</strong> {{ formatAppointmentDate(appointment) }}</p>
        </li>
      </ul>
      
      <!-- Gráfico de citas por día -->
      <h4>Gráfico de Citas por Día</h4>
      <div class="chart-container">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </div>
    <p v-else>No hay citas disponibles.</p>

    <!-- Botón para volver atrás -->
    <button @click="goBack" class="back-button">Volver atrás</button>
  </div>
</template>

<script setup>
import { apiService } from "../services/apiService";
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const appointments = ref([]);
const chartData = ref({
  labels: [],
  datasets: [{
    label: 'Citas por Día',
    data: [],
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    borderColor: 'rgba(75, 192, 192, 1)',
    borderWidth: 1,
  }],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { title: { display: true, text: 'Días' } },
    y: { title: { display: true, text: 'Número de Citas' }, ticks: { beginAtZero: true, stepSize: 1 } },
  },
});


const fetchAppointments = async () => {
  try {
    const data = await apiService.getAllAppointments(); // Llamamos a la API con el token
    
    // Verificamos que la API devuelve un array
    appointments.value = Array.isArray(data) ? data : [];

    if (appointments.value.length > 0) {
      calculateAppointmentsByDate(); // Actualizamos los datos del gráfico
    }
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    appointments.value = []; // Evitar que sea undefined en caso de error
  }
};


const calculateAppointmentsByDate = () => {
  const dateCount = {};
  appointments.value.forEach((appointment) => {
    const appointmentDate = appointment.date.split(' ')[0];
    dateCount[appointmentDate] = (dateCount[appointmentDate] || 0) + 1;
  });
  chartData.value.labels = Object.keys(dateCount).sort((a, b) => new Date(a) - new Date(b));
  chartData.value.datasets[0].data = Object.values(dateCount);
};

const formatAppointmentDate = (appointment) => {
  return appointment.date ? appointment.date.split(' ')[0] + ' ' + appointment.date.split(' ')[1].substring(0, 5) : 'Fecha no disponible';
};

onMounted(() => {
  fetchAppointments();
});

const router = useRouter();
const goBack = () => {
  router.back();
};
</script>

<style scoped>
.content {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.chart-container {
  width: 100%;
  height: 400px;
  margin: 20px 0;
}

.back-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.back-button:hover {
  background-color: #0056b3;
}
</style>
