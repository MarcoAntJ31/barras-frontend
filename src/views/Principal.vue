<template>
    <v-container fluid fill-height class="d-flex justify-center align-center pa-0 ma-0">
      <v-row class="fill-height justify-center align-center">
        <v-col cols="12" md="6" class="d-flex flex-column justify-center align-center">
          <v-card class="pa-5" max-width="100%">
            <v-card-title class="headline text-center">Escáner de Códigos de Barras</v-card-title>
            <v-card-text class="d-flex flex-column justify-center align-center">
              <video ref="video" class="video-feed mb-3" autoplay></video>
              <canvas ref="canvas" class="canvas mt-3"></canvas>
            </v-card-text>
          </v-card>
        </v-col>
  
        <!-- Sección del historial -->
        <v-col md="6" class="d-flex flex-column justify-center align-center">
          <v-card class="pa-5" max-width="100%">
            <v-card-title class="headline text-center">Historial de Productos Escaneados</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="(item, index) in scanHistory"
                  :key="index"
                  class="mb-2"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                    <v-list-item-subtitle>Código de Barras: {{ item.barcode }}</v-list-item-subtitle>
                    <v-list-item-subtitle>Descripción: {{ item.description }}</v-list-item-subtitle>
                    <v-list-item-subtitle>Precio: ${{ item.price }}</v-list-item-subtitle>
                    <v-list-item-subtitle>Stock: {{ item.stock }}</v-list-item-subtitle>
                    <v-list-item-subtitle>Escaneado: {{ new Date(item.created_at).toLocaleString() }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
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
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { captureImage } from '@/services/cameraService' 

const video = ref(null)
const canvas = ref(null)
const product = ref(null)
const modalVisible = ref(false)
const scanHistory = ref([]) 
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
  stopAutoCapture()
})

function startAutoCapture() {
  captureInterval = setInterval(() => {
    captureImage(video.value, canvas.value).then(response => {
      console.log('Imagen enviada con éxito:', response.data)
      product.value = response.data
      if (product.value != null) {
        scanHistory.value.unshift(product.value)
        modalVisible.value = true
        stopAutoCapture()
      }
    }).catch(error => {
      console.error('Error al enviar la imagen:', error)
      product.value = null
      modalVisible.value = false
    })
  }, 3000)
}

function stopAutoCapture() {
  if (captureInterval) {
    clearInterval(captureInterval)
    captureInterval = null
  }
}

watch(modalVisible, (newVal) => {
  if (!newVal) {
    startAutoCapture()
  }
})
</script>

<style scoped>
.video-feed {
  width: 100%;
  height: auto;
  margin: auto;
  display: block;
}

.canvas {
  display: none;
}

.v-card {
  overflow: hidden;
  width: 100%;
}

.v-list-item {
  border-bottom: 1px solid #e0e0e0;
}
</style>


  