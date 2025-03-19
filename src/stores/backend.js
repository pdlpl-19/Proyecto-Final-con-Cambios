import { ref } from 'vue';

const apiUrl = 'http://172.16.53.10:5000/register';  // URL del backend

// Función para registrar un usuario
const registerUser = async (userData) => {
  const isLoading = ref(false);  // Estado de carga
  const errorMessage = ref('');   // Mensaje de error

  try {
    isLoading.value = true;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: data.message || 'Registro exitoso' };
    } else {
      errorMessage.value = data.message || 'Error desconocido';
      return { success: false, message: errorMessage.value };
    }
  } catch (error) {
    errorMessage.value = 'Error en la conexión con el servidor';
    return { success: false, message: errorMessage.value };
  } finally {
    isLoading.value = false;
  }
};

export { registerUser };
