<template>
  <div class="creator-studio">
    <v-row no-gutters class="studio-container">
      <!-- 1. Studio Internal Sidebar (Navigation) -->
      <v-col cols="12" md="3" lg="2" class="studio-sidebar px-2 py-4">
        <div class="studio-header d-flex align-center justify-space-between mb-6 px-1">
          <div>
            <h2 class="text-h4 font-weight-black mb-1">創作者工作室</h2>
            <div class="d-flex align-center gap-2">
              <p class="text-subtitle-2 text-grey mb-0">管理您的數位名片內容與視覺風格</p>
              <v-fade-transition>
                <div v-if="isSaving" class="d-flex align-center gap-1 ml-4">
                  <v-progress-circular indeterminate size="12" width="2" color="primary"></v-progress-circular>
                  <span class="text-caption font-weight-bold text-primary">儲存中...</span>
                </div>
                <div v-else-if="lastSaved" class="d-flex align-center gap-1 ml-4 opacity-50">
                  <v-icon size="12" color="success">mdi-check-circle</v-icon>
                  <span class="text-caption font-weight-medium">已自動儲存</span>
                </div>
              </v-fade-transition>
            </div>
          </div>
        </div>
        <div class="nav-group mb-6">
          <div class="nav-group-title">我的內容</div>
          <button
            v-for="item in contentItems"
            :key="item.id"
            class="nav-item"
            :class="{ active: activeTab === item.id }"
            @click="activeTab = item.id"
          >
            <v-icon size="18" class="mr-3">{{ item.icon }}</v-icon>
            {{ item.label }}
          </button>
        </div>

        <div class="nav-group">
          <div class="nav-group-title">外觀風格</div>
          <button
            v-for="item in appearanceItems"
            :key="item.id"
            class="nav-item"
            :class="{ active: activeTab === item.id }"
            @click="activeTab = item.id"
          >
            <v-icon size="18" class="mr-3">{{ item.icon }}</v-icon>
            {{ item.label }}
          </button>
        </div>
      </v-col>

      <!-- 2. Main Editor Area -->
      <v-col cols="12" md="9" lg="6" class="studio-editor pa-6">
        <transition name="fade-slide" mode="out-in">
          <component :is="activeComponent" :key="activeTab" />
        </transition>
      </v-col>

      <!-- 3. Live Preview Area (Mockup) -->
      <v-col cols="12" lg="4" class="studio-preview py-6 pr-6 d-none d-lg-block">
        <div class="preview-sticky">
          <div class="preview-card-wrap">
             <StudioPreview />
          </div>
          
          <div class="preview-actions mt-6">
            <v-btn
              block
              color="primary"
              rounded="xl"
              class="publish-btn font-weight-black"
              prepend-icon="mdi-rocket-launch"
              size="large"
              :href="`/${userEmail || ''}`"
              target="_blank"
            >
              發布我的名片
            </v-btn>
            <p class="text-center text-caption text-grey mt-3">
              所有變更皆會即時預覽，發布後即可生效
            </p>
          </div>
        </div>
      </v-col>
    </v-row>
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

const activeTab = ref('content-links')
const isSaving = ref(false)
const lastSaved = ref(false)
let saveTimeout: any = null

const contentItems = [
  { id: 'content-links', label: '連結', icon: 'mdi-link-variant', component: ContentLinks },
  { id: 'content-profile', label: '個人簡介', icon: 'mdi-account-outline', component: ContentProfile },
]

const appearanceItems = [
  { id: 'appearance-background', label: '背景', icon: 'mdi-image-outline', component: AppearanceBackground },
  { id: 'appearance-profile', label: '簡介樣式', icon: 'mdi-format-paint', component: AppearanceProfile },
  { id: 'appearance-links', label: '連結樣式', icon: 'mdi-format-list-bulleted-type', component: AppearanceLinks },
]

const allItems = [...contentItems, ...appearanceItems]
const activeComponent = computed(() => {
  return allItems.find(i => i.id === activeTab.value)?.component || ContentLinks
})

// TC-S01: Auto-save watcher for profile & appearance
watch(() => store.profile, (newVal) => {
  if (isSaving.value) return // Prevent recursive saving
  
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(async () => {
    isSaving.value = true
    try {
      await store.updateProfile({
        name: newVal.name,
        description: newVal.description,
        avatar: newVal.avatar,
        theme: newVal.theme,
        themeConfig: newVal.themeConfig,
        persona: newVal.persona
      })
      lastSaved.value = true
      setTimeout(() => { lastSaved.value = false }, 3000)
    } finally {
      isSaving.value = false
    }
  }, 1500)
}, { deep: true })

onMounted(async () => {
  const username = user.value?.email?.split('@')[0]
  if (username) {
    await store.fetchProfile(username)
  }
})
</script>

<style scoped>
.creator-studio {
  min-height: calc(100vh - 64px);
  background: #f8fafc;
}

.studio-container {
  min-height: inherit;
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
</style>
