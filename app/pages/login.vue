<template>
  <v-container fluid class="fill-height login-bg">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="glass-card pa-8 text-center elevation-12">
          <div class="mb-6">
            <h1 class="text-h4 font-weight-bold text-primary mb-2">{{ isSignup ? '加入 PoMatch' : '歡迎回來' }}</h1>
            <p class="text-body-2 text-grey">{{ isSignup ? '建立您的 PoMatch 帳號' : '登入您的 PoMatch 帳號' }}</p>
          </div>

          <v-form @submit.prevent="handleSubmit" v-model="isFormValid">
            <v-text-field
              v-model="email"
              label="電子郵件"
              placeholder="your@email.com"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-email-outline"
              :rules="emailRules"
              autocomplete="email"
              class="mb-4"
              color="primary"
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="密碼"
              placeholder="輸入您的密碼"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              @click:append-inner="showPassword = !showPassword"
              :rules="passwordRules"
              autocomplete="current-password"
              class="mb-4"
              color="primary"
            ></v-text-field>

            <v-alert
              v-if="errorMsg"
              :type="alertType"
              variant="tonal"
              density="compact"
              class="mb-4 text-left"
              closable
              @click:close="errorMsg = ''"
            >
              {{ errorMsg }}
            </v-alert>

            <v-btn
              block
              size="x-large"
              color="primary"
              :loading="loading"
              :disabled="!isFormValid"
              type="submit"
              class="rounded-xl font-weight-bold mt-4 submit-btn gradient-btn"
              elevation="8"
            >
              {{ isSignup ? '註冊帳號' : '登入帳號' }}
              <v-icon end>{{ isSignup ? 'mdi-account-plus' : 'mdi-login' }}</v-icon>
            </v-btn>
          </v-form>

          <v-divider class="my-8">或快速登入</v-divider>

          <v-row dense>
            <v-col cols="6">
              <v-btn
                block
                variant="outlined"
                color="blue-darken-2"
                class="rounded-xl"
                @click="handleSocialLogin('google')"
              >
                <v-icon left>mdi-google</v-icon> Google
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                block
                variant="outlined"
                color="success"
                class="rounded-xl"
                @click="handleSocialLogin('line')"
              >
                <v-icon left>mdi-chat</v-icon> LINE
              </v-btn>
            </v-col>
          </v-row>

          <v-btn
            block
            variant="text"
            color="primary"
            class="rounded-xl mt-4"
            prepend-icon="mdi-magic-staff"
            @click="handleMagicLink"
            :loading="magicLoading"
          >
            使用電子郵件魔術連結
          </v-btn>

          <div class="mt-8 text-body-2">
            {{ isSignup ? '已經有帳號？' : '尚未有帳號？' }}
            <a href="#" @click.prevent="isSignup = !isSignup" class="text-primary font-weight-bold text-decoration-none">
              {{ isSignup ? '立即登入' : '立即註冊' }}
            </a>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useProfileStore } from '~/stores/profile'

const client = useSupabaseClient()
const store = useProfileStore()
const router = useRouter()
const route = useRoute()

const isSignup = ref(route.query.mode === 'signup')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isFormValid = ref(false)
const loading = ref(false)
const magicLoading = ref(false)
const errorMsg = ref('')
const alertType = ref('error')

const emailRules = [
  v => !!v || '電子郵件為必填項目',
  v => /.+@.+\..+/.test(v) || '請輸入有效的電子郵件'
]

const passwordRules = [
  v => !!v || '密碼為必填項目',
  v => v.length >= 6 || '密碼至少需要 6 個字元'
]

const checkProfileAndRedirect = async (userId) => {
  const hasProfile = await store.hasProfile(userId)
  if (hasProfile) {
    router.push('/admin')
  } else {
    router.push('/register')
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  loading.value = true
  errorMsg.value = ''
  alertType.value = 'error'
  
  if (isSignup.value) {
    const { data, error } = await client.auth.signUp({
      email: email.value,
      password: password.value,
    })

    if (error) {
      errorMsg.value = error.message
      loading.value = false
    } else if (data.user) {
      // Check if email confirmation is required
      if (data.session) {
        await checkProfileAndRedirect(data.user.id)
      } else {
        errorMsg.value = '註冊成功！請檢查您的電子郵件以進行驗證。'
        alertType.value = 'success'
        loading.value = false
      }
    }
  } else {
    const { data, error } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) {
      errorMsg.value = error.message === 'Invalid login credentials' ? '電子郵件或密碼錯誤' : error.message
      loading.value = false
    } else if (data.user) {
      await checkProfileAndRedirect(data.user.id)
    }
  }
}

const handleSocialLogin = async (provider) => {
  const { error } = await client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin + '/confirm'
    }
  })
  if (error) errorMsg.value = error.message
}

const handleMagicLink = async () => {
  if (!email.value || !/.+@.+\..+/.test(email.value)) {
    errorMsg.value = '請先輸入有效的電子郵件'
    return
  }

  magicLoading.value = true
  errorMsg.value = ''
  
  const { error } = await client.auth.signInWithOtp({
    email: email.value,
    options: {
      emailRedirectTo: window.location.origin + '/admin',
    }
  })

  if (error) {
    errorMsg.value = error.message
  } else {
    errorMsg.value = '驗證連結已發送至您的信箱！'
  }
  magicLoading.value = false
}
</script>

<style scoped>
.login-bg {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 24px;
}

.gradient-btn {
  background: linear-gradient(90deg, #1867c0, #5cbbf6) !important;
  color: white !important;
}
</style>
