import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../../features/auth/store/auth.store'
import { PERMISSIONS } from '../../../../../packages/shared/src/permissions'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: () => import('../../features/auth/pages/LoginPage.vue') },
        { path: '/register', component: () => import('../../features/auth/pages/RegisterPage.vue') },
        {
            path: '/app',
            component: () => import('../layouts/AppLayout.vue'),
            redirect: '/app/overview',
            children: [
                { path: 'overview', component: () => import('../pages/OverviewPage.vue') },
                {
                    path: 'requests',
                    component: () => import('../pages/RequestsPage.vue'),
                    meta: { requiredPermission: PERMISSIONS.RequestsRead },
                },
                {
                    path: 'members',
                    component: () => import('../pages/MembersPage.vue'),
                    meta: { requiredPermission: PERMISSIONS.AdminAccess },
                },
                {
                    path: 'settings',
                    component: () => import('../pages/SettingsPage.vue'),
                    meta: { requiredPermission: PERMISSIONS.AdminAccess },
                },
            ],
        },
    ],
})


router.beforeEach((to) => {
    const auth = useAuthStore()
    if ((to.path === '/login' || to.path === '/register') && auth.isAuthed) {
        return typeof to.query.redirect === 'string' ? to.query.redirect : '/app'
    }

    if (to.path === '/login' || to.path === '/register') return true
    if (!auth.isAuthed) return { path: '/login', query: { redirect: to.fullPath } }

    const requiredPermission = typeof to.meta.requiredPermission === 'string'
        ? to.meta.requiredPermission
        : null

    if (requiredPermission && !auth.user?.permissions.includes(requiredPermission)) {
        return '/app/overview'
    }

    return true
})

export default router
