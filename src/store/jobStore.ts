import { defineStore } from 'pinia';
import { apiClient } from '../api/beeceptor';

// 1. Definimos el "molde"
export interface Job {
    id?: number; // El signo de interrogación significa que el ID es opcional al crear una nueva
    empresa: string;
    puesto: string;
    estado: string;
}

// 2. Creamos el almacén central
export const useJobStore = defineStore('jobStore', {
  // state: es la memoria donde guardamos los datos
    state: () => ({
    jobs: [
        ] as Job[],
        loading: false,
        error: ''
    }),

  // actions: son las funciones que modifican esa memoria
    actions: {
        async fetchJobs() {
            this.loading = true;
            this.error = '';
            try {
                    const response = await apiClient.get('/jobs');
                    this.jobs = response.data; 
                } catch (error) {
                    this.error = 'Hubo un error al cargar las candidaturas';
                    console.error(error);
                } finally {
                    this.loading = false;
            }
        },

    async addJob(nuevoTrabajo: Job) {
        try {
            // Le mandamos el POST a Beeceptor para fingir que lo guardamos en la nube
            await apiClient.post('/jobs', nuevoTrabajo);
    
            this.jobs.push({
            ...nuevoTrabajo,
            id: Date.now() // Nos inventamos un ID único temporal
            });
            } catch (error) {
                console.error('Error al añadir candidatura', error);
                alert('Hubo un problema al guardar la candidatura');
            }
        },
    async updateJob(id: number | undefined, nuevoEstado: string) {
      if (!id) return; // Por seguridad, si no hay ID no hacemos nada
        try {
            await apiClient.put(`/jobs/${id}`, { estado: nuevoEstado });
    
            const index = this.jobs.findIndex(job => job.id === id);
            if (index !== -1 && this.jobs[index]) {
            this.jobs[index].estado = nuevoEstado;
            }
        } catch (error) {
            console.error('Error al actualizar estado', error);
            alert('Error al actualizar');
        }
        },

        async deleteJob(id: number | undefined) {
        if (!id) return;
        try {
                await apiClient.delete(`/jobs/${id}`);
                
                // Filtramos nuestra lista visual para quitar el que acabamos de borrar
                this.jobs = this.jobs.filter(job => job.id !== id);
            } catch (error) {
                console.error('Error al borrar', error);
                alert('Error al borrar la candidatura');
            }
        },
        async syncWithLocalStorage() {
            localStorage.setItem('jobs_backup', JSON.stringify(this.jobs));
        },

        loadFromLocalStorage() {
        const data = localStorage.getItem('jobs_backup');
            if (data) this.jobs = JSON.parse(data);
        }
    }
});