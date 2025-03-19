<template>
  <div class="container">
    <h2>Registro</h2>
    <form @submit.prevent="register">
      <div class="input-group">
        <label for="name">Nombre</label>
        <input v-model="name" type="text" placeholder="Nombre" required />
      </div>
      <div class="input-group">
        <label for="lastname">Apellido</label>
        <input v-model="lastname" type="text" placeholder="Apellido" required />
      </div>
      <div class="input-group">
        <label for="email">Correo electrónico</label>
        <input v-model="email" type="email" placeholder="Correo electrónico" required />
      </div>
      <div class="input-group">
        <label for="phone">Teléfono</label>
        <input v-model="phone" type="tel" placeholder="Teléfono" required />
      </div>
      <div class="input-group">
        <label for="date">Fecha de nacimiento</label>
        <input v-model="date" type="date" required />
      </div>
      <div class="input-group">
        <label for="username">Usuario</label>
        <input v-model="username" type="text" placeholder="Nombre de usuario" required />
      </div>
      <div class="input-group">
        <label for="password">Contraseña</label>
        <input v-model="password" type="password" placeholder="Contraseña" required />
      </div>
      <button type="submit" :disabled="isLoading">Registrarse</button>
    </form>
    <p>¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link></p>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";

const name = ref("");
const lastname = ref("");
const email = ref("");
const phone = ref("");
const date = ref("");
const username = ref("");
const password = ref("");
const isLoading = ref(false);
const errorMessage = ref("");
const router = useRouter();

const register = async () => {
  if (!name.value || !lastname.value || !email.value || !phone.value || !date.value || !username.value || !password.value) {
    errorMessage.value = "Todos los campos son obligatorios.";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  const formattedDate = date.value.split("-").reverse().join("/");

  const requestData = { name: name.value, lastname: lastname.value, email: email.value, phone: phone.value, date: formattedDate, username: username.value, password: password.value };

  try {
    const response = await fetch("http://172.16.53.10:5000/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(requestData) });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Error al registrar usuario.");

    alert("Registro exitoso!");
    await nextTick();
    router.push("/login");
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
@import url(../assets/styles.scss);
</style>
