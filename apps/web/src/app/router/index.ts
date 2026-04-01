import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../../features/auth/store/auth.store'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: () => import('../../features/auth/pages/LoginPage.vue') },
        { path: '/app', component: () => import('../pages/AppHomePage.vue') },
    ],
})


router.beforeEach((to) => {
    const auth = useAuthStore()
    if (to.path === '/login') return true
    if (!auth.isAuthed) return '/login'
    return true
})

export default router