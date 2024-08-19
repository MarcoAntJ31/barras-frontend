import axios from 'axios'

export function captureImage(video, canvas) {
    const context = canvas.getContext('2d')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageData = canvas.toDataURL('image/png')
    const blob = dataURLtoBlob(imageData)
    const file = new File([blob], 'captured-image.png', { type: 'image/png' })

    const formData = new FormData()
    formData.append('file', file)

    return axios.post('http://localhost:8000/products/by_barcode', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
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
