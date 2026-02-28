<template>
  <v-container fluid class="fill-height" style="background:#f8fafc">
    <v-row align="center" justify="center">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          v-if="!errorMsg"
          indeterminate
          color="primary"
          size="64"
          class="mb-4"
        ></v-progress-circular>
        <v-icon v-else size="64" color="error" class="mb-4">mdi-alert-circle-outline</v-icon>
        <h2 class="text-h5 font-weight-bold">{{ errorMsg || '正在進入 PoMatch...' }}</h2>
        <p class="text-body-2 text-grey mt-2">
          {{ errorMsg ? '即將返回登入頁' : '請稍候，正在驗證您的身份' }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'

// Must be client-only: OAuth callback with PKCE requires browser localStorage/cookies
definePageMeta({ ssr: false })

const client = useSupabaseClient()
const store = useProfileStore()
const router = useRouter()
const errorMsg = ref('')

const handleUserId = async (userId: string) => {
  const hasProfile = await store.hasProfile(userId)
  router.replace(hasProfile ? '/admin/links' : '/register')
}

onMounted(async () => {
  // Attempt 1: Session may already be available (e.g. from email/password login redirect)
  const { data: { session } } = await client.auth.getSession()
  if (session?.user?.id) {
    await handleUserId(session.user.id)
    return
  }

  // Attempt 2: Listen for SIGNED_IN event.
  // @nuxtjs/supabase exchanges the PKCE code automatically using its own storage.
  // We MUST NOT call exchangeCodeForSession() manually — that uses localStorage
  // but the module stores the verifier in cookies (SSR-safe).
  let resolved = false
  const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
    if (resolved) return
    if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user?.id) {
      resolved = true
      subscription.unsubscribe()
      await handleUserId(session.user.id)
    }
  })

  // Attempt 3 (delayed fallback): Poll getSession() after a short delay.
  // Sometimes the SIGNED_IN event fires before we've subscribed.
  setTimeout(async () => {
    if (resolved) return
    const { data: { session } } = await client.auth.getSession()
    if (session?.user?.id) {
      resolved = true
      subscription.unsubscribe()
      await handleUserId(session.user.id)
      return
    }
  }, 1500)

  // Timeout: give up after 10s → redirect to login
  setTimeout(() => {
    if (resolved) return
    resolved = true
    subscription.unsubscribe()
    errorMsg.value = '驗證逾時，請重新登入'
    setTimeout(() => router.replace('/login'), 1500)
  }, 10000)
})
</script>
