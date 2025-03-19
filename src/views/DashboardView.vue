<template>
  <div class="dashboard-container">
    <h2>Bienvenido al Dashboard</h2>
    <div class="button-container">
      <router-link to="/centros" class="dashboard-button">Centros</router-link>
      <router-link to="/citas" class="dashboard-button">Citas</router-link>
      <router-link to="/perfil" class="dashboard-button">Perfil</router-link>
      <router-link to="/todas-las-citas" class="dashboard-button">Citas por Día</router-link>
    </div>

    <!-- Aquí puedes incluir una sección para mostrar el contenido dinámicamente -->
    <router-view />
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { apiService } from "@/services/apiService";  // Asegúrate de importar correctamente el servicio

export default {
  name: "DashboardView",
  setup() {
    const activeSection = ref(null);
    const previousSection = ref(null);
    const centers = ref([]);
    const appointments = ref([]);
    const selectedCenter = ref("");
    const selectedDate = ref("");
    const minDate = ref("");
    const userProfile = ref({
      name: "",
      lastname: "",
      email: "",
      phone: ""
    });
    const isAppointmentsVisible = ref(false);
    const loading = ref(false);
    const router = useRouter();

    // Cambiar entre secciones
    const showSection = (section) => {
      if (activeSection.value) {
        previousSection.value = activeSection.value;
      }
      activeSection.value = section;
      if (section === "centros") fetchCenters();
      if (section === "citas") fetchAppointments();
      if (section === "perfil") fetchProfile();
    };

    // Función para volver a la sección anterior
    const goBack = () => {
      if (previousSection.value) {
        activeSection.value = previousSection.value;
      } else {
        activeSection.value = null;
      }
    };

    // Función para obtener el perfil del usuario
    const fetchProfile = async () => {
      loading.value = true;
      try {
        userProfile.value = await apiService.getProfile();
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      } finally {
        loading.value = false;
      }
    };

    // Función para actualizar el perfil del usuario
    const updateProfile = async () => {
      loading.value = true;
      try {
        const updatedProfile = { ...userProfile.value, date: new Date().toLocaleDateString("es-ES") };
        await apiService.updateProfile(updatedProfile);
        alert("Perfil actualizado con éxito.");
      } catch (error) {
        console.error("Error al actualizar el perfil:", error);
        alert("Error al actualizar el perfil.");
      } finally {
        loading.value = false;
      }
    };

    // Funciones para cargar centros y citas
    const fetchCenters = async () => {
      loading.value = true;
      try {
        centers.value = await apiService.getCenters();
      } catch (error) {
        console.error("Error al obtener centros:", error);
      } finally {
        loading.value = false;
      }
    };

    const fetchAppointments = async () => {
      loading.value = true;
      try {
        appointments.value = await apiService.getAppointments();
      } catch (error) {
        console.error("Error al obtener citas:", error);
      } finally {
        loading.value = false;
      }
    };

    const bookAppointment = async () => {
      loading.value = true;
      try {
        const formattedDate = new Date(selectedDate.value);
        const day = ("0" + formattedDate.getDate()).slice(-2);
        const month = ("0" + (formattedDate.getMonth() + 1)).slice(-2);
        const year = formattedDate.getFullYear();
        const hours = ("0" + formattedDate.getHours()).slice(-2);
        const minutes = "00";

        const formattedDateString = `${day}/${month}/${year} ${hours}:${minutes}:00`;

        await apiService.createAppointment({
          center: selectedCenter.value,
          date: formattedDateString,
        });

        fetchAppointments();
        alert("Cita reservada con éxito.");
      } catch (error) {
        console.error("Error al reservar la cita:", error);
        alert("Error al reservar la cita.");
      } finally {
        loading.value = false;
      }
    };

    const setMinDate = () => {
      const now = new Date();
      now.setMinutes(0, 0, 0);
      minDate.value = now.toISOString().slice(0, 16);
    };

    onMounted(() => {
      console.log("Dashboard cargado.");
      setMinDate();
    });

    // Función para alternar la visibilidad de las citas
    const toggleAppointmentsVisibility = () => {
      isAppointmentsVisible.value = !isAppointmentsVisible.value;
    };

    return {
      activeSection,
      previousSection,
      centers,
      appointments,
      selectedCenter,
      selectedDate,
      minDate,
      userProfile,
      isAppointmentsVisible,
      showSection,
      goBack,
      fetchProfile,
      updateProfile,
      fetchCenters,
      fetchAppointments,
      bookAppointment,
      toggleAppointmentsVisibility,
    };
  }
};
</script>


<style scoped>
@import url(../assets/styles.scss);
</style>
