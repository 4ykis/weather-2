import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/home/Home.vue'
import Saved from '@/pages/saved/Saved.vue'

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/', 
            name: 'Home',
            component: Home
        },
        {
            path: '/saved', 
            name: 'Saved',
            component: Saved
        },
    ]
})