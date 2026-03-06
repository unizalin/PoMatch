<template>
  <div class="studio-content-profile">
    <!-- Component Header -->
    <div class="studio-section-header mb-6">
      <div>
        <h2 class="studio-title">個人簡介</h2>
        <p class="studio-subtitle">設定你的數位名片，讓別人認識最真實的你</p>
      </div>
      <v-btn
        color="primary"
        rounded="xl"
        class="save-btn font-weight-bold"
        :loading="isSaving"
        prepend-icon="mdi-check"
        @click="saveProfile"
      >
        儲存設定
      </v-btn>
    </div>

    <!-- ── Avatar & Name Hero ── -->
    <div class="section-card mb-4">
      <div class="section-label">
        <v-icon size="16" color="primary">mdi-account-circle-outline</v-icon>
        基本資訊
      </div>

      <div class="avatar-hero">
        <div class="avatar-wrap">
          <img
            :src="editedProfile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`"
            class="avatar-img"
          />
          <button class="avatar-camera-btn" @click="focusAvatarField">
            <v-icon size="14" color="white">mdi-camera</v-icon>
          </button>
        </div>
        <div class="avatar-info">
          <p class="avatar-name">{{ editedProfile.name || '@' + userEmail }}</p>
          <p class="avatar-url">po-match.vercel.app/{{ userEmail }}</p>
        </div>
      </div>

      <div class="form-row mt-4">
        <div class="form-field">
          <label class="field-label">顯示名稱</label>
          <div class="field-input-wrap">
            <v-icon size="16" class="field-icon">mdi-account-edit-outline</v-icon>
            <input
              v-model="editedProfile.name"
              class="field-input field-with-icon"
              placeholder="輸入你的名稱或暱稱"
            />
          </div>
        </div>
        <div class="form-field">
          <label class="field-label">頭像網址</label>
          <div class="field-input-wrap">
            <v-icon size="16" class="field-icon">mdi-link-variant</v-icon>
            <input
              ref="avatarFieldRef"
              v-model="editedProfile.avatar"
              class="field-input field-with-icon"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      <div class="mt-3">
        <label class="field-label">個人簡介</label>
        <div class="field-input-wrap">
          <v-icon size="16" class="field-icon align-start mt-3">mdi-text-account</v-icon>
          <textarea
            v-model="editedProfile.description"
            class="field-input field-textarea field-with-icon"
            placeholder="用一句話介紹你自己，讓人印象深刻..."
            rows="3"
            maxlength="100"
          ></textarea>
        </div>
        <div class="field-counter">{{ (editedProfile.description || '').length }} / 100</div>
      </div>
    </div>

    <!-- ── Persona ── -->
    <div class="section-card mb-4">
      <div class="section-label">
        <v-icon size="16" color="deep-purple">mdi-dna</v-icon>
        個人特徵
      </div>

      <div class="form-row">
        <div class="form-field">
          <label class="field-label">MBTI 類型</label>
          <div class="field-input-wrap">
            <v-icon size="16" class="field-icon">mdi-card-account-details-outline</v-icon>
            <select v-model="editedProfile.persona.mbti" class="field-input field-select field-with-icon">
              <option v-for="m in mbtiOptions" :key="m" :value="m">{{ m }}</option>
            </select>
          </div>
        </div>
        <div class="form-field">
          <label class="field-label">星座</label>
          <div class="field-input-wrap">
            <v-icon size="16" class="field-icon">mdi-star-shooting-outline</v-icon>
            <select v-model="editedProfile.persona.zodiac" class="field-input field-select field-with-icon">
              <option v-for="z in zodiacOptions" :key="z" :value="z">{{ z }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="mt-3">
        <label class="field-label">所在位置</label>
        <div class="field-input-wrap">
          <v-icon size="16" class="field-icon">mdi-map-marker-outline</v-icon>
          <input
            v-model="editedProfile.persona.location"
            class="field-input field-with-icon"
            placeholder="例如：台北市、新竹縣..."
          />
        </div>
      </div>

      <div class="mt-3">
        <label class="field-label">
          興趣標籤
          <span class="field-badge">{{ (editedProfile.persona.tags || []).length }}/5</span>
        </label>
        <div class="tag-input-area">
          <v-icon size="16" class="mr-2 opacity-40">mdi-tag-outline</v-icon>
          <span
            v-for="(tag, i) in editedProfile.persona.tags"
            :key="tag"
            class="tag-chip"
          >
            {{ tag }}
            <button class="tag-remove" @click="removeTag(Number(i))">×</button>
          </span>
          <input
            v-if="(editedProfile.persona.tags || []).length < 5"
            v-model="tagInput"
            class="tag-text-input"
            placeholder="輸入標籤後按 Enter"
            @keydown.enter.prevent="addTag"
            @keydown.backspace="onBackspace"
          />
        </div>
      </div>
    </div>

    <!-- Snackbar -->
    <v-snackbar v-model="showSnackbar" :color="snackbarColor" rounded="pill" class="mb-4" timeout="3000">
      <v-icon class="mr-2" size="18">{{ snackbarColor === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'

const store = useProfileStore()
const user = useSupabaseUser()
const isSaving = ref(false)
const showSnackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const tagInput = ref('')
const avatarFieldRef = ref<HTMLInputElement | null>(null)

const userEmail = computed(() => user.value?.email?.split('@')[0] || 'user')
const editedProfile = ref(JSON.parse(JSON.stringify(store.profile)))

// Ensure persona object exists
if (!editedProfile.value.persona) {
  editedProfile.value.persona = { mbti: 'UNKNOWN', zodiac: 'UNKNOWN', tags: [], location: '' }
}
if (!Array.isArray(editedProfile.value.persona.tags)) {
  editedProfile.value.persona.tags = []
}

// Watch for store changes to keep local state in sync (optional, usually page does this on mount)
watch(() => store.profile, (newProfile) => {
  if (newProfile && !isSaving.value) {
    editedProfile.value = JSON.parse(JSON.stringify(newProfile))
    if (!editedProfile.value.persona) {
      editedProfile.value.persona = { mbti: 'UNKNOWN', zodiac: 'UNKNOWN', tags: [], location: '' }
    }
  }
}, { deep: true })

// We also need to emit or sync back to the global state for the real-time preview
// In a unified studio, it's better if `editedProfile` is reactive and shared, 
// or if we watch and update the store's profile (reactive preview).
watch(editedProfile, (val) => {
  store.profile = { ...store.profile, ...val }
}, { deep: true })

const focusAvatarField = () => avatarFieldRef.value?.focus()

// Tags
const addTag = () => {
  const tag = tagInput.value.trim()
  if (!tag) return
  const tags = editedProfile.value.persona.tags || []
  if (tags.length >= 5) { showMsg('標籤最多 5 個', 'warning'); return }
  if (tags.includes(tag)) { tagInput.value = ''; return }
  editedProfile.value.persona.tags = [...tags, tag]
  tagInput.value = ''
}
const removeTag = (i: number) => {
  editedProfile.value.persona.tags.splice(i, 1)
}
const onBackspace = () => {
  if (tagInput.value === '' && editedProfile.value.persona.tags.length > 0) {
    editedProfile.value.persona.tags.pop()
  }
}

const saveProfile = async () => {
  isSaving.value = true
  try {
    await store.updateProfile(editedProfile.value)
    showMsg('個人資料已更新 ✓', 'success')
  } catch {
    showMsg('更新失敗，請重試', 'error')
  } finally {
    isSaving.value = false
  }
}

const showMsg = (text: string, color: string) => {
  snackbarText.value = text
  snackbarColor.value = color
  showSnackbar.value = true
}

const mbtiOptions = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP', 'UNKNOWN'
]

const zodiacOptions = [
  '♈ 牡羊座', '♉ 金牛座', '♊ 雙子座', '♋ 巨蟹座',
  '♌ 獅子座', '♍ 處女座', '♎ 天秤座', '♏ 天蠍座',
  '♐ 射手座', '♑ 魔羯座', '♒ 水瓶座', '♓ 雙魚座', 'UNKNOWN'
]
</script>

<style scoped>
.studio-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.studio-title {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 4px;
}
.studio-subtitle {
  font-size: 13px;
  color: #94a3b8;
}

.section-card {
  background: white;
  border: 1px solid #f1f5f9;
  border-radius: 20px;
  padding: 24px;
}
.section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 20px;
}

.avatar-hero {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 16px;
}
.avatar-wrap {
  position: relative;
  flex-shrink: 0;
}
.avatar-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}
.avatar-camera-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #1867c0;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-name { font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 4px; }
.avatar-url { font-size: 12px; color: #94a3b8; margin: 0; font-family: monospace; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
@media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
.form-field { display: flex; flex-direction: column; }
.field-label { font-size: 12px; font-weight: 600; color: #64748b; margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
.field-badge { background: #f1f5f9; color: #94a3b8; padding: 1px 7px; border-radius: 20px; font-size: 11px; }

.field-input {
  width: 100%; height: 42px; padding: 0 14px; border: 1.5px solid #e2e8f0; border-radius: 12px;
  font-size: 14px; color: #0f172a; background: white; outline: none; transition: all 0.15s;
}
.field-input:focus { border-color: #1867c0; box-shadow: 0 0 0 3px rgba(24,103,192,0.1); }
.field-textarea { height: auto; padding: 12px 14px; resize: vertical; line-height: 1.5; }
.field-select { cursor: pointer; padding-right: 36px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Cpath fill='%2394a3b8' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; appearance: none; }
.field-counter { font-size: 11px; color: #94a3b8; text-align: right; margin-top: 4px; }

.tag-input-area {
  min-height: 44px; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 8px 12px;
  display: flex; flex-wrap: wrap; gap: 6px; align-items: center; background: white;
}
.tag-chip {
  display: inline-flex; align-items: center; gap: 4px; background: #eff6ff; color: #1d4ed8;
  border-radius: 20px; padding: 3px 10px 3px 12px; font-size: 12px; font-weight: 600;
}
.tag-remove { background: none; border: none; cursor: pointer; color: #93c5fd; }
.tag-text-input { flex: 1; border: none; outline: none; font-size: 13px; background: transparent; }

.field-input-wrap { position: relative; }
.field-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); opacity: 0.4; pointer-events: none; }
.field-with-icon { padding-left: 36px; }
</style>
