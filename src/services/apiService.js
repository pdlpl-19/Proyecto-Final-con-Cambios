const API_URL = 'http://172.16.53.10:5000';  // Cambia la URL de la API según corresponda

// Obtener el token de autenticación desde el localStorage
const getAuthToken = () => localStorage.getItem("authToken");

// Función general para hacer peticiones
const fetchData = async (url, options) => {
  const token = getAuthToken();
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  // Se asegura de que las cabeceras sean correctas
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  });

  // Si la respuesta no es ok, se lanza un error
  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error de la API:", errorData);  // Mostrar error de la API
    throw new Error(errorData.message || 'Error en la petición');
  }

  return response.json();
};

// Función para convertir la fecha de formato 'DD/MM/YYYY' a 'YYYY-MM-DD' 
const convertDateFormat = (date) => {
  const [day, month, year] = date.split('/');

  // Verificar si la fecha tiene el formato adecuado
  if (day && month && year && day.length === 2 && month.length === 2 && year.length === 4) {
    return `${year}-${month}-${day}`;  // Formato correcto para JavaScript: YYYY-MM-DD
  } else {
    throw new Error('Formato de fecha incorrecto');
  }
};

// Función para formatear la fecha al formato 'DD/MM/YYYY HH:00:00' (para citas)
const formatDateForAppointment = (date) => {
  const d = new Date(date);

  // Verificar si la fecha es válida
  if (isNaN(d.getTime())) {
    throw new Error('Fecha no válida');
  }

  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');

  // Asegurarse de que el formato sea 'DD/MM/YYYY HH:MM:00'
  return `${day}/${month}/${year} ${hours}:${minutes}:00`;
};

// Función para formatear la fecha al formato 'DD/MM/YYYY' (para nacimiento)
const formatDateForBirth = (date) => {
  const d = new Date(date);

  // Verificar si la fecha es válida
  if (isNaN(d.getTime())) {
    throw new Error('Fecha no válida');
  }

  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();

  // Asegurarse de que el formato sea 'DD/MM/YYYY'
  return `${day}/${month}/${year}`;
};

export const apiService = {
  // Función para login de usuario
  login: async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Credenciales incorrectas.");
      }

      return data; // Retorna el objeto con el token (access_token)
    } catch (error) {
      throw new Error(error.message || "Error al intentar iniciar sesión.");
    }
  },

  // Función register
  register: async (userData) => {
    try {
      // Verificar si la fecha de nacimiento es válida
      if (!userData.dateOfBirth || isNaN(new Date(userData.dateOfBirth))) {
        throw new Error("Fecha de nacimiento no válida.");
      }

      // Formateamos la fecha de nacimiento si existe
      const formattedUserData = {
        ...userData,
        dateOfBirth: formatDateForBirth(userData.dateOfBirth),
      };

      // Realizamos la petición POST
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedUserData),  // Datos del usuario con fecha formateada
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrar usuario.");
      }

      return data;  // Retorna la respuesta de la API si el registro fue exitoso
    } catch (error) {
      throw new Error(error.message || "Error al registrar usuario.");
    }
  },

  // Obtener perfil del usuario
  getProfile: async () => {
    try {
      return await fetchData(`${API_URL}/profile`, { method: 'GET' });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Obtener lista de centros
  getCenters: async () => {
    try {
      return await fetchData(`${API_URL}/centers`, { method: 'GET' });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Obtener citas del usuario
  getAppointments: async () => {
    try {
      return await fetchData(`${API_URL}/date/getByUser`, { method: 'GET' });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Crear una nueva cita
  createAppointment: async (appointmentData) => {
    try {
      // Verificar si la fecha es válida
      if (isNaN(new Date(appointmentData.date))) {
        throw new Error('Fecha no válida');
      }

      // Formatea la fecha para las citas antes de enviarla
      const formattedDate = formatDateForAppointment(appointmentData.date);
      appointmentData.date = formattedDate;  // Reemplaza la fecha original con la formateada

      // Realiza la petición de creación de cita
      const response = await fetchData(`${API_URL}/date/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData), // Datos con fecha formateada
      });

      return response;  // Retorna la respuesta de la API si la cita fue creada correctamente
    } catch (error) {
      console.error("Error al reservar cita:", error);
      throw new Error(error.message);
    }
  },

  // Función para cancelar una cita
  cancelAppointment: async (appointmentData) => {
    try {
      // Verifica si los datos de la cita son válidos
      if (!appointmentData.center || !appointmentData.date) {
        throw new Error("Datos de la cita incompletos.");
      }

      // Muestra los datos de la cita que se están enviando
      console.log("Cancelando cita con los siguientes datos:", appointmentData);

      // Realiza la petición para cancelar la cita
      const response = await fetchData(`${API_URL}/date/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),  // Datos de la cita
      });

      // Si la respuesta es exitosa, muestra el resultado
      console.log("Cita cancelada exitosamente:", response);

      return response;
    } catch (error) {
      // Manejo de errores
      console.error("Error al cancelar cita:", error);
      throw new Error(error.message || "Error al cancelar la cita.");
    }
  },

  // Obtener todas las citas (método adicional)
  getAllAppointments: async () => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autorizado');
    }

    const response = await fetch(`${API_URL}/dates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error en la API');
    }

    const data = await response.json();
    return data;
  },

  // Actualizar el perfil del usuario
  updateProfile: async (userProfile) => {
    try {
      const token = getAuthToken();  // Obtener token del localStorage
      if (!token) {
        throw new Error('Token no encontrado');
      }

      const url = `${API_URL}/currentUser`;  // Asegúrate de que la URL esté correcta

      // Eliminar la verificación y el envío de la fecha de nacimiento
      const { dateOfBirth, ...profileWithoutDateOfBirth } = userProfile;  // Desestructuramos y eliminamos 'dateOfBirth'

      // Realizamos la solicitud PATCH para actualizar el perfil del usuario
      const response = await fetchData(url, {
        method: 'PATCH', // Usamos PATCH para actualizar
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileWithoutDateOfBirth),  // Enviamos los datos sin la fecha de nacimiento
      });

      return response;  // Retorna la respuesta de la API si la actualización fue exitosa
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      throw new Error(error.message);
    }
  },
};
