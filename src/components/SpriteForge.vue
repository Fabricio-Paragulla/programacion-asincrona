<script setup lang="ts">
import { ref } from 'vue';

const prompt = ref('pixel art character');
const imageUrl = ref('');
const progreso = ref(0);
const cargando = ref(false);
const numFrames = ref(4);

const generarSprite = () => {
    cargando.value = true;
    progreso.value = 0;
    imageUrl.value = '';

    const intervalo = setInterval(() => {
        progreso.value += 25;
        if (progreso.value >= 100) {
        clearInterval(intervalo);
        cargando.value = false;
        
        // Crear una imagen de 256x64 con 4 cuadros de colores (64x64 cada uno)
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
            // Cuadro 1: Rojo
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(0, 0, 64, 64);
            
            // Cuadro 2: Verde
            ctx.fillStyle = '#00FF00';
            ctx.fillRect(64, 0, 64, 64);
            
            // Cuadro 3: Azul
            ctx.fillStyle = '#0000FF';
            ctx.fillRect(128, 0, 64, 64);
            
            // Cuadro 4: Amarillo
            ctx.fillStyle = '#FFFF00';
            ctx.fillRect(192, 0, 64, 64);
            
            imageUrl.value = canvas.toDataURL();
        }
        numFrames.value = 4;
        }
    }, 150);
};
</script>

<template>
    <div class="forge-container">
        <h2>🎨 SpriteSheet AI Forge</h2>
        <p class="nota">Modo "Indestructible": Imagen integrada en el código para evitar errores de red.</p>
        
        <div class="controles">
        <input v-model="prompt" placeholder="Describe tu personaje..." :disabled="cargando" />
        <button @click="generarSprite" :disabled="cargando" class="btn-generar">
            {{ cargando ? 'Procesando...' : 'Generar Personaje' }}
        </button>
        </div>

        <div v-if="cargando || progreso > 0" class="progress-container">
        <div class="progress-bar" :style="{ width: progreso + '%' }"></div>
        <span class="progress-text">{{ progreso }}%</span>
        </div>

        <div v-if="imageUrl" class="resultado">
        <p><strong>Hoja de Sprites (Tira de colores):</strong></p>
        <img :src="imageUrl" class="original-sheet" />
        
        <p><strong>Animación por Pasos (Steps):</strong></p>
        <div class="view-box">
            <div class="sprite-animado" :style="{ backgroundImage: `url(${imageUrl})` }"></div>
        </div>

        <div class="config">
            <label>Ajustar Frames: </label>
            <input type="number" v-model.number="numFrames" min="1" max="10" />
        </div>
        </div>
    </div>
</template>

<style scoped>
.forge-container {
    background-color: #1a2e1a;
    padding: 20px;
    border-radius: 12px;
    margin-top: 20px;
    border: 2px solid #2d4a2d;
    color: #fff;
    text-align: center;
}

.btn-generar {
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
}

.progress-container {
    width: 100%;
    background-color: #333;
    height: 20px;
    border-radius: 10px;
    margin: 15px 0;
    overflow: hidden;
    position: relative;
}

.progress-bar {
    background-color: #4caf50;
    height: 100%;
    transition: width 0.3s;
}

.progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-weight: bold;
}

.controles {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-bottom: 15px;
}

.controles input {
    flex: 1;
    max-width: 300px;
    padding: 10px;
    border-radius: 6px;
    border: none;
}

.nota {
    color: #a8d5a8;
    font-size: 0.9em;
    margin-bottom: 15px;
    }

.view-box {
    background-color: #333;
    padding: 20px;
    border-radius: 8px;
    margin: 10px auto;
    display: inline-block;
}

/* LA CLAVE DE LA ANIMACIÓN */
.sprite-animado {
    width: 64px;
    height: 64px;
    background-repeat: no-repeat;
    background-size: 256px 64px;
    display: block;
    image-rendering: pixelated;
    animation: play 1.6s steps(4) infinite;
}

@keyframes play {
    from { 
        background-position: 0px; 
    }
    to { 
        background-position: -256px; 
    }
}

.original-sheet {
    border: 1px solid #4caf50;
    margin-bottom: 10px;
    background: #fff; /* Para que se vean bien los colores */
}

.config {
    margin-top: 15px;
}

.config input {
    width: 50px;
    padding: 5px;
    border-radius: 4px;
    border: none;
    text-align: center;
}

.resultado {
    margin-top: 20px;
}
</style>