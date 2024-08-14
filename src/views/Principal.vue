<template>
    <v-container fluid fill-height class="pa-0 ma-0">
        <v-row no-gutters class="fill-height">
            <v-col cols="12" class="d-flex flex-column justify-center align-center">
                <v-card class="pa-5">
                    <v-card-title class="headline text-center">Escáner de Códigos de Barras</v-card-title>
                    <v-card-text class="d-flex flex-column justify-center align-center">
                        <video ref="video" class="video-feed mb-3" autoplay></video>
                        <canvas ref="canvas" class="canvas mt-3"></canvas>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Modal -->
        <v-dialog v-model="modalVisible" max-width="500">
            <v-card>
                <v-card-title class="headline">Información del Producto</v-card-title>
                <v-card-text>
                    <div v-if="product">
                        <p><strong>Nombre:</strong> {{ product.name }}</p>
                        <p><strong>Descripción:</strong> {{ product.description }}</p>
                        <p><strong>Precio:</strong> ${{ product.price }}</p>
                        <p><strong>Stock:</strong> {{ product.stock }}</p>
                        <p><strong>Código de Barras:</strong> {{ product.barcode }}</p>
                        <p><strong>Creado:</strong> {{ new Date(product.created_at).toLocaleString() }}</p>
                        <p><strong>Actualizado:</strong> {{ new Date(product.updated_at).toLocaleString() }}</p>
                    </div>
                    <div v-else>
                        <p>No hay información del producto disponible.</p>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="modalVisible = false">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const video = ref(null)
const canvas = ref(null)
const product = ref(null)
const modalVisible = ref(false)
let captureInterval = null

onMounted(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.value.srcObject = stream
            startAutoCapture()
        })
        .catch(err => {
            console.error("Error al acceder a la cámara:", err)
        })
})

onUnmounted(() => {
    if (captureInterval) {
        clearInterval(captureInterval)
    }
})

function startAutoCapture() {
    captureInterval = setInterval(() => {
        captureImage()
    }, 3000) // Captura cada 3 segundos
}

function captureImage() {
    const context = canvas.value.getContext('2d')
    canvas.value.width = video.value.videoWidth
    canvas.value.height = video.value.videoHeight
    context.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height)

    const imageData = canvas.value.toDataURL('image/png')
    const blob = dataURLtoBlob(imageData)
    const file = new File([blob], 'captured-image.png', { type: 'image/png' })

    const formData = new FormData()
    formData.append('file', file)

    axios.post('http://localhost:8000/products/by_barcode', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(response => {
        console.log('Imagen enviada con éxito:', response.data)
        if (response.data && response.data.product) {
            product.value = response.data.product
            modalVisible.value = true
        } else {
            product.value = null
            modalVisible.value = false
        }
    }).catch(error => {
        console.error('Error al enviar la imagen:', error)
    })
}

function dataURLtoBlob(dataURL) {
    const byteString = atob(dataURL.split(',')[1])
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], { type: mimeString })
}
</script>

<style scoped>
html,
body,
#app,
.fill-height {
    height: 100%;
}

.fill-height {
    height: 100%;
}

.video-feed {
    width: 100%;
    height: auto;
    margin: auto;
    display: block;
}

.scanner {
    text-align: center;
}

.canvas {
    display: none;
}

.v-card {
    overflow: hidden;
}
</style>
