<script setup lang="ts">
import { ref } from 'vue';
import { groqClient } from '../api/groq';
import mermaid from 'mermaid';
import axios from 'axios';

const requerimiento = ref('');
const cargando = ref(false);
const svgContent = ref('');
const errorMsg = ref('');

let abortController: AbortController | null = null;

mermaid.initialize({ startOnLoad: false, theme: 'dark' });

const generarDiagrama = async () => {
    if (!requerimiento.value) return;

    cargando.value = true;
    errorMsg.value = '';
    svgContent.value = '';

    // Preparamos el botón de pánico para esta nueva petición
    abortController = new AbortController();

    try {
        const response = await groqClient.post('/chat/completions', {
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: "Eres un generador de diagramas Mermaid. Responde ÚNICAMENTE con el código puro del diagrama. No uses markdown, no uses ```mermaid, no des explicaciones. Solo el texto validado."
            },
            {
                role: "user",
                content: requerimiento.value
            }
        ],
        temperature: 0.1
        }, {
            signal: abortController.signal
        });

        // 1. Extraemos el texto de la IA
    let rawContent = response.data.choices[0].message.content;
    
    // 2. Limpiamos lo que suele romper a Mermaid
    let mermaidCode = rawContent
        .replace(/```mermaid/g, '') // Quita etiquetas de bloque
        .replace(/```/g, '')        // Quita comillas triples
        .replace(/graph TD/g, 'graph TD\n') // Asegura saltos de línea
        .trim();

        // 3. Verificamos si la IA olvidó poner el inicio del diagrama
        if (!mermaidCode.startsWith('graph') && !mermaidCode.startsWith('sequenceDiagram') && !mermaidCode.startsWith('classDiagram')) {
            mermaidCode = 'graph TD\n' + mermaidCode;
        }

    // 4. Dibujamos con un ID único para evitar conflictos
    const { svg } = await mermaid.render('mermaid-svg-' + Math.random().toString(36).substr(2, 9), mermaidCode);
    svgContent.value = svg;

    } catch (error: any) {
    // Comprobamos si el error fue porque el usuario pulsó "Cancelar"
    if (axios.isCancel(error) || error.name === 'CanceledError') {
            errorMsg.value = '⚠️ Generación cancelada por el usuario.';
        } else {
            console.error(error);
            // Extraemos el mensaje de error exacto que nos devuelve Groq
            const mensajeGroq = error.response?.data?.error?.message || 'Error de conexión desconocido';
            errorMsg.value = `❌ Error de la IA: ${mensajeGroq}`;
        }
    } finally {
        cargando.value = false;
        abortController = null;
    }
};

// Función para el botón rojo de cancelar
const cancelarGeneracion = () => {
    if (abortController) {
        abortController.abort();
    }
};

const descargarSVG = () => {
    if (!svgContent.value) return;

    // Creamos un archivo virtual con el contenido del dibujo
    const blob = new Blob([svgContent.value], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    // Creamos un link invisible para forzar la descarga
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mi-diagrama-ia.svg';
    document.body.appendChild(link);
    link.click();
    
    // Limpiamos la memoria
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
</script>

<template>
    <div class="ia-container">
        <h2>🤖 AI-UML Architect</h2>
        <p>Describe el diagrama que necesitas y la IA lo dibujará para ti.</p>
        
        <textarea 
        v-model="requerimiento" 
        placeholder="Ej: Un diagrama de flujo de un usuario haciendo login..."
        rows="3"
        ></textarea>
        
        <div class="botones">
        <button v-if="!cargando" @click="generarDiagrama" class="btn-generar">
            ✨ Generar Diagrama
        </button>
        
        <button v-else @click="cancelarGeneracion" class="btn-cancelar">
            🛑 Cancelar Generación (La IA está pensando...)
        </button>
        </div>

        <div v-if="errorMsg" class="mensaje-error">
        {{ errorMsg }}
        </div>

        <button v-if="svgContent" @click="descargarSVG" class="btn-descargar">
        📥 Descargar como .SVG
        </button>

        <div v-if="svgContent" class="lienzo-diagrama" v-html="svgContent"></div>
    </div>
</template>

<style scoped>
.ia-container {
    background-color: #1a1a2e;
    padding: 20px;
    border-radius: 10px;
    margin-top: 30px;
    border: 2px solid #16213e;
}
textarea {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    background-color: #0f3460;
    color: white;
    border: none;
    margin-bottom: 10px;
    resize: vertical;
}
.botones {
    display: flex;
    gap: 10px;
}
button {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
}
.btn-generar {
    background-color: #e94560;
    color: white;
}
.btn-cancelar {
    background-color: #533440;
    color: #ff9999;
}
.btn-descargar {
    background-color: #4361ee;
    color: white;
    margin-top: 10px;
    width: 100%;
}
.mensaje-error {
    color: #ff4d4d;
    margin-top: 10px;
    font-weight: bold;
}
.lienzo-diagrama {
    margin-top: 20px;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    overflow-x: auto;
}
</style>