import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/app',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/app',
      component: () => import('../views/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/app/dashboard',
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'admin',
          name: 'admin',
          component: () => import('../views/AdminView.vue'),
          meta: { requiresAuth: true, permission: 'admin:access' },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { public: true },
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.public) return true
  if (to.meta.requiresAuth && !auth.isAuthed) {
    return { name: 'login', query: { next: to.fullPath } }
  }

  const required = to.meta.permission as string | undefined
  if (required && !auth.has(required)) {
    return { name: 'dashboard' }
  }

  return true
})

export default router
