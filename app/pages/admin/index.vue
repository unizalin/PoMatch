<template>
  <div class="creator-studio">
    <v-row no-gutters class="studio-container">
      <!-- 1. Studio Internal Sidebar (Navigation) -->
      <v-col cols="12" md="8" order="1" order-md="1">
        <!-- ── Refined Header ── -->
        <div class="studio-header mb-8 px-4 py-6 rounded-xl glass-header">
          <div class="d-flex flex-column">
            <h2 class="text-h4 font-weight-black mb-1 gradient-text">創作者工作室</h2>
            <p class="text-subtitle-2 text-grey-darken-1 mb-0 opacity-70">管理您的數位名片內容與視覺風格</p>
          </div>
          
          <div class="d-flex align-center gap-3 mt-4 mt-sm-0">
            <!-- 歷史紀錄群組 -->
            <div class="history-controls d-flex align-center pa-1 rounded-lg">
              <v-btn 
                icon 
                variant="text"
                size="small" 
                :disabled="!canUndo"
                @click="handleUndo"
                class="history-btn"
              >
                <v-icon size="20">mdi-undo</v-icon>
                <v-tooltip activator="parent" location="bottom">復原 (Ctrl+Z)</v-tooltip>
              </v-btn>
              <div class="history-divider mx-1"></div>
              <v-btn 
                icon 
                variant="text"
                size="small" 
                :disabled="!canRedo"
                @click="handleRedo"
                class="history-btn"
              >
                <v-icon size="20">mdi-redo</v-icon>
                <v-tooltip activator="parent" location="bottom">重做 (Ctrl+Y)</v-tooltip>
              </v-btn>
            </div>

            <!-- 儲存按鈕 -->
            <v-btn
              color="primary"
              variant="flat"
              rounded="pill"
              class="save-trigger px-8"
              height="48"
              :elevation="isDirty ? 8 : 0"
              :disabled="!isDirty || isSaving"
              @click="handleSave"
            >
              <v-icon start size="20" class="mr-2">{{ isSaving ? 'mdi-loading mdi-spin' : 'mdi-cloud-upload-outline' }}</v-icon>
              <span class="font-weight-black">{{ isSaving ? '同步中' : '發布變更' }}</span>
              <v-badge
                v-if="isDirty && !isSaving"
                dot
                color="amber-accent-4"
                offset-x="-12"
                offset-y="-12"
                class="pulse-badge"
              ></v-badge>
            </v-btn>
          </div>
        </div>

        <div class="studio-nav-container mb-6 overflow-x-auto">
          <div class="studio-tabs">
            <button
              v-for="item in allItems"
              :key="item.id"
              class="studio-tab-item"
              :class="{ active: activeTab === item.id }"
              @click="activeTab = item.id"
            >
              <v-icon size="18" class="mr-2">{{ item.icon }}</v-icon>
              <span>{{ item.label }}</span>
              <div v-if="activeTab === item.id" class="active-indicator"></div>
            </button>
          </div>
        </div>
      </v-col>

      <!-- 2. Main Editor Area -->
      <v-col cols="12" lg="8" class="studio-editor-section">
        <v-row>
          <v-col cols="12" md="7" lg="8" class="studio-editor-pane pa-6">
            <transition name="fade-slide" mode="out-in">
              <component :is="activeComponent" :key="activeTab" />
            </transition>
          </v-col>

          <!-- 3. Live Preview Area (Desktop Only) -->
          <v-col cols="12" md="5" lg="4" class="studio-preview-pane py-6 pr-6 d-none d-md-block">
            <div class="preview-sticky">
              <div class="preview-card-wrap">
                 <StudioPreview />
              </div>
              
              <div class="preview-actions mt-6 px-4">
                <v-btn
                  block
                  color="primary"
                  rounded="xl"
                  class="publish-btn font-weight-black"
                  prepend-icon="mdi-rocket-launch"
                  size="large"
                  :href="`/${store.profile.username || ''}`"
                  target="_blank"
                >
                  查看公開名片頁
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- 4. Mobile Preview FAB (Visible on sm/md only) -->
    <v-fab
      v-if="$vuetify.display.mdAndDown"
      icon="mdi-cellphone-eye"
      color="primary"
      location="bottom end"
      size="x-large"
      class="mobile-preview-fab"
      @click="mobilePreviewDialog = true"
    >
      <v-icon size="28">mdi-cellphone-eye</v-icon>
      <v-tooltip activator="parent" location="left">查看預覽</v-tooltip>
    </v-fab>

    <!-- 5. Mobile Preview Dialog -->
    <v-dialog
      v-model="mobilePreviewDialog"
      fullscreen
      transition="dialog-bottom-transition"
      class="mobile-preview-overlay"
    >
      <v-card class="mobile-preview-card glass-card premium-blur">
        <v-toolbar flat class="px-2 glass-toolbar" color="transparent">
          <v-btn icon="mdi-close" variant="text" @click="mobilePreviewDialog = false"></v-btn>
          <v-toolbar-title class="text-subtitle-1 font-weight-black">手機版預覽</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="flat"
            rounded="xl"
            size="small"
            class="font-weight-black px-6 elevated-card"
            :href="`/${store.profile.username || ''}`"
            target="_blank"
          >
            正式發布
          </v-btn>
        </v-toolbar>
        
        <div class="mobile-preview-body pa-4 d-flex justify-center align-center h-100">
          <div class="preview-zoom-container hover-scale">
            <StudioPreview />
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'
import ContentLinks from '~/components/admin/studio/ContentLinks.vue'
import ContentProfile from '~/components/admin/studio/ContentProfile.vue'
import AppearanceBackground from '~/components/admin/studio/AppearanceBackground.vue'
import AppearanceProfile from '~/components/admin/studio/AppearanceProfile.vue'
import AppearanceLinks from '~/components/admin/studio/AppearanceLinks.vue'
import StudioPreview from '~/components/admin/studio/StudioPreview.vue'

