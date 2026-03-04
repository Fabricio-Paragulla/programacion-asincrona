<script setup lang="ts">
import { GithubAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { useAuthStore } from '../store/authStore';

const authStore = useAuthStore();
const auth = getAuth();

const loginConGithub = async () => {
  const provider = new GithubAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    
    if (token) {
      authStore.setSession(result.user, token);
      alert("¡Bienvenido, " + result.user.displayName + "!");
    }
  } catch (error) {
    console.error("Error en login", error);
  }
};
</script>

<template>
  <div class="login-panel">
    <h2>🔐 Acceso al Panel Seguro</h2>
    <button @click="loginConGithub" class="btn-github">
      Iniciar sesión con GitHub
    </button>
  </div>
</template>

<style scoped>
.login-panel { 
    text-align: center; 
    padding: 50px; 
}
.btn-github {
    background-color: #24292e;
    color: white;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
}
</style>