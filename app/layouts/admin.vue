<template>
  <v-app class="admin-app">
    <!-- Mobile Header Bar -->
    <v-app-bar v-if="$vuetify.display.smAndDown" flat height="56"
      class="border-b px-2" color="white" elevation="0">
      <v-app-bar-nav-icon @click="drawerOpen = !drawerOpen"></v-app-bar-nav-icon>
      <div class="logo-text">PoMatch</div>
    </v-app-bar>

    <!-- Left Sidebar -->
    <v-navigation-drawer
      v-model="drawerOpen"
      :permanent="$vuetify.display.mdAndUp"
      width="220"
      class="admin-sidebar"
      elevation="0"
    >
      <!-- Logo -->
      <div class="pa-5 d-flex align-center" style="gap:10px">
        <v-icon color="primary" size="24">mdi-rhombus-split</v-icon>
        <span class="logo-text">PoMatch</span>
      </div>

      <!-- Upgrade Button -->
      <div class="px-4 mb-4">
        <v-btn block class="upgrade-btn font-weight-black" rounded="lg"
          prepend-icon="mdi-flash" elevation="0">
          升級 Plus
        </v-btn>
      </div>

      <v-list density="compact" nav class="px-3">
        <!-- 我的內容 -->
        <v-list-group v-model="groups.content">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" class="group-header"
              prepend-icon="mdi-view-grid-outline" title="我的內容"></v-list-item>
          </template>
          <v-list-item to="/admin/links" title="連結" class="sub-item"
            prepend-icon="mdi-link-variant" rounded="lg"></v-list-item>
          <v-list-item to="/admin/profile" title="個人簡介" class="sub-item"
            prepend-icon="mdi-account-outline" rounded="lg"></v-list-item>
        </v-list-group>

        <!-- 外觀風格 -->
        <v-list-group v-model="groups.appearance">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" class="group-header"
              prepend-icon="mdi-palette-outline" title="外觀風格"></v-list-item>
          </template>
          <v-list-item to="/admin/profile" title="模版" class="sub-item"
            prepend-icon="mdi-view-dashboard-variant-outline" rounded="lg"></v-list-item>
          <v-list-item class="sub-item" title="背景"
            prepend-icon="mdi-image-outline" rounded="lg"></v-list-item>
          <v-list-item class="sub-item" title="簡介樣式"
            prepend-icon="mdi-format-paint" rounded="lg"></v-list-item>
          <v-list-item class="sub-item" title="連結樣式"
            prepend-icon="mdi-format-list-bulleted-type" rounded="lg"></v-list-item>
        </v-list-group>

        <!-- 數據分析 -->
        <v-list-group v-model="groups.analytics">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" class="group-header"
              prepend-icon="mdi-chart-line" title="數據分析"></v-list-item>
          </template>
          <v-list-item to="/admin/analytics" title="成效總覽" class="sub-item"
            prepend-icon="mdi-chart-bar" rounded="lg"></v-list-item>
          <v-list-item to="/admin/match-analytics" title="配對分析" class="sub-item"
            prepend-icon="mdi-heart-multiple-outline" rounded="lg"></v-list-item>
          <v-list-item class="sub-item" title="訪客流量"
            prepend-icon="mdi-account-eye-outline" rounded="lg"></v-list-item>
          <v-list-item class="sub-item" title="來單巨量"
            prepend-icon="mdi-trending-up" rounded="lg"></v-list-item>
        </v-list-group>
      </v-list>

      <template v-slot:append>
        <div class="pa-4">
          <div class="user-chip pa-3 mb-3 rounded-xl d-flex align-center" style="gap:10px;background:#f8fafc;border:1px solid #f1f5f9">
            <v-avatar size="32" color="primary" style="flex-shrink:0">
              <span class="text-caption font-weight-black text-white">{{ userInitial }}</span>
            </v-avatar>
            <div class="text-subtitle-2 font-weight-bold text-truncate" style="overflow:hidden">{{ userEmail }}</div>
          </div>
          <v-btn block variant="text" color="error" prepend-icon="mdi-logout"
            rounded="lg" class="text-caption" @click="handleLogout">
            登出
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Center + Right Panel -->
    <v-main class="admin-main">
      <div class="admin-layout-row">
        <!-- Center Content Area -->
        <div class="content-body">
          <slot />
        </div>

        <!-- Right Phone Preview Panel (desktop only) -->
        <div class="preview-panel" v-if="$vuetify.display.lgAndUp">
          <div class="preview-header">
            <span class="text-caption text-grey font-weight-bold preview-label">預覽</span>
            <div class="d-flex align-center" style="gap:8px">
              <a :href="profileUrl" target="_blank" class="preview-url text-caption text-primary font-weight-bold">
                po-match.vercel.app/{{ userEmail }}
              </a>
              <v-chip size="x-small" color="success" class="font-weight-black" variant="flat">發布</v-chip>
            </div>
          </div>

          <div class="d-flex justify-center pt-8 px-4">
            <div class="phone-frame">
              <div class="phone-screen">
                <div class="phone-inner text-center pa-4">
                  <v-avatar size="72" class="mb-3 elevation-4" style="border:3px solid rgba(255,255,255,0.2)">
                    <v-img :src="previewProfile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`"></v-img>
                  </v-avatar>
                  <div class="text-body-2 font-weight-black text-white mb-1">{{ previewProfile.name || userEmail }}</div>
                  <div class="text-caption mb-4" style="color:rgba(255,255,255,0.5)">{{ previewProfile.description || '點擊個人簡介來編輯' }}</div>

                  <div v-if="previewLinks.length">
                    <div v-for="link in previewLinks" :key="link.id"
                      class="phone-link-pill mb-2 py-2 px-3 d-flex align-center rounded-pill">
                      <v-icon size="12" class="mr-2">{{ link.icon || 'mdi-link-variant' }}</v-icon>
                      <span class="text-truncate" style="flex:1;font-size:11px;font-weight:600">{{ link.title }}</span>
                    </div>
                  </div>
                  <div v-else class="pt-6">
                    <v-icon size="48" color="grey" class="mb-2">mdi-link-plus</v-icon>
                    <div class="text-caption" style="color:rgba(255,255,255,0.4)">從上方新增你的第一個連結</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="preview-footer">
            <v-btn variant="tonal" color="primary" prepend-icon="mdi-open-in-new"
              rounded="lg" size="small" class="font-weight-bold"
              :href="profileUrl" target="_blank">
              免費建立個人頁面
            </v-btn>
          </div>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const drawerOpen = ref(true)
