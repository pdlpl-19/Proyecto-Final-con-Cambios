<template>
  <div class="container">
    <h1>Mis Citas</h1>

    <!-- Mostrar citas actuales -->
    <div v-if="appointments.length">
      <ul class="appointments-list">
        <li v-for="(appointment, index) in appointments" :key="appointment.id" class="appointment-item">
          <span>{{ appointment.center }} - {{ appointment.date }}</span>
          <button @click="cancelAppointment(appointment)">Cancelar Cita</button>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No tienes citas programadas.</p>
    </div>

    <!-- Formulario para reservar una nueva cita -->
    <h2>Reservar Cita</h2>
    <form @submit.prevent="bookAppointment">
      <div>
        <label for="center">Centro de Salud:</label>
        <select v-model="appointment.center" id="center" required>
          <option v-for="center in centers" :key="center.id" :value="center.name">
            {{ center.name }}
          </option>
        </select>
      </div>

      <div>
        <label for="date">Fecha y Hora:</label>
        <input type="datetime-local" v-model="appointment.date" :min="minDate" required />
      </div>

      <button type="submit">Reservar Cita</button>
    </form>

    <!-- Mensajes de error y éxito -->
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-if="successMessage">{{ successMessage }}</p>

    <!-- Botón para ir al Dashboard -->
    <div class="button-container">
      <router-link to="/dashboard">
        <button class="dashboard-button">Ir al Dashboard</button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { apiService } from '@/services/apiService';  // Asegúrate de que la ruta es correcta

export default {
  data() {
    return {
      appointment: {
        center: "",
        date: "",  // Formato: YYYY-MM-DDTHH:MM
      },
      centers: [],
      appointments: [],
      errorMessage: "",
      successMessage: "",
      minDate: new Date().toISOString().slice(0, 16),  // Para evitar seleccionar fechas pasadas
    };
  },

  async created() {
    try {
      // Obtener centros de salud disponibles
      const centersResponse = await apiService.getCenters();
      this.centers = centersResponse;

      // Obtener citas del usuario
      const appointmentsResponse = await apiService.getAppointments();
      this.appointments = appointmentsResponse;  // Asume que la API devuelve un array de citas
    } catch (error) {
      this.errorMessage = 'Error al cargar los datos.';
    }
  },

  methods: {
    // Método para reservar una cita
    async bookAppointment() {
      try {
        // Llamar a la API para crear la cita
        await apiService.createAppointment(this.appointment);
        this.successMessage = 'Cita reservada con éxito!';
        this.errorMessage = '';

        // Actualizar las citas después de reservar
        const appointmentsResponse = await apiService.getAppointments();
        this.appointments = appointmentsResponse;
      } catch (error) {
        this.errorMessage = `Error al reservar cita: ${error.message}`;
      }
    },

    // Método para cancelar una cita
    async cancelAppointment(appointment) {
      try {
        // Datos de la cita a cancelar
        const appointmentData = {
          center: appointment.center,
          date: appointment.date,  // La fecha debe estar en el formato 'DD/MM/YYYY HH:MM:SS'
        };

        // Llamar a la API para cancelar la cita
        await apiService.cancelAppointment(appointmentData);
        this.successMessage = 'Cita cancelada con éxito!';
        this.errorMessage = '';

        // Actualizar las citas después de cancelar
        const appointmentsResponse = await apiService.getAppointments();
        this.appointments = appointmentsResponse;
      } catch (error) {
        this.errorMessage = `Error al cancelar la cita: ${error.message}`;
      }
    },
  },
};
</script>

<style scoped>
@import url(../assets/CitasStyles.scss);
</style>