definePageMeta({ layout: 'admin' })

const store = useProfileStore()
const user = useSupabaseUser()
const userEmail = computed(() => user.value?.email?.split('@')[0] || 'user')

const contentItems = [
  { id: 'content-links', label: '連結', icon: 'mdi-link-variant', component: ContentLinks },
  { id: 'content-profile', label: '個人簡介', icon: 'mdi-account-outline', component: ContentProfile },
]

const appearanceItems = [
  { id: 'appearance-background', label: '背景', icon: 'mdi-image-outline', component: AppearanceBackground },
  { id: 'appearance-profile', label: '簡介樣式', icon: 'mdi-format-paint', component: AppearanceProfile },
  { id: 'appearance-links', label: '連結樣式', icon: 'mdi-format-list-bulleted-type', component: AppearanceLinks },
]

const activeTab = ref('content-links')
const mobilePreviewDialog = ref(false)

// ── 手動儲存與歷史紀錄邏輯 ──
const isSaving = computed(() => store.loading)
const canUndo = computed(() => store.canUndo)
const canRedo = computed(() => store.canRedo)
const isDirty = computed(() => store.isDirty)

const handleUndo = () => store.undo()
const handleRedo = () => store.redo()
const handleSave = async () => {
  const { error } = await store.saveChanges()
  if (error) {
    alert('儲存失敗：' + error.message)
  }
}

// 監聽鍵盤快捷鍵 (Ctrl+Z, Ctrl+Y)
const onKeyDown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    if (e.shiftKey) handleRedo()
    else handleUndo()
    e.preventDefault()
  } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
    handleRedo()
    e.preventDefault()
  } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    handleSave()
    e.preventDefault()
  }
}

const allItems = [...contentItems, ...appearanceItems]
const activeComponent = computed(() => {
  return allItems.find(i => i.id === activeTab.value)?.component || ContentLinks
})

// ── 預覽同步邏輯 ──
watch(activeTab, (tab) => {
  if (tab.includes('links')) {
    store.setFlipSide('back')
  } else if (tab.includes('profile') || tab.includes('background')) {
    store.setFlipSide('front')
  }
}, { immediate: true })

onMounted(async () => {
  window.addEventListener('keydown', onKeyDown)
  const username = user.value?.email?.split('@')[0]
  if (username) {
    await store.fetchProfile(username)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
.creator-studio {
  min-height: calc(100vh - 64px);
  background: #f8fafc;
}

.studio-container {
  min-height: inherit;
  max-width: 1400px;
  margin: 0 auto;
}

/* ── UI 優化：Premium 樣式 ── */
.glass-header {
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f1f5f9;
}

.studio-nav-container {
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

.studio-tabs {
  display: flex;
  gap: 8px;
  padding: 4px;
  background: #f1f5f9;
  border-radius: 16px;
  width: fit-content;
  min-width: 100%;
}

.studio-tab-item {
  flex: 1;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  color: #64748b;
  background: transparent;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
  position: relative;
}

.studio-tab-item.active {
  background: white;
  color: #1867c0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.studio-editor-section {
  background: white;
  border-radius: 32px 0 0 0;
  box-shadow: -10px 0 30px rgba(0,0,0,0.02);
}

@media (max-width: 1264px) {
  .studio-editor-section {
    border-radius: 0;
  }
}

.studio-editor-pane {
  min-height: 600px;
}

.active-indicator {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: #1867c0;
  border-radius: 10px;
  display: none; /* 使用 background 做區格即可 */
}


@media (max-width: 600px) {
  .glass-header { flex-direction: column; align-items: flex-start; }
}

.gradient-text {
  background: linear-gradient(135deg, #1867C0 0%, #5CBBF6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.history-controls {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
}

.history-btn {
  opacity: 0.6;
  transition: all 0.2s;
}
.history-btn:hover:not(:disabled) {
  opacity: 1;
  background: white;
}

.history-divider {
  width: 1px;
  height: 20px;
  background: #cbd5e1;
}

.save-trigger {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.save-trigger:not(:disabled) {
  background: linear-gradient(135deg, #1867C0 0%, #1e40af 100%) !important;
}
.save-trigger:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(24, 103, 192, 0.3) !important;
}

.pulse-badge :deep(.v-badge__badge) {
  animation: badge-pulse 2s infinite;
}

@keyframes badge-pulse {
  0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.7); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(255, 193, 7, 0); }
  100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(255, 193, 7, 0); }
}

.nav-group {
  margin-bottom: 24px;
}

/* Sidebar */
.studio-sidebar {
  background: white;
  border-right: 1px solid #f1f5f9;
}

.nav-group-title {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0 16px;
  margin-bottom: 12px;
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px 16px;
  margin-bottom: 4px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  background: transparent;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  text-align: left;
}

.nav-item:hover {
  background: #f8fafc;
  color: #0f172a;
}

.nav-item.active {
  background: #eff6ff;
  color: #1867c0;
}

/* Editor */
.studio-editor {
  max-height: calc(100vh - 64px);
  overflow-y: auto;
}

/* Preview */
.studio-preview {
  display: flex;
  flex-direction: column;
}

.preview-sticky {
  position: sticky;
  top: 24px;
}

.preview-card-wrap {
  display: flex;
  justify-content: center;
  transform: scale(0.95);
  transform-origin: top center;
}

.publish-btn {
  height: 54px !important;
  box-shadow: 0 8px 24px rgba(24, 103, 192, 0.25) !important;
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Mobile Preview Mobile Optimizations */
.mobile-preview-fab {
  position: fixed !important;
  bottom: 32px !important;
  right: 24px !important;
  z-index: 100 !important;
  box-shadow: 0 12px 24px rgba(24, 103, 192, 0.3) !important;
}

.mobile-preview-card {
  background: #f1f5f9 !important;
}

.mobile-preview-body {
  overflow: hidden;
  position: relative;
  background: radial-gradient(circle at center, #ffffff 0%, #e2e8f0 100%);
}

.preview-zoom-container {
  transform: scale(1.1);
  transform-origin: center center;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.glass-toolbar {
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0,0,0,0.05) !important;
}

@media (max-width: 600px) {
  .preview-zoom-container {
    transform: scale(0.95);
  }
}
</style>
