import { createRouter, createWebHistory } from 'vue-router'
import DiffPatcher from '/src/components/DiffPatcher.vue'
const routes = [
    {
        path: '/',
        name: 'Home',
        component: DiffPatcher
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})
export default router
