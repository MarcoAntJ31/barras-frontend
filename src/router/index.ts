import {createRouter , createWebHistory} from 'vue-router'
import Principal from '../views/Principal.vue'


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'principal',
            component: Principal
        }
    ]
})

export default router