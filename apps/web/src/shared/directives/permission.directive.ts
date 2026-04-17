import type { Directive } from "vue"
import { useAuthStore } from "../../features/auth/store/auth.store"

export const vPermission: Directive<HTMLElement, string | string[]> = {
    mounted(el, binding) {
        const requiredPermissions = typeof binding.value === "string"
            ? [binding.value]
            : binding.value
        const auth = useAuthStore()
        const permissions = auth.user?.permissions || []

        if (!requiredPermissions?.length) {
            el.remove()
            return
        }

        const hasPermission = requiredPermissions.some((permission) => permissions.includes(permission))

        if (!hasPermission) {
            el.remove()
        }
    }
}
