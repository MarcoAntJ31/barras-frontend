<template>
    <div class="scanner">
      <h1>Escáner de Códigos de Barras</h1>
      <video ref="video" class="video-feed" autoplay></video>
      <button @click="captureImage">Capturar Imagen</button>
      <img v-if="capturedImage" :src="capturedImage" alt="Imagen Capturada" class="image-preview" />
      <canvas ref="canvas" class="canvas"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const video = ref(null)
  const canvas = ref(null)
  const capturedImage = ref(null)
  
  onMounted(() => {
    // Acceder a la cámara del navegador
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        video.value.srcObject = stream
      })
      .catch(err => {
        console.error("Error al acceder a la cámara:", err)
      })
  })
  
  function captureImage() {
    const context = canvas.value.getContext('2d')
    canvas.value.width = video.value.videoWidth
    canvas.value.height = video.value.videoHeight
    context.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height)
  
    const imageData = canvas.value.toDataURL('image/png')
    
    capturedImage.value = imageData
  
  }
  </script>
  
  <style scoped>
  .video-feed {
    width: 100%;
    max-width: 600px;
    margin: auto;
    display: block;
  }
  
  .image-preview {
    margin-top: 20px;
    max-width: 100%;
    height: auto;
    border: 2px solid #ccc;
  }
  
  .canvas {
    display: none; 
  }
  </style>
  