<template>
  <div>
    <!-- Page Header -->
    <div class="profile-page-header mb-6">
      <div>
        <h2 class="page-title">連結管理</h2>
        <p class="page-subtitle">管理您的社群連結與自定義按鈕</p>
      </div>
      <v-btn
        color="primary"
        rounded="xl"
        class="save-btn font-weight-bold"
        prepend-icon="mdi-plus"
        @click="openDialog"
      >
        新增連結
      </v-btn>
    </div>

    <v-row :gutter="24">
      <!-- LEFT: Links Management -->
      <v-col cols="12" lg="7">
        <!-- New Link Bento Card -->
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
              <div class="device-notch"></div>
              <div class="device-screen" :class="`theme-screen-${store.profile.theme || 'glassmorphism'}`">
                <div class="screen-glow"></div>
                <div class="screen-content">
                  <div class="sc-status-row">
                    <span class="sc-online">● 在線上</span>
                  </div>
                  <div class="sc-avatar-wrap">
                    <img
                      :src="store.profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`"
                      class="sc-avatar-img"
                    />
                  </div>
                  <div class="sc-name">{{ store.profile.name || '@' + userEmail }}</div>
                  
                  <!-- Real-time Links Preview -->
                  <div class="sc-links-stack mt-4">
                    <div
                      v-for="link in links"
                      :key="'sc-'+link.id"
                      class="sc-link-item"
                    >
                      <v-icon size="12" class="mr-2">{{ link.icon || 'mdi-link-variant' }}</v-icon>
                      <span class="text-truncate">{{ link.title }}</span>
                    </div>
                    <!-- Skeleton if no links -->
                    <template v-if="links.length === 0">
                      <div class="sc-link-placeholder"></div>
                      <div class="sc-link-placeholder" style="width: 70%"></div>
                    </template>
                  </div>

                  <div class="sc-url mt-6">po-match.vercel.app/{{ userEmail }}</div>
                </div>
              </div>
              <div class="device-home-bar"></div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

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

definePageMeta({ layout: 'admin' })

const store = useProfileStore()
const user = useSupabaseUser()
const links = computed(() => store.profile.actionLinks)

const dialog = ref(false)
const isAdding = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const userEmail = computed(() => user.value?.email?.split('@')[0] || 'user')

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

onMounted(async () => {
    if (user.value?.email) {
        const username = user.value.email.split('@')[0]
        await store.fetchProfile(username)
    }
})

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

/* ─── Link Card Item ─── */
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

/* ─── Preview Sidebar ─── */
.preview-sticky { position: sticky; top: 24px; }
.preview-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.preview-title { font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; }
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

/* ─── Phone Device Frame (Unified) ─── */
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
.device-notch { width: 72px; height: 22px; background: #111; border-radius: 0 0 16px 16px; margin: 0 auto; position: relative; z-index: 10; }
.device-notch::before { content: ''; position: absolute; left: 50%; top: 7px; transform: translateX(-50%); width: 10px; height: 10px; background: #222; border-radius: 50%; }

.device-screen {
  width: 100%; height: 460px;
  overflow-y: auto; overflow-x: hidden;
  background: linear-gradient(170deg, #e0f2fe 0%, #ddd6fe 100%);
  transition: background 0.3s ease;
  scrollbar-width: none;
}
.device-screen::-webkit-scrollbar { display: none; }
.theme-screen-glassmorphism { background: linear-gradient(170deg, #e0f2fe 0%, #ddd6fe 100%); }
.theme-screen-cyberpunk { background: linear-gradient(170deg, #020917 0%, #0d1b2a 60%, #071018 100%); }
.theme-screen-minimalist { background: linear-gradient(170deg, #f0f4f8 0%, #e2e8f0 100%); }

.screen-glow { position: absolute; top: -40px; left: 50%; transform: translateX(-50%); width: 160px; height: 160px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%); pointer-events: none; }
.screen-content { position: relative; z-index: 2; padding: 10px 14px 20px; text-align: center; }

.sc-status-row { display: flex; justify-content: flex-end; margin-bottom: 8px; }
.sc-online { font-size: 8px; font-weight: 700; color: #4ade80; background: rgba(74,222,128,0.12); border-radius: 20px; padding: 2px 8px; }
.sc-avatar-wrap { width: 44px; height: 44px; margin: 0 auto 8px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2); overflow: hidden; }
.sc-avatar-img { width: 100%; height: 100%; object-fit: cover; }
.sc-name { font-size: 13px; font-weight: 800; color: #fff; margin-bottom: 12px; }
.theme-screen-glassmorphism .sc-name, .theme-screen-minimalist .sc-name { color: #0f172a; }

.sc-links-stack { display: flex; flex-direction: column; gap: 6px; }
.sc-link-item {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 10px;
  color: white;
  text-align: left;
  display: flex;
  align-items: center;
}
.theme-screen-glassmorphism .sc-link-item,
.theme-screen-minimalist .sc-link-item { background: rgba(255,255,255,0.6); border-color: rgba(255,255,255,0.8); color: #1e293b; box-shadow: 0 2px 6px rgba(0,0,0,0.02); }
.theme-screen-cyberpunk .sc-link-item { border-color: #ff00ff; color: #00ffcc; background: rgba(0,0,0,0.3); }

.sc-link-placeholder { height: 24px; background: rgba(255,255,255,0.06); border-radius: 8px; margin-bottom: 6px; }
.sc-url { font-size: 8px; color: rgba(255,255,255,0.2); font-family: monospace; }
.theme-screen-glassmorphism .sc-url, .theme-screen-minimalist .sc-url { color: rgba(0,0,0,0.25); }

.device-home-bar { height: 20px; background: #111; display: flex; align-items: center; justify-content: center; }
.device-home-bar::after { content: ''; width: 60px; height: 3px; background: rgba(255,255,255,0.2); border-radius: 4px; }

/* ─── Form Fields (Unified) ─── */
.form-field { display: flex; flex-direction: column; }
.field-label { font-size: 12px; font-weight: 600; color: #64748b; margin-bottom: 6px; }
.field-input {
  width: 100%; height: 42px; padding: 0 14px; border: 1.5px solid #e2e8f0; border-radius: 12px;
  font-size: 14px; color: #0f172a; background: white; outline: none; transition: all 0.15s;
}
.field-input:focus { border-color: #1867c0; box-shadow: 0 0 0 3px rgba(24,103,192,0.1); }
.field-select { cursor: pointer; padding-right: 36px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Cpath fill='%2394a3b8' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; appearance: none; }

/* Animation */
.list-enter-active, .list-leave-active { transition: all 0.4s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(30px); }

.gap-3 { gap: 12px; }
</style>
