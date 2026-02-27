<template>
  <NuxtLayout name="admin">
    <div class="d-flex align-center justify-space-between mb-6">
      <h2 class="text-h5 font-weight-bold">個人簡介設定</h2>
      <v-btn color="primary" @click="saveProfile" :loading="isSaving" rounded="lg">保存更改</v-btn>
    </div>

    <v-row>
      <v-col cols="12" md="8">
        <v-card class="glass-card pa-6 mb-6">
          <div class="text-subtitle-1 font-weight-bold mb-4">基本資訊</div>
          <v-text-field
            v-model="editedProfile.name"
            label="顯示名稱"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          ></v-text-field>
          <v-textarea
            v-model="editedProfile.description"
            label="簡介描述"
            variant="outlined"
            density="comfortable"
            rows="3"
            class="mb-4"
          ></v-textarea>
          <v-text-field
            v-model="editedProfile.avatar"
            label="頭像網址 (DiceBear)"
            variant="outlined"
            density="comfortable"
          ></v-text-field>
        </v-card>

        <v-card class="glass-card pa-6 mb-6">
          <div class="text-subtitle-1 font-weight-bold mb-4">風格主題</div>
          <v-radio-group v-model="editedProfile.theme" inline>
            <v-radio label="預設 (Glass)" value="glassmorphism" color="primary"></v-radio>
            <v-radio label="賽博龐克 (Cyber)" value="cyberpunk" color="secondary"></v-radio>
            <v-radio label="極簡主義 (Minimal)" value="minimalist" color="grey"></v-radio>
          </v-radio-group>
        </v-card>

        <v-card class="glass-card pa-6">
          <div class="text-subtitle-1 font-weight-bold mb-4">Persona 特徵 (用於匹配)</div>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="editedProfile.persona.mbti"
                :items="mbtiOptions"
                label="MBTI 類型"
                variant="outlined"
                density="comfortable"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="editedProfile.persona.zodiac"
                :items="zodiacOptions"
                label="星座"
                variant="outlined"
                density="comfortable"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="editedProfile.persona.location"
                label="目前位置"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-map-marker"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-combobox
                v-model="editedProfile.persona.tags"
                label="興趣標籤"
                multiple
                chips
                variant="outlined"
                density="comfortable"
                hint="輸入後按 Enter 新增標籤"
                persistent-hint
              ></v-combobox>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="glass-card pa-6 sticky-top">
          <div class="text-subtitle-1 font-weight-bold mb-4">預覽</div>
          <div class="text-center py-4">
            <v-avatar size="100" class="mb-4 border elevation-4">
              <v-img :src="editedProfile.avatar"></v-img>
            </v-avatar>
            <div class="text-h6 font-weight-bold">{{ editedProfile.name }}</div>
            <div class="text-caption text-grey mb-4">{{ editedProfile.description }}</div>
            
            <div class="d-flex justify-center gap-2">
              <v-chip size="x-small" color="primary">{{ editedProfile.persona.mbti }}</v-chip>
              <v-chip size="x-small" color="secondary">{{ editedProfile.persona.zodiac }}</v-chip>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    
    <v-snackbar v-model="showSnackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </NuxtLayout>
</template>

<script setup>
import { useProfileStore } from '~/stores/profile'

const store = useProfileStore()
const isSaving = ref(false)
const showSnackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const editedProfile = ref(JSON.parse(JSON.stringify(store.profile)))

const mbtiOptions = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'
]

const zodiacOptions = [
  '牡羊座', '金牛座', '雙子座', '巨蟹座', '獅子座', '處女座',
  '天秤座', '天蠍座', '射手座', '魔羯座', '水瓶座', '雙魚座'
]

const saveProfile = async () => {
  isSaving.value = true
  try {
    await store.updateProfile(editedProfile.value)
    snackbarText.value = '設定已成功儲存！'
    snackbarColor.value = 'success'
    showSnackbar.value = true
  } catch (error) {
    snackbarText.value = '儲存失敗，請稍後再試。'
    snackbarColor.value = 'error'
    showSnackbar.value = true
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.sticky-top {
  position: sticky;
  top: 24px;
}
.gap-2 {
  gap: 8px;
}
</style>
