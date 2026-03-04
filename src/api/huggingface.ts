import axios from 'axios';

export const hfClient = axios.create({
  baseURL: 'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5',
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_HUGGINGFACE_TOKEN}`,
    'Content-Type': 'application/json',
  },
  responseType: 'blob', // Vital para recibir la imagen
});