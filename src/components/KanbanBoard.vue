<script setup lang="ts">
import { useJobStore } from '../store/jobStore';

const store = useJobStore();

// Definimos las columnas según los estados que usas
const columns = [
    { id: 'CV Enviado', title: 'Pendientes' },
    { id: 'Entrevista Técnica', title: 'En Proceso' },
    { id: 'Aceptada', title: 'Finalizado' }
];

const onDragStart = (event: DragEvent, jobId: number) => {
    if (event.dataTransfer) {
        // Guardamos el ID como string porque dataTransfer solo acepta texto
        event.dataTransfer.setData('jobId', jobId.toString());
        event.dataTransfer.dropEffect = 'move';
    }
};

const onDrop = (event: DragEvent, newStatus: string) => {
    const jobIdStr = event.dataTransfer?.getData('jobId');
    if (jobIdStr) {
        const jobId = parseInt(jobIdStr);
        // Llamamos a tu acción 'updateJob' definida en el store
        store.updateJob(jobId, newStatus); 
    }
};

// Filtramos usando 'job.estado'
const getJobsByStatus = (status: string) => {
    return store.jobs.filter(job => job.estado === status);
};
</script>

<template>
    <div class="kanban-container">
        <h2>📋 Tablero de Seguimiento</h2>
        <div class="kanban-board">
        <div 
            v-for="col in columns" 
            :key="col.id" 
            class="kanban-column"
            @dragover.prevent 
            @drop="onDrop($event, col.id)"
        >
            <h3>{{ col.title }}</h3>
            <div class="column-content">
            <div 
                v-for="job in getJobsByStatus(col.id)" 
                :key="job.id"
                class="job-card-mini"
                draggable="true"
                @dragstart="onDragStart($event, job.id!)"
            >
                <p class="job-title">{{ job.puesto }}</p>
                <p class="job-company">{{ job.empresa }}</p>
            </div>
            <p v-if="getJobsByStatus(col.id).length === 0" class="empty-msg">Arrastra aquí...</p>
            </div>
        </div>
        </div>
    </div>
</template>

<style scoped>
.kanban-container {
    margin-top: 30px;
    padding: 20px;
    background-color: #121212;
    border-radius: 12px;
}

.kanban-board {
    display: flex;
    gap: 20px;
    justify-content: space-around;
    align-items: flex-start;
}

.kanban-column {
    background-color: #1e1e1e;
    border-radius: 8px;
    width: 30%;
    min-height: 400px;
    padding: 15px;
    border: 2px dashed #333; /* Estilo visual para zonas de drop */
    transition: border-color 0.3s;
}

.kanban-column:hover {
    border-color: #4caf50;
}

h3 {
    color: #4caf50;
    text-align: center;
    border-bottom: 1px solid #333;
    padding-bottom: 10px;
}

.column-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 15px;
}

.job-card-mini {
    background-color: #2d2d2d;
    padding: 12px;
    border-radius: 6px;
    cursor: grab;
    border-left: 4px solid #4caf50;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
}

.job-card-mini:active {
    cursor: grabbing;
}

.job-title {
    font-weight: bold;
    font-size: 0.9em;
    color: #fff;
}

.job-company {
    font-size: 0.8em;
    color: #aaa;
}

.empty-msg {
    color: #444;
    text-align: center;
    font-style: italic;
    margin-top: 20px;
}
</style>