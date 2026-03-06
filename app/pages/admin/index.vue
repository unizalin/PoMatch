<template>
  <div class="creator-studio">
    <!-- 1. Global Studio Header (Sticky) -->
    <div class="studio-global-header px-4 px-md-8 py-3 glass-header d-flex align-center justify-space-between sticky-top z-index-20">
      <div class="d-flex align-center gap-3">
        <h2 class="text-h5 text-md-h4 font-weight-black gradient-text mb-0">工作室</h2>
        <v-chip size="small" variant="tonal" color="primary" class="font-weight-black d-none d-sm-flex">
          {{ allItems.find(i => i.id === activeTab)?.label }}
        </v-chip>
      </div>
      
      <div class="d-flex align-center gap-2 gap-sm-4">
        <!-- 歷史紀錄群組 (Superpowers) -->
        <div class="history-controls d-flex align-center pa-1 rounded-lg">
          <v-btn icon variant="text" size="small" :disabled="!canUndo" @click="handleUndo" class="history-btn">
            <v-icon size="20">mdi-undo</v-icon>
            <v-tooltip activator="parent" location="bottom">復原</v-tooltip>
          </v-btn>
          <div class="history-divider mx-1"></div>
          <v-btn icon variant="text" size="small" :disabled="!canRedo" @click="handleRedo" class="history-btn">
            <v-icon size="20">mdi-redo</v-icon>
            <v-tooltip activator="parent" location="bottom">重做</v-tooltip>
          </v-btn>
        </div>

        <v-btn
          color="primary"
          variant="flat"
          rounded="pill"
          class="save-trigger px-4 px-sm-8"
          :height="$vuetify.display.smAndDown ? 36 : 44"
          :elevation="isDirty ? 8 : 0"
          :disabled="!isDirty || isSaving"
          @click="handleSave"
        >
          <v-icon :start="!$vuetify.display.xs" size="18">{{ isSaving ? 'mdi-loading mdi-spin' : 'mdi-cloud-upload-outline' }}</v-icon>
          <span class="font-weight-black text-caption text-sm-body-2 d-none d-xs-inline">{{ isSaving ? '同步中' : '發布變更' }}</span>
          <v-badge v-if="isDirty && !isSaving" dot color="amber-accent-4" offset-x="-6" offset-y="-6" class="pulse-badge"></v-badge>
        </v-btn>
      </div>
    </div>

    <!-- 2. Mobile Quick Nav (Visible only on md and down) -->
    <div class="d-lg-none studio-mobile-nav px-4 py-3 bg-white border-b overflow-x-auto">
      <div class="d-flex gap-2">
        <v-btn
          v-for="item in allItems"
          :key="item.id"
          variant="tonal"
          size="small"
          rounded="lg"
          :color="activeTab === item.id ? 'primary' : 'grey-darken-1'"
          class="flex-shrink-0 font-weight-bold px-4"
          @click="activeTab = item.id"
        >
          <v-icon start size="16">{{ item.icon }}</v-icon>
          {{ item.label }}
        </v-btn>
      </div>
    </div>

    <!-- 3. Main Work Area -->
    <div class="studio-container pa-4 pa-lg-8">
      <v-row>
        <!-- Sidebar (Desktop lg+) -->
        <v-col cols="12" lg="3" xl="2" class="d-none d-lg-block">
          <div class="studio-sidebar-card glass-card rounded-2xl pa-4 sticky-sidebar">
            <div class="nav-group mb-6">
              <div class="nav-group-title">內容管理</div>
              <button
                v-for="item in contentItems"
                :key="item.id"
                class="nav-item"
                :class="{ active: activeTab === item.id }"
                @click="activeTab = item.id"
              >
                <div class="nav-item-indicator" v-if="activeTab === item.id"></div>
                <v-icon size="20" class="mr-3">{{ item.icon }}</v-icon>
                <span>{{ item.label }}</span>
              </button>
            </div>

            <div class="nav-group">
              <div class="nav-group-title">視覺風格</div>
              <button
                v-for="item in appearanceItems"
                :key="item.id"
                class="nav-item"
                :class="{ active: activeTab === item.id }"
                @click="activeTab = item.id"
              >
                <div class="nav-item-indicator" v-if="activeTab === item.id"></div>
                <v-icon size="20" class="mr-3">{{ item.icon }}</v-icon>
                <span>{{ item.label }}</span>
              </button>
            </div>
          </div>
        </v-col>

        <!-- Editor & Preview -->
        <v-col cols="12" lg="9" xl="10">
          <v-row>
            <!-- Editor Pane -->
            <v-col cols="12" lg="7" xl="8">
              <div class="studio-editor-card glass-card rounded-2xl pa-4 pa-md-6 pa-lg-8">
                <transition name="fade-slide" mode="out-in">
                  <component :is="activeComponent" :key="activeTab" />
                </transition>
              </div>
            </v-col>

            <!-- Preview Pane (Desktop lg+) -->
            <v-col cols="12" lg="5" xl="4" class="d-none d-lg-block">
              <div class="preview-sticky">
                <div class="preview-card-wrap">
                   <StudioPreview />
                </div>
                
                <div class="preview-actions mt-8 px-4">
                  <v-btn
                    block
                    color="primary"
                    rounded="xl"
                    elevation="8"
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
    </div>

    <!-- 4. Mobile Preview FAB (Visible on md and down) -->
    <v-btn
      v-if="$vuetify.display.mdAndDown"
      color="primary"
      elevation="8"
      icon
      size="x-large"
      class="mobile-preview-fab"
      @click="mobilePreviewDialog = true"
    >
      <v-icon size="28">mdi-eye</v-icon>
    </v-btn>

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
  { id: 'content-profile', label: '個人簡介', icon: 'mdi-account-outline', component: ContentProfile },
  { id: 'content-links', label: '連結', icon: 'mdi-link-variant', component: ContentLinks },
]

const appearanceItems = [
  { id: 'appearance-background', label: '背景', icon: 'mdi-image-outline', component: AppearanceBackground },
  { id: 'appearance-profile', label: '簡介樣式', icon: 'mdi-format-paint', component: AppearanceProfile },
  { id: 'appearance-links', label: '連結樣式', icon: 'mdi-format-list-bulleted-type', component: AppearanceLinks },
]

const activeTab = ref('content-profile')
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
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
.creator-studio {
  min-height: calc(100vh - 64px);
  background: #f1f5f9; /* Distinct light grey background to make cards pop */
}

.studio-container {
  max-width: 1600px;
  margin: 0 auto;
}

/* Base Card Style for Premium Look */
.glass-card {
  background: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

/* Global Sticky Header */
.sticky-top {
  position: sticky;
  top: 0;
}
.z-index-20 {
  z-index: 20;
}
.glass-header {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.gradient-text {
  background: linear-gradient(135deg, #1867C0 0%, #5CBBF6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* History Controls (Superpowers) */
.history-controls {
  background: #f8fafc;
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

/* Save Trigger */
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

/* Mobile Quick Nav */
.studio-mobile-nav {
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

/* Sidebar CSS */
.sticky-sidebar {
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 140px);
  overflow-y: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

.nav-group {
  margin-bottom: 24px;
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
  padding: 12px 16px;
  margin-bottom: 6px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  color: #64748b;
  background: transparent;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: none;
  text-align: left;
  position: relative;
}

.nav-item:hover {
  background: #f8fafc;
  color: #0f172a;
  transform: translateX(4px);
}

.nav-item.active {
  background: #eff6ff;
  color: #1867c0;
}

.nav-item-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: #1867c0;
  border-radius: 0 4px 4px 0;
}

/* Editor CSS */
.studio-editor-card {
  min-height: calc(100vh - 140px);
}

/* Preview CSS */
.studio-preview-pane {
  display: flex;
  flex-direction: column;
}

.preview-sticky {
  position: sticky;
  top: 100px;
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
  width: 64px !important;
  height: 64px !important;
  border-radius: 50% !important;
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
