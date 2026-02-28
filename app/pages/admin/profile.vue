<template>
  <NuxtLayout name="admin">
    <div class="d-flex align-center justify-space-between mb-8">
      <div>
        <h2 class="text-h4 font-weight-black mb-1">個人資料</h2>
        <p class="text-body-2 text-grey">設定您的數位名片基本資訊與個人特徵</p>
      </div>
      <v-btn
        color="primary"
        rounded="xl"
        size="large"
        class="font-weight-bold px-8"
        :loading="isSaving"
        @click="saveProfile"
      >
        儲存設定
      </v-btn>
    </div>

    <v-row>
      <v-col cols="12" md="8">
        <v-row>
          <!-- Basic Info Bento -->
          <v-col cols="12">
            <v-card class="bento-card glass-card pa-6" rounded="xl">
              <div class="d-flex align-center gap-2 mb-6">
                <v-icon color="primary" size="20">mdi-card-account-details-outline</v-icon>
                <span class="text-subtitle-1 font-weight-black">基本資訊</span>
              </div>
              
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editedProfile.name"
                    label="顯示名稱"
                    variant="outlined"
                    rounded="lg"
                    placeholder="輸入您的姓名或暱稱"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editedProfile.avatar"
                    label="頭像網址"
                    variant="outlined"
                    rounded="lg"
                    prepend-inner-icon="mdi-image-outline"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="editedProfile.description"
                    label="簡介描述"
                    variant="outlined"
                    rounded="lg"
                    rows="3"
                    placeholder="用一句話介紹你自己..."
                    counter="100"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <!-- Persona Bento -->
          <v-col cols="12" md="6">
            <v-card class="bento-card glass-card pa-6 fill-height" rounded="xl">
              <div class="d-flex align-center gap-2 mb-6">
                <v-icon color="secondary" size="20">mdi-star-face</v-icon>
                <span class="text-subtitle-1 font-weight-black">個人特徵 (Persona)</span>
              </div>
              
              <v-select
                v-model="editedProfile.persona.mbti"
                :items="mbtiOptions"
                label="MBTI 類型"
                variant="outlined"
                rounded="lg"
                class="mb-2"
              ></v-select>
              
              <v-select
                v-model="editedProfile.persona.zodiac"
                :items="zodiacOptions"
                label="星座"
                variant="outlined"
                rounded="lg"
              ></v-select>
            </v-card>
          </v-col>

          <!-- Location & Tags Bento -->
          <v-col cols="12" md="6">
            <v-card class="bento-card glass-card pa-6 fill-height" rounded="xl">
              <div class="d-flex align-center gap-2 mb-6">
                <v-icon color="info" size="20">mdi-tag-multiple-outline</v-icon>
                <span class="text-subtitle-1 font-weight-black">位置與標籤</span>
              </div>
              
              <v-text-field
                v-model="editedProfile.persona.location"
                label="目前位置"
                variant="outlined"
                rounded="lg"
                prepend-inner-icon="mdi-map-marker"
                placeholder="例如: 台北市"
                class="mb-2"
              ></v-text-field>

              <v-combobox
                :model-value="editedProfile.persona.tags"
                @update:model-value="onUpdateTags"
                label="興趣標籤"
                multiple
                chips
                variant="outlined"
                rounded="lg"
                :rules="[tagLimitRule]"
                :hint="tagHint"
                persistent-hint
              ></v-combobox>
            </v-card>
          </v-col>

          <!-- Theme Selection -->
          <v-col cols="12">
            <v-card class="bento-card glass-card pa-6" rounded="xl">
              <div class="d-flex align-center gap-2 mb-6">
                <v-icon color="warning" size="20">mdi-palette-outline</v-icon>
                <span class="text-subtitle-1 font-weight-black">名片模板</span>
              </div>
              
              <v-row>
                <v-col cols="12" md="4" v-for="t in themes" :key="t.value">
                  <v-card
                    class="theme-select-card border-2 pa-3"
                    :class="{ 'active-theme': editedProfile.theme === t.value }"
                    rounded="xl"
                    v-ripple
                    @click="editedProfile.theme = t.value"
                  >
                    <div class="theme-preview-box mb-3" :style="{ background: t.previewBg }"></div>
                    <div class="text-center font-weight-bold text-caption">{{ t.label }}</div>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- Sidebar Preview -->
      <v-col cols="12" md="4">
        <v-card class="bento-card glass-card pa-6 sticky-top" rounded="xl">
          <div class="text-center py-6">
            <v-avatar size="120" class="mb-6 profile-avatar-edit elevation-8">
              <v-img :src="editedProfile.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'"></v-img>
              <v-btn icon="mdi-camera" size="small" color="white" class="avatar-camera-btn"></v-btn>
            </v-avatar>
            
            <h3 class="text-h5 font-weight-black mb-1">{{ editedProfile.name || '@'+userEmail }}</h3>
            <p class="text-body-2 text-grey mb-6">{{ editedProfile.description || '點擊編輯介紹...' }}</p>
            
            <div class="d-flex justify-center gap-2 mb-8">
              <v-chip size="small" variant="tonal" color="primary" class="font-weight-black">{{ editedProfile.persona.mbti }}</v-chip>
              <v-chip size="small" variant="tonal" color="secondary" class="font-weight-black">{{ editedProfile.persona.zodiac }}</v-chip>
            </div>

            <v-divider class="mb-6"></v-divider>
            
            <div class="px-4 text-left">
              <div class="text-caption text-grey font-weight-bold uppercase mb-2">預覽名片</div>
              <v-card class="preview-mini-card pa-4" rounded="xl" elevation="0">
                <div class="d-flex align-center gap-3">
                  <v-avatar size="32"><v-img :src="editedProfile.avatar"></v-img></v-avatar>
                  <div class="text-caption font-weight-bold">po-match.vercel.app/{{ userEmail }}</div>
                </div>
              </v-card>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="showSnackbar" :color="snackbarColor" rounded="pill" class="mb-4">
      {{ snackbarText }}
    </v-snackbar>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'

