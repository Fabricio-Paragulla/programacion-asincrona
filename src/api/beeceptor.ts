import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'https://gestor-candidaturas-efpn.free.beeceptor.com',
    timeout: 5000
});