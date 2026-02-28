export default defineNuxtRouteMiddleware(async (to) => {
    // Skip middleware for auth flow pages — they handle their own redirects
    if (to.path === '/confirm' || to.path === '/login' || to.path === '/register') {
        return
    }

    // Protect all /admin routes
    if (to.path.startsWith('/admin')) {
        const user = useSupabaseUser()

        // Fast path: user composable already has the session
        if (user.value?.id) return

        // Slow path: user composable may be stale right after OAuth callback.
        // Ask the Supabase client directly for the current session.
        try {
            const client = useSupabaseClient()
            const { data: { session } } = await client.auth.getSession()
            if (!session) {
                return navigateTo('/login')
            }
            // Session exists — allow navigation (composable will catch up)
        } catch {
            return navigateTo('/login')
        }
    }
})
