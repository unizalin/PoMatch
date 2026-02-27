export default defineNuxtRouteMiddleware((to) => {
    const user = useSupabaseUser()

    // Protect all /admin routes
    if (to.path.startsWith('/admin') && !user.value) {
        return navigateTo('/register')
    }
})
