import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: () => import('../../features/auth/pages/LoginPage.vue') }
]

export default createRouter({
    history: createWebHistory(),
    routes: routes
})