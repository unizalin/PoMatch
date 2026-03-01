<template>
  <div class="studio-content-links">
    <!-- Component Header -->
    <div class="studio-section-header mb-6">
      <div>
        <h2 class="studio-title">連結管理</h2>
        <p class="studio-subtitle">管理您的社群連結與自定義按鈕</p>
      </div>
      <v-btn
        color="primary"
        rounded="xl"
        class="add-btn font-weight-bold"
        prepend-icon="mdi-plus"
        @click="openDialog"
      >
        新增連結
      </v-btn>
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

            <div class="lc-icon-wrap" :style="{ color: getIconColor(link.icon) }">
              <v-icon size="24">{{ link.icon || 'mdi-link-variant' }}</v-icon>
            </div>

            <div class="lc-info">
              <div class="lc-title text-truncate">{{ link.title }}</div>
              <div class="lc-url text-truncate">{{ link.url }}</div>
            </div>

            <div class="lc-stats">
              <div class="lc-clicks">{{ link.clicks || 0 }}</div>
              <div class="lc-clicks-label">點擊</div>
            </div>

            <div class="lc-actions">
              <v-btn icon="mdi-delete-outline" variant="text" color="error" size="small" @click="confirmDelete(link)"></v-btn>
            </div>
          </div>
        </transition-group>
      </div>
    </div>

    <!-- Add/Edit Link Dialog -->
    <v-dialog v-model="dialog" max-width="460">
      <v-card class="section-card pa-6" rounded="xl">
        <h3 class="text-h6 font-weight-black mb-6">新增連結</h3>
        
        <div class="form-field mb-4">
          <label class="field-label">連結名稱</label>
          <input
            v-model="newLink.title"
            class="field-input"
            placeholder="例如: 我的 Instagram"
          />
        </div>

        <div class="form-field mb-4">
          <label class="field-label">連結網址</label>
          <input
            v-model="newLink.url"
            class="field-input"
            placeholder="https://..."
          />
        </div>

        <div class="form-field mb-6">
          <label class="field-label">選擇圖示</label>
          <select v-model="newLink.icon" class="field-input field-select">
            <option v-for="opt in iconOptions" :key="opt.value" :value="opt.value">{{ opt.title }}</option>
          </select>
        </div>
        
        <div class="d-flex gap-3">
          <v-btn variant="text" rounded="xl" @click="dialog = false" class="flex-grow-1">取消</v-btn>
          <v-btn color="primary" rounded="xl" class="flex-grow-1 font-weight-bold" :loading="isAdding" @click="handleAdd">儲存連結</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" rounded="pill" class="mb-4">
      <v-icon class="mr-2" size="18">{{ snackbarColor === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'

const store = useProfileStore()
const links = computed(() => store.profile.actionLinks || [])

const dialog = ref(false)
const isAdding = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const newLink = ref({ title: '', url: '', icon: 'mdi-link-variant' })
const iconOptions = [
  { title: '一般連結', value: 'mdi-link-variant' },
  { title: 'Instagram', value: 'mdi-instagram' },
  { title: 'Facebook', value: 'mdi-facebook' },
  { title: 'YouTube', value: 'mdi-youtube' },
  { title: 'Threads', value: 'mdi-at' },
  { title: 'TikTok', value: 'mdi-music-note' },
  { title: 'X (Twitter)', value: 'mdi-twitter' },
  { title: 'Github', value: 'mdi-github' }
]

const openDialog = () => {
  newLink.value = { title: '', url: '', icon: 'mdi-link-variant' }
  dialog.value = true
}

const handleAdd = async () => {
  if (!newLink.value.title || !newLink.value.url) return
  isAdding.value = true
  const { error } = await store.addLink(newLink.value)
  isAdding.value = false
  if (!error) {
    dialog.value = false
    showMsg('連結已成功新增！', 'success')
  } else {
    showMsg('新增失敗，請確認網址格式', 'error')
  }
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
  await store.updateLinkSortOrder()
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
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid transparent;
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
.lc-icon-wrap {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
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
