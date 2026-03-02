export default defineNuxtRouteMiddleware(async (to) => {
    const user = useSupabaseUser()
    const client = useSupabaseClient()
    const store = useProfileStore()

    // Handle session retrieval
    let userId = user.value?.id
    if (!userId) {
        try {
            const { data: { session } } = await client.auth.getSession()
            userId = session?.user?.id
        } catch {
            userId = null
        }
    }

    // Redirect Logic
    if (to.path === '/login' || to.path === '/register') {
        if (userId) {
            const hasProfile = await store.hasProfile(userId)
            if (hasProfile) return navigateTo('/admin')
            // If logged in but no profile, and trying to go to login, send to register
            if (to.path === '/login') return navigateTo('/register')
        }
        return
    }

    // Protect all /admin routes
    if (to.path.startsWith('/admin')) {
        if (!userId) return navigateTo('/login')

        // Ensure user has a profile to access admin
        const hasProfile = await store.hasProfile(userId)
        if (!hasProfile) return navigateTo('/register')
    }
})
