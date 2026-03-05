<template>
  <div class="studio-content-links">
    <!-- Component Header -->
    <div class="studio-section-header mb-4">
      <div>
        <h2 class="studio-title">背面區塊管理</h2>
        <p class="studio-subtitle">設計您的名片背面，加入連結、菜單或課表等功能</p>
      </div>
      <v-btn
        color="primary"
        rounded="xl"
        elevation="4"
        class="add-btn font-weight-black"
        prepend-icon="mdi-plus-box-multiple"
        @click="openDialog"
      >
        新增功能區塊
      </v-btn>
    </div>

    <!-- ── Industry Kits (Quick Presets) ── -->
    <div class="section-card mb-6 industry-kit-card">
      <div class="section-label mb-4">
        <v-icon size="14" color="accent" class="mr-1">mdi-auto-fix</v-icon>
        產業一鍵套用 (Industry Kits)
      </div>
      <div class="d-flex flex-wrap gap-2">
        <v-btn
          v-for="kit in industryKits"
          :key="kit.id"
          variant="tonal"
          size="small"
          rounded="lg"
          :color="kit.color"
          class="font-weight-bold"
          @click="applyKit(kit.id)"
        >
          <v-icon start size="16">{{ kit.icon }}</v-icon>
          {{ kit.label }}
        </v-btn>
      </div>
    </div>

    <!-- [NEW] Layout Picker -->
    <div class="section-card mb-6">
      <LinkLayoutPicker v-model="profile.themeConfig.linkLayout" @update:modelValue="saveLayout" />
    </div>

    <!-- Links List Card -->
    <div class="section-card">
      <div class="section-label">
        <v-icon size="16" color="primary">mdi-link-variant</v-icon>
        所有連結 ({{ links.length }})
      </div>

      <!-- Empty State -->
      <div v-if="links.length === 0" class="py-12 text-center d-flex flex-column align-center">
        <v-icon size="64" color="grey-lighten-3" class="mb-4">mdi-link-variant-off</v-icon>
        <p class="text-h6 font-weight-bold text-grey-darken-1 mb-1">開始打造個人首頁</p>
        <p class="text-caption text-grey mb-6">目前還沒有連結，點擊上方按鈕新增一個吧！</p>
        <v-btn color="primary" variant="tonal" rounded="lg" @click="openDialog">新增第一個連結</v-btn>
      </div>

      <!-- Links List -->
      <div v-else class="links-list-wrap">
        <transition-group name="list">
          <div
            v-for="(link, index) in links"
            :key="link.id"
            class="link-card-item mb-3"
          >
            <div class="lc-drag-handle">
              <v-btn icon="mdi-chevron-up" variant="text" size="x-small" :disabled="index === 0" @click="moveLink(index, -1)"></v-btn>
              <v-btn icon="mdi-chevron-down" variant="text" size="x-small" :disabled="index === links.length - 1" @click="moveLink(index, 1)"></v-btn>
            </div>

            <div class="lc-icon-naked">
              <v-icon size="32" :color="getIconColor(link.icon)">{{ link.icon || 'mdi-link-variant' }}</v-icon>
            </div>

            <div class="lc-info">
              <div class="lc-title text-truncate">{{ link.title }}</div>
              <div class="lc-url text-truncate">{{ link.url }}</div>
            </div>

            <div class="lc-actions">
              <v-btn icon="mdi-palette-outline" variant="text" color="indigo" size="small" class="mr-1" @click="openStyleDialog(link)"></v-btn>
              <v-btn icon="mdi-delete-outline" variant="text" color="error" size="small" @click="confirmDelete(link)"></v-btn>
            </div>
          </div>
        </transition-group>
      </div>
    </div>

    <!-- [NEW] Add Link Dialog (Extracted) -->
    <LinkAddDialog v-model="dialog" @added="showMsg('連結已成功新增！', 'success')" />

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" rounded="pill" class="mb-4">
      <v-icon class="mr-2" size="18">{{ snackbarColor === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
      {{ snackbarText }}
    </v-snackbar>

    <!-- [NEW] Style Dialog -->
    <LinkStyleDialog v-model="styleDialog" :link="selectedLink" @saved="showMsg('樣式已更新', 'success')" />
  </div>
</template>

<script setup lang="ts">
import LinkLayoutPicker from './LinkLayoutPicker.vue'
import LinkStyleDialog from './LinkStyleDialog.vue'
import LinkAddDialog from './LinkAddDialog.vue'

const store = useProfileStore()
const profile = computed(() => store.profile)
const links = computed(() => store.profile.actionLinks || [])

const dialog = ref(false)
const styleDialog = ref(false)
const selectedLink = ref<any>(null)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const snackbarIcon = ref('mdi-check-circle')

const industryKits = [
  { id: 'fb', label: '餐飲美食', icon: 'mdi-silverware-variant', color: 'orange-darken-1' },
  { id: 'digital', label: '數位創作者', icon: 'mdi-laptop', color: 'blue-darken-1' },
  { id: 'edu', label: '教育服務', icon: 'mdi-school', color: 'indigo-darken-2' },
  { id: 'art', label: '手工文創', icon: 'mdi-palette', color: 'pink-darken-1' }
]

const openDialog = () => {
  dialog.value = true
}

const applyKit = async (kitId: string) => {
  if (confirm(`確定要套用此產業預設嗎？這將會新增多個功能區塊到您的名片背面。`)) {
    const { success, error } = await store.applyIndustryPreset(kitId)
    if (success) showMsg('產業套件已成功套用！', 'success')
    else showMsg('套用失敗: ' + error, 'error')
  }
}
const detectedPlatform = ref('')
const userEditedTitle = ref(false)

const urlPatterns = [
  { pattern: /instagram\.com/i, icon: 'mdi-instagram', title: 'Instagram', color: '#E1306C' },
  { pattern: /facebook\.com|fb\.com/i, icon: 'mdi-facebook', title: 'Facebook', color: '#1877F2' },
  { pattern: /youtube\.com|youtu\.be/i, icon: 'mdi-youtube', title: 'YouTube', color: '#FF0000' },
  { pattern: /tiktok\.com/i, icon: 'mdi-music-note', title: 'TikTok', color: '#000000' },
  { pattern: /twitter\.com|x\.com/i, icon: 'mdi-twitter', title: 'X (Twitter)', color: '#1DA1F2' },
  { pattern: /github\.com/i, icon: 'mdi-github', title: 'GitHub', color: '#333333' },
  { pattern: /threads\.net/i, icon: 'mdi-at', title: 'Threads', color: '#000000' },
  { pattern: /line\.me/i, icon: 'mdi-chat', title: 'LINE', color: '#06C755' },
  { pattern: /linkedin\.com/i, icon: 'mdi-linkedin', title: 'LinkedIn', color: '#0A66C2' },
  { pattern: /spotify\.com/i, icon: 'mdi-spotify', title: 'Spotify', color: '#1DB954' },
  { pattern: /soundcloud\.com/i, icon: 'mdi-soundcloud', title: 'SoundCloud', color: '#FF3300' }
]

const openStyleDialog = (link: any) => {
  selectedLink.value = link
  styleDialog.value = true
}

const saveLayout = async () => {
  await store.updateProfile({ themeConfig: profile.value.themeConfig })
  showMsg('佈局已更新', 'success')
}


const confirmDelete = async (link: any) => {
  if (confirm(`確定要刪除「${link.title}」嗎？`)) {
    await store.deleteLink(link.id)
    showMsg('連結已移除', 'info')
  }
}

const moveLink = async (index: number, delta: number) => {
  const newIndex = index + delta
  if (newIndex < 0 || newIndex >= links.value.length) return
  
  const items = [...links.value]
  const item = items.splice(index, 1)[0]
  items.splice(newIndex, 0, item)
  
  store.profile.actionLinks = items
  await store.debouncedUpdateLinkSortOrder()
  showMsg('順序已更新', 'success')
}

const showMsg = (text: string, color: string) => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

const getIconColor = (icon: string) => {
  const map: Record<string, string> = {
    'mdi-instagram': '#E1306C',
    'mdi-facebook': '#1877F2',
    'mdi-youtube': '#FF0000',
    'mdi-twitter': '#1DA1F2',
    'mdi-github': '#333',
    'mdi-at': '#000',
    'mdi-music-note': '#000'
  }
  return map[icon] || 'var(--v-primary-base)'
}
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

.link-card-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fdfdfd;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  transition: all 0.2s;
}
.link-card-item:hover {
  background: white;
  border-color: #e2e8f0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

.lc-drag-handle {
  display: flex;
  flex-direction: column;
  opacity: 0.4;
}
.lc-icon-naked {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lc-info { flex-grow: 1; overflow: hidden; }
.lc-title { font-size: 15px; font-weight: 800; color: #1e293b; margin-bottom: 2px; }
.lc-url { font-size: 12px; color: #94a3b8; font-family: monospace; }

.lc-stats {
  text-align: right;
  padding: 0 16px;
  border-left: 1px solid #e2e8f0;
}
.lc-clicks { font-size: 18px; font-weight: 900; color: #0f172a; line-height: 1; }
.lc-clicks-label { font-size: 10px; color: #94a3b8; font-weight: 700; text-transform: uppercase; }

.form-field { display: flex; flex-direction: column; }
.field-label { font-size: 12px; font-weight: 600; color: #64748b; margin-bottom: 6px; }
.field-input {
  width: 100%; height: 42px; padding: 0 14px; border: 1.5px solid #e2e8f0; border-radius: 12px;
  font-size: 14px; color: #0f172a; background: white; outline: none; transition: all 0.15s;
}
.field-input:focus { border-color: #1867c0; box-shadow: 0 0 0 3px rgba(24,103,192,0.1); }
.field-select { cursor: pointer; padding-right: 36px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Cpath fill='%2394a3b8' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; appearance: none; }

.list-enter-active, .list-leave-active { transition: all 0.4s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(30px); }

.gap-3 { gap: 12px; }
</style>