const store = useProfileStore()
const user = useSupabaseUser()
const isSaving = ref(false)
const showSnackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const userEmail = computed(() => user.value?.email?.split('@')[0] || 'user')
const editedProfile = ref(JSON.parse(JSON.stringify(store.profile)))

// TC-P02: Tag limit validation (max 5 tags)
const MAX_TAGS = 5
const tagHint = computed(() => {
    const count = editedProfile.value.persona.tags?.length || 0
    return `已新增 ${count}/${MAX_TAGS} 個標籤，輸入後按 Enter 新增`
})
const tagLimitRule = (tags: string[] | null) => {
    return !tags || tags.length <= MAX_TAGS || `最多只能新增 ${MAX_TAGS} 個標籤`
}
const onUpdateTags = (newTags: string[]) => {
    if (!newTags) return
    // TC-P02: Enforce max 5, silently ignore extra tags
    editedProfile.value.persona.tags = newTags.slice(0, MAX_TAGS)
    if (newTags.length > MAX_TAGS) {
        showMsg(`標籤最多只能新增 ${MAX_TAGS} 個`, 'warning')
    }
}

const themes = [
  { label: '玻璃擬態', value: 'glassmorphism', previewBg: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)' },
  { label: '賽博龐克', value: 'cyberpunk', previewBg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' },
  { label: '極簡白', value: 'minimalist', previewBg: '#ffffff' }
]

const mbtiOptions = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP', 'UNKNOWN'
]

const zodiacOptions = [
  '牡羊座', '金牛座', '雙子座', '巨蟹座', '獅子座', '處女座',
  '天秤座', '天蠍座', '射手座', '魔羯座', '水瓶座', '雙魚座', 'UNKNOWN'
]

const saveProfile = async () => {
    isSaving.value = true
    try {
        await store.updateProfile(editedProfile.value)
        showMsg('您的個人資料已成功更新！', 'success')
    } catch (error) {
        showMsg('更新失敗，請檢查資料連結是否正常', 'error')
    } finally {
        isSaving.value = false
    }
}

const showMsg = (text: string, color: string) => {
    snackbarText.value = text
    snackbarColor.value = color
    showSnackbar.value = true
}
</script>

<style scoped>
.bento-card {
  transition: all 0.3s ease;
  border: 1px solid #f1f5f9;
}

.sticky-top {
  position: sticky;
  top: 24px;
}

.theme-select-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border-color: #f1f5f9;
}

.theme-select-card:hover {
  border-color: #cbd5e1;
}

.active-theme {
  border-color: #1867c0 !important;
  background-color: #f0f9ff;
}

.theme-preview-box {
  height: 80px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.profile-avatar-edit {
  position: relative;
  border: 4px solid white;
}

.avatar-camera-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.preview-mini-card {
  background-color: #ffffff;
  border: 1px solid #f1f5f9;
}

.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }

.uppercase {
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
</style>
