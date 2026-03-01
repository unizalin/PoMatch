<template>
  <div>
    <!-- Page Header -->
    <div class="profile-page-header mb-6">
      <div>
        <h2 class="page-title">個人資料</h2>
        <p class="page-subtitle">設定你的數位名片，讓別人認識最真實的你</p>
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

    <v-row :gutter="24">
      <!-- LEFT: Main Form -->
      <v-col cols="12" lg="7">

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
              <input
                v-model="editedProfile.name"
                class="field-input"
                placeholder="輸入你的名稱或暱稱"
              />
            </div>
            <div class="form-field">
              <label class="field-label">頭像網址</label>
              <input
                ref="avatarFieldRef"
                v-model="editedProfile.avatar"
                class="field-input"
                placeholder="https://..."
              />
            </div>
          </div>

          <div class="mt-3">
            <label class="field-label">個人簡介</label>
            <textarea
              v-model="editedProfile.description"
              class="field-input field-textarea"
              placeholder="用一句話介紹你自己，讓人印象深刻..."
              rows="3"
              maxlength="100"
            ></textarea>
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
              <select v-model="editedProfile.persona.mbti" class="field-input field-select">
                <option v-for="m in mbtiOptions" :key="m" :value="m">{{ m }}</option>
              </select>
            </div>
            <div class="form-field">
              <label class="field-label">星座</label>
              <select v-model="editedProfile.persona.zodiac" class="field-input field-select">
                <option v-for="z in zodiacOptions" :key="z" :value="z">{{ z }}</option>
              </select>
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

        <!-- ── Theme ── -->
        <div class="section-card">
          <div class="section-label">
            <v-icon size="16" color="amber-darken-2">mdi-palette-outline</v-icon>
            名片主題
          </div>
          <div class="theme-grid">
            <button
              v-for="t in themes"
              :key="t.value"
              class="theme-card"
              :class="{ 'theme-active': editedProfile.theme === t.value }"
              @click="editedProfile.theme = t.value"
            >
              <div class="theme-preview" :style="{ background: t.previewBg }">
                <div class="theme-preview-content">
                  <div class="tp-avatar"></div>
                  <div class="tp-line tp-line-lg"></div>
                  <div class="tp-line tp-line-sm"></div>
                  <div class="tp-btn" :style="{ background: t.btnColor }"></div>
                </div>
              </div>
              <div class="theme-label">
                <span>{{ t.label }}</span>
                <v-icon v-if="editedProfile.theme === t.value" size="14" color="primary">mdi-check-circle</v-icon>
              </div>
            </button>
          </div>
        </div>
      </v-col>

      <!-- RIGHT: Live Preview -->
      <v-col cols="12" lg="5">
        <div class="preview-sticky">
          <div class="preview-header-row">
            <span class="preview-title">即時預覽</span>
            <a :href="`https://po-match.vercel.app/${userEmail}`" target="_blank" class="preview-link-btn">
              <v-icon size="14">mdi-open-in-new</v-icon>
              查看公開頁面
            </a>
          </div>

          <div class="device-wrap">
            <div class="device-frame">
              <!-- Notch -->
              <div class="device-notch"></div>
              <!-- Screen -->
              <div class="device-screen" :class="`theme-screen-${editedProfile.theme}`">
                <!-- Background glow -->
                <div class="screen-glow"></div>
                <!-- Content -->
                <div class="screen-content">
                  <!-- Online -->
                  <div class="sc-status-row">
                    <span class="sc-online">● 在線上</span>
                  </div>
                  <!-- Avatar -->
                  <div class="sc-avatar-wrap">
                    <img
                      :src="editedProfile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`"
                      class="sc-avatar-img"
                    />
                  </div>
                  <div class="sc-name">{{ editedProfile.name || '@' + userEmail }}</div>
                  <div class="sc-desc">{{ editedProfile.description || '點擊個人簡介來編輯...' }}</div>
                  <!-- Chips -->
                  <div class="sc-chips">
                    <span v-if="editedProfile.persona?.mbti && editedProfile.persona.mbti !== 'UNKNOWN'" class="sc-chip sc-chip-indigo">{{ editedProfile.persona.mbti }}</span>
                    <span v-if="editedProfile.persona?.zodiac && editedProfile.persona.zodiac !== 'UNKNOWN'" class="sc-chip sc-chip-violet">{{ editedProfile.persona.zodiac }}</span>
                    <span v-for="tag in (editedProfile.persona?.tags || []).slice(0,2)" :key="tag" class="sc-chip sc-chip-ghost">{{ tag }}</span>
                  </div>
                  <!-- Links placeholder -->
                  <div class="sc-links-placeholder">
                    <div class="sc-link-row"><div class="sc-link-dot"></div><div class="sc-link-bar sc-link-bar-lg"></div></div>
                    <div class="sc-link-row"><div class="sc-link-dot"></div><div class="sc-link-bar sc-link-bar-md"></div></div>
                    <div class="sc-link-row"><div class="sc-link-dot"></div><div class="sc-link-bar sc-link-bar-sm"></div></div>
                  </div>
                  <!-- Bottom URL -->
                  <div class="sc-url">po-match.vercel.app/{{ userEmail }}</div>
                </div>
              </div>
              <!-- Home bar -->
              <div class="device-home-bar"></div>
            </div>
          </div>

          <!-- Completeness hint -->
          <div class="completeness-card mt-4">
            <div class="comp-header">
              <span class="comp-title">個人資料完整度</span>
              <span class="comp-score">{{ completenessScore }}%</span>
            </div>
            <div class="comp-bar-wrap">
              <div class="comp-bar" :style="{ width: completenessScore + '%' }"></div>
            </div>
            <div class="comp-hints">
              <div v-for="item in completenessItems" :key="item.label" class="comp-item">
                <v-icon size="14" :color="item.done ? 'success' : 'grey-lighten-2'">
                  {{ item.done ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                </v-icon>
                <span :class="item.done ? 'comp-done' : 'comp-todo'">{{ item.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Snackbar -->
    <v-snackbar v-model="showSnackbar" :color="snackbarColor" rounded="pill" class="mb-4" timeout="3000">
      <v-icon class="mr-2" size="18">{{ snackbarColor === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'

definePageMeta({ layout: 'admin' })

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

onMounted(async () => {
  const email = user.value?.email
  if (email) {
    const username = email.split('@')[0]
    await store.fetchProfile(username)
    // Synchronize local form state with fetched store data
    editedProfile.value = JSON.parse(JSON.stringify(store.profile))
    
    // Ensure persona object exists
    if (!editedProfile.value.persona) {
      editedProfile.value.persona = { mbti: 'UNKNOWN', zodiac: 'UNKNOWN', tags: [], location: '' }
    }
    if (!Array.isArray(editedProfile.value.persona.tags)) {
      editedProfile.value.persona.tags = []
    }
  }
})

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

// Completeness
const completenessItems = computed(() => [
  { label: '填寫顯示名稱', done: !!editedProfile.value.name },
  { label: '設定頭像', done: !!editedProfile.value.avatar },
  { label: '填寫個人簡介', done: !!editedProfile.value.description },
  { label: '選擇 MBTI', done: editedProfile.value.persona?.mbti !== 'UNKNOWN' },
  { label: '選擇星座', done: editedProfile.value.persona?.zodiac !== 'UNKNOWN' },
  { label: '新增興趣標籤', done: (editedProfile.value.persona?.tags || []).length > 0 },
])
const completenessScore = computed(() => {
  const done = completenessItems.value.filter(i => i.done).length
  return Math.round((done / completenessItems.value.length) * 100)
})

const themes = [
  {
    label: '玻璃擬態', value: 'glassmorphism',
    previewBg: 'linear-gradient(135deg, #e0f2fe 0%, #ddd6fe 100%)',
    btnColor: '#6366f1'
  },
  {
    label: '賽博龐克', value: 'cyberpunk',
    previewBg: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
    btnColor: '#00ffcc'
  },
  {
    label: '極簡白', value: 'minimalist',
    previewBg: '#f8fafc',
    btnColor: '#1e293b'
  },
]

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
</script>

<style scoped>
/* ─── Page Header ─── */
.profile-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.page-title {
  font-size: 24px;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #0f172a;
  margin: 0 0 4px;
}
.page-subtitle {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}
.save-btn {
  min-width: 120px;
  height: 44px;
}

/* ─── Section Card ─── */
.section-card {
  background: white;
  border: 1px solid #f1f5f9;
  border-radius: 20px;
  padding: 24px;
  transition: box-shadow 0.2s;
}
.section-card:hover {
  box-shadow: 0 4px 24px rgba(0,0,0,0.04);
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

/* ─── Avatar Hero ─── */
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
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(24,103,192,0.4);
}
.avatar-camera-btn:hover { background: #1251a3; }
.avatar-name {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 4px;
}
.avatar-url {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
  font-family: monospace;
}

/* ─── Form Fields ─── */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media (max-width: 600px) {
  .form-row { grid-template-columns: 1fr; }
}
.form-field { display: flex; flex-direction: column; }
.field-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 6px;
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  gap: 6px;
}
.field-badge {
  background: #f1f5f9;
  color: #94a3b8;
  padding: 1px 7px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}
.field-input {
  width: 100%;
  height: 42px;
  padding: 0 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  color: #0f172a;
  background: white;
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
  box-sizing: border-box;
  -webkit-appearance: none;
}
.field-input:focus {
  border-color: #1867c0;
  box-shadow: 0 0 0 3px rgba(24,103,192,0.1);
}
.field-input::placeholder { color: #cbd5e1; }
.field-textarea {
  height: auto;
  padding: 12px 14px;
  resize: vertical;
  line-height: 1.5;
}
.field-select {
  cursor: pointer;
  padding-right: 36px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Cpath fill='%2394a3b8' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
}
.field-counter {
  font-size: 11px;
  color: #94a3b8;
  text-align: right;
  margin-top: 4px;
}
.field-input-wrap { position: relative; }
.field-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.4;
  pointer-events: none;
}
.field-with-icon { padding-left: 36px; }

/* ─── Tags ─── */
.tag-input-area {
  min-height: 44px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 8px 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  cursor: text;
  transition: border-color 0.15s;
  background: white;
}
.tag-input-area:focus-within {
  border-color: #1867c0;
  box-shadow: 0 0 0 3px rgba(24,103,192,0.1);
}
.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 20px;
  padding: 3px 10px 3px 12px;
  font-size: 12px;
  font-weight: 600;
}
.tag-remove {
  background: none;
  border: none;
  cursor: pointer;
  color: #93c5fd;
  font-size: 14px;
  line-height: 1;
  padding: 0;
  transition: color 0.1s;
}
.tag-remove:hover { color: #1d4ed8; }
.tag-text-input {
  flex: 1;
  min-width: 100px;
  border: none;
  outline: none;
  font-size: 13px;
  color: #0f172a;
  background: transparent;
}
.tag-text-input::placeholder { color: #cbd5e1; }

/* ─── Theme ─── */
.theme-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.theme-card {
  border: 2px solid #f1f5f9;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  background: white;
  transition: all 0.15s;
  padding: 0;
}
.theme-card:hover { border-color: #cbd5e1; transform: translateY(-2px); }
.theme-active { border-color: #1867c0 !important; box-shadow: 0 0 0 3px rgba(24,103,192,0.12); }
.theme-preview {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
}
.theme-preview-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 100%;
}
.tp-avatar {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
}
.tp-line {
  border-radius: 4px;
  background: rgba(255,255,255,0.4);
  height: 6px;
}
.tp-line-lg { width: 60%; }
.tp-line-sm { width: 40%; }
.tp-btn {
  width: 50%;
  height: 10px;
  border-radius: 6px;
  margin-top: 2px;
  opacity: 0.8;
}
.theme-label {
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #f1f5f9;
}

/* ─── Right Preview ─── */
.preview-sticky {
  position: sticky;
  top: 24px;
}
.preview-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.preview-title {
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.preview-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #1867c0;
  text-decoration: none;
  padding: 4px 10px;
  border-radius: 20px;
  background: #eff6ff;
  transition: background 0.15s;
}
.preview-link-btn:hover { background: #dbeafe; }

.profile-preview-card {
  border-radius: 24px;
  padding: 24px 20px 28px;
  text-align: center;
  background: linear-gradient(160deg, #0f0c29 0%, #302b63 60%, #24243e 100%);
  position: relative;
  overflow: hidden;
}
.profile-preview-card::before {
  content: '';
  position: absolute;
  top: -60px; left: 50%;
  transform: translateX(-50%);
  width: 200px; height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%);
  pointer-events: none;
}
.theme-bg-cyberpunk {
  background: linear-gradient(160deg, #020917 0%, #0d1b2a 60%, #071018 100%);
}
.theme-bg-minimalist {
  background: linear-gradient(160deg, #f8fafc 0%, #e2e8f0 100%);
}
.theme-bg-minimalist .pv-name,
.theme-bg-minimalist .pv-status, .theme-bg-minimalist .pv-online { color: #0f172a !important; }
.theme-bg-minimalist .pv-desc { color: #64748b !important; }
.theme-bg-minimalist .pv-url { color: #94a3b8 !important; }
.theme-bg-minimalist .pv-divider { background: rgba(0,0,0,0.08) !important; }

/* ─── Phone Device Frame ─── */
.device-wrap { display: flex; justify-content: center; padding: 8px; }
.device-frame {
  width: 220px;
  background: #111;
  border-radius: 44px;
  border: 8px solid #1a1a1a;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.07), inset 0 0 0 1px rgba(255,255,255,0.03), 0 32px 80px -12px rgba(0,0,0,0.6);
  overflow: hidden;
  position: relative;
}
.device-notch {
  width: 72px; height: 22px;
  background: #111;
  border-radius: 0 0 16px 16px;
  margin: 0 auto;
  position: relative; z-index: 10;
}
.device-notch::before {
  content: '';
  position: absolute; left: 50%; top: 7px; transform: translateX(-50%);
  width: 10px; height: 10px;
  background: #222; border-radius: 50%;
}
.device-screen {
  width: 100%; height: 460px;
  overflow-y: auto; overflow-x: hidden;
  background: linear-gradient(170deg, #e0f2fe 0%, #ddd6fe 100%);
  scrollbar-width: none;
  transition: background 0.3s ease;
}
.device-screen::-webkit-scrollbar { display: none; }
.theme-screen-glassmorphism { background: linear-gradient(170deg, #e0f2fe 0%, #ddd6fe 100%); }
.theme-screen-cyberpunk { background: linear-gradient(170deg, #020917 0%, #0d1b2a 60%, #071018 100%); }
.theme-screen-minimalist { background: linear-gradient(170deg, #f0f4f8 0%, #e2e8f0 100%); }
.device-home-bar { height: 28px; background: #111; display: flex; align-items: center; justify-content: center; }
.device-home-bar::after { content: ''; width: 80px; height: 4px; background: rgba(255,255,255,0.2); border-radius: 4px; }

.screen-glow {
  position: absolute; top: -40px; left: 50%; transform: translateX(-50%);
  width: 160px; height: 160px; border-radius: 50%;
  background: radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%);
  pointer-events: none;
}
.screen-content { position: relative; z-index: 2; padding: 10px 14px 20px; text-align: center; }
.sc-status-row { display: flex; justify-content: flex-end; margin-bottom: 8px; }
.sc-online { font-size: 8px; font-weight: 700; color: #4ade80; background: rgba(74,222,128,0.12); border-radius: 20px; padding: 2px 8px; }
.sc-avatar-wrap {
  width: 64px; height: 64px; margin: 0 auto 8px;
  border-radius: 50%; border: 2.5px solid rgba(255,255,255,0.2);
  box-shadow: 0 0 0 5px rgba(255,255,255,0.06), 0 10px 28px rgba(0,0,0,0.4);
  overflow: hidden; background: rgba(255,255,255,0.1);
}
.sc-avatar-img { width: 100%; height: 100%; object-fit: cover; }
.sc-name { font-size: 14px; font-weight: 800; color: #fff; letter-spacing: -0.02em; margin-bottom: 4px; }
.theme-screen-glassmorphism .sc-name,
.theme-screen-minimalist .sc-name { color: #0f172a; }

.sc-desc { font-size: 9px; color: rgba(255,255,255,0.4); line-height: 1.45; margin-bottom: 10px; padding: 0 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.theme-screen-glassmorphism .sc-desc,
.theme-screen-minimalist .sc-desc { color: #64748b; }
.sc-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px; margin-bottom: 12px; }
.sc-chip { font-size: 8px; font-weight: 700; padding: 2px 8px; border-radius: 20px; }
.sc-chip-indigo { background: rgba(99,102,241,0.22); color: #a5b4fc; border: 1px solid rgba(99,102,241,0.28); }
.sc-chip-violet { background: rgba(168,85,247,0.18); color: #d8b4fe; border: 1px solid rgba(168,85,247,0.22); }
.sc-chip-ghost { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.1); }
.sc-links-placeholder { margin: 0 0 12px; }
.sc-link-row { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 7px 10px; margin-bottom: 6px; }
.theme-screen-glassmorphism .sc-link-row,
.theme-screen-minimalist .sc-link-row { background: rgba(0,0,0,0.05); border-color: rgba(0,0,0,0.08); }
.sc-link-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,0.15); flex-shrink: 0; }
.sc-link-bar { height: 6px; border-radius: 4px; background: rgba(255,255,255,0.12); }
.sc-link-bar-lg { width: 65%; }
.sc-link-bar-md { width: 50%; }
.sc-link-bar-sm { width: 40%; }
.sc-url { font-size: 8px; color: rgba(255,255,255,0.2); font-family: monospace; }
.theme-screen-glassmorphism .sc-url,
.theme-screen-minimalist .sc-url { color: rgba(0,0,0,0.25); }

/* ─── Completeness ─── */
.completeness-card { background: white; border: 1px solid #f1f5f9; border-radius: 20px; padding: 20px; }
.comp-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.comp-title { font-size: 13px; font-weight: 700; color: #475569; }
.comp-score { font-size: 13px; font-weight: 800; color: #1867c0; }
.comp-bar-wrap { height: 6px; background: #f1f5f9; border-radius: 10px; overflow: hidden; margin-bottom: 16px; }
.comp-bar { height: 100%; background: linear-gradient(90deg, #1867c0, #5CBBF6); border-radius: 10px; transition: width 0.5s ease; }
.comp-hints { display: flex; flex-direction: column; gap: 8px; }
.comp-item { display: flex; align-items: center; gap: 8px; }
.comp-done { font-size: 12px; color: #64748b; text-decoration: line-through; opacity: 0.6; }
.comp-todo { font-size: 12px; color: #334155; font-weight: 500; }
</style>
