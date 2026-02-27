<template>
  <v-container fluid class="fill-height registration-bg">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="glass-card pa-8 text-center elevation-12">
          <div class="mb-6">
            <h1 class="text-h4 font-weight-bold text-primary mb-2">建立你的 PoMatch</h1>
            <p class="text-body-2 text-grey">選擇一個專屬 ID，開始打造你的數位名片</p>
          </div>

          <v-form @submit.prevent="submitRegistration" v-model="isFormValid">
            <v-text-field
              v-model="customId"
              label="自定義 ID"
              placeholder="例如: yourname"
              variant="outlined"
              density="comfortable"
              prefix="pomatch.me/"
              :rules="idRules"
              :loading="isChecking"
              @input="onInput"
              class="mb-4 id-input-field"
              :color="isAvailable === true ? 'success' : (isAvailable === false ? 'error' : 'primary')"
            >
              <template v-slot:append-inner>
                <v-fade-transition hide-on-leave>
                  <v-icon v-if="isAvailable === true" color="success">mdi-check-decagram</v-icon>
                  <v-icon v-else-if="isAvailable === false" color="error">mdi-alert-circle-outline</v-icon>
                </v-fade-transition>
              </template>
            </v-text-field>

            <v-expand-transition>
              <div v-if="isAvailable === false" class="text-caption text-error mb-4 text-left px-2">
                這個 ID 已經被別人捷足先登了，換一個試試？
              </div>
            </v-expand-transition>

            <v-btn
              block
              size="x-large"
              color="primary"
              :loading="isSubmitting"
              :disabled="!isFormValid || isAvailable !== true"
              type="submit"
              class="rounded-xl font-weight-bold mt-4 submit-btn gradient-btn"
              elevation="8"
            >
              開啟我的數位名片
              <v-icon end>mdi-rocket-launch</v-icon>
            </v-btn>
          </v-form>

          <div class="mt-8 text-caption text-grey-darken-1">
            <v-icon size="small" class="mr-1">mdi-shield-check-outline</v-icon>
            資安防護已開啟 | 隱私權優先
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useProfileStore } from '~/stores/profile'

const store = useProfileStore()
const router = useRouter()

const customId = ref('')
const isFormValid = ref(false)
const isChecking = ref(false)
const isAvailable = ref(null)
const isSubmitting = ref(false)

const idRules = [
  v => !!v || 'ID 為必填項目',
  v => /^[a-zA-Z0-9_-]+$/.test(v) || '僅限字母、數字、底線或連字號',
  v => v.length >= 3 || '至少需要 3 個字元'
]

let debounceTimer = null
const onInput = () => {
  isAvailable.value = null
  if (customId.value.length < 3) return

  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    isChecking.value = true
    isAvailable.value = await store.checkIdAvailability(customId.value)
    isChecking.value = false
  }, 500)
}

const submitRegistration = async () => {
  if (!isFormValid.value || isAvailable.value !== true) return
  
  isSubmitting.value = true
  const success = await store.handleRegister(customId.value)
  isSubmitting.value = false

  if (success) {
    router.push('/admin/analytics')
  }
}
</script>

<style scoped>
.registration-bg {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

:deep(.v-field__prefix) {
  opacity: 0.6;
  font-weight: bold;
}
</style>
