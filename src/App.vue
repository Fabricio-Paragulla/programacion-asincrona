<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useJobStore } from './store/jobStore';
import AiArchitect from './components/AiArchitect.vue';
import SpriteForge from './components/SpriteForge.vue';
import KanbanBoard from './components/KanbanBoard.vue';

const jobStore = useJobStore();

const inputEmpresa = ref('');
const inputPuesto = ref('');

const guardarCandidatura = () => {
  // Verificamos que no haya dejado campos vacíos
  if (inputEmpresa.value === '' || inputPuesto.value === '') {
    alert('Por favor, rellena la empresa y el puesto.');
    return;
  }

  // Creamos el objeto con los datos y se lo pasamos al cerebro (Store)
  jobStore.addJob({
    empresa: inputEmpresa.value,
    puesto: inputPuesto.value,
    estado: 'CV Enviado' // Estado por defecto al crear
  });

  // Limpiamos las cajas de texto tras enviar
  inputEmpresa.value = '';
  inputPuesto.value = '';
};

onMounted(() => {
  jobStore.fetchJobs();
});
</script>

<template>
  <main>
    <h1>Gestor de Candidaturas</h1>

    <div class="formulario">
      <h2>Añadir nueva</h2>
      <input v-model="inputEmpresa" type="text" placeholder="Nombre de la empresa" />
      <input v-model="inputPuesto" type="text" placeholder="Puesto (Ej. Programador)" />
      <button @click="guardarCandidatura">Guardar Candidatura</button>
    </div>
    <hr> <div v-if="jobStore.loading">
      <p>Cargando datos desde el servidor simulado...</p>
    </div>

    <div v-else-if="jobStore.error" style="color: red;">
      {{ jobStore.error }}
    </div>

    <div v-else>
      <div class="job-card" v-for="job in jobStore.jobs" :key="job.id">
        <h3>{{ job.puesto }}</h3>
        <p><strong>Empresa:</strong> {{ job.empresa }}</p>
        
        <p>
          <strong>Estado:</strong> 
          <select :value="job.estado" @change="(e) => jobStore.updateJob(job.id, (e.target as HTMLSelectElement).value)">
            <option value="CV Enviado">CV Enviado</option>
            <option value="Entrevista Técnica">Entrevista Técnica</option>
            <option value="Rechazado">Rechazado</option>
            <option value="Contratado">Contratado</option>
          </select>
        </p>

        <button class="btn-borrar" @click="jobStore.deleteJob(job.id)">Borrar Candidatura 🗑️</button>
      </div>
    </div>
    <AiArchitect />
    <SpriteForge />
    <KanbanBoard />
  </main>
</template>

<style scoped>
main {
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.formulario {
  background-color: #2c2c2c;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px; /* Espacio entre los elementos */
}

input {
  padding: 8px;
  border-radius: 4px;
  border: none;
}

button {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background-color: #45a049;
}

.job-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #1e1e1e;
}

.btn-borrar {
  background-color: #e53935;
  margin-top: 10px;
  width: 100%;
}

.btn-borrar:hover {
  background-color: #c62828;
}

select {
  padding: 5px;
  border-radius: 4px;
  background-color: #333;
  color: white;
  border: 1px solid #555;
}
</style>