const client = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const groups = ref({ content: true, appearance: false, analytics: false })
const store = useProfileStore()

const userEmail = computed(() => user.value?.email?.split('@')[0] || 'user')
const userInitial = computed(() => userEmail.value.charAt(0).toUpperCase())
const profileUrl = computed(() => `https://po-match.vercel.app/${userEmail.value}`)
const previewProfile = computed(() => store.profile)
const previewLinks = computed(() => store.profile.actionLinks?.slice(0, 6) || [])

const handleLogout = async () => {
  await client.auth.signOut()
  router.push('/login')
}
</script>

<style scoped>
.admin-app {
  background-color: #f8fafc !important;
}

.admin-sidebar {
  background-color: #ffffff !important;
  border-right: 1px solid #e2e8f0 !important;
}

.logo-text {
  font-size: 17px;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: #0f172a;
}

.upgrade-btn {
  background: linear-gradient(135deg, #f97316, #fb923c) !important;
  color: white !important;
  font-size: 13px !important;
  height: 36px !important;
}

:deep(.group-header) {
  font-size: 13px !important;
  font-weight: 700 !important;
  color: #374151 !important;
  border-radius: 10px;
  margin-top: 2px;
}

:deep(.group-header:hover) {
  background-color: #f8fafc !important;
}

:deep(.sub-item) {
  font-size: 13px !important;
  color: #6b7280 !important;
  border-radius: 8px !important;
  min-height: 34px !important;
  margin-left: 8px !important;
}

:deep(.sub-item:hover) {
  background-color: #f1f5f9 !important;
  color: #1867C0 !important;
}

:deep(.v-list-item--active.sub-item) {
  background-color: #eff6ff !important;
  color: #1867C0 !important;
  font-weight: 700 !important;
}

.admin-main {
  background-color: #f8fafc;
}

/* 3-column layout row */
.admin-layout-row {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
}

.content-body {
  flex: 1;
  min-width: 0;
  padding: 32px 28px;
  overflow-y: auto;
}

/* Right Preview Panel */
.preview-panel {
  width: 300px;
  flex-shrink: 0;
  background: white;
  border-left: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 2;
}

.preview-label {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 11px;
}

.preview-url {
  font-size: 11px;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 130px;
}

/* Phone frame */
.phone-frame {
  width: 200px;
  height: 400px;
  background: #111827;
  border-radius: 36px;
  border: 7px solid #111827;
  box-shadow:
    0 0 0 1px #d1d5db,
    0 20px 50px -10px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.phone-screen {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  border-radius: 30px;
  overflow-y: auto;
}

.phone-inner {
  min-height: 100%;
}

.phone-link-pill {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  backdrop-filter: blur(4px);
  text-align: left;
}

.preview-footer {
  padding: 16px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: center;
  position: sticky;
  bottom: 0;
  background: white;
}
</style>
