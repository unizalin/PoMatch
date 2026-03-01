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
              prepend-icon="mdi-view-grid-outline" title="編輯名片"></v-list-item>
          </template>
          <v-list-item to="/admin" title="進入工作室" class="sub-item"
            prepend-icon="mdi-creation" rounded="lg"></v-list-item>
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
          <v-list-item to="/admin/traffic" title="訪客流量" class="sub-item"
            prepend-icon="mdi-account-eye-outline" rounded="lg"></v-list-item>
          <v-list-item to="/admin/orders" title="來單趨勢" class="sub-item"
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
        <div class="content-body" :class="{ 'pa-0': route.path === '/admin' }">
          <slot />
        </div>

        <!-- Right Phone Preview Panel (Hide on Studio page as it has its own) -->
        <div class="preview-panel" v-if="$vuetify.display.lgAndUp && !['/admin', '/admin/profile', '/admin/links'].includes(route.path) && !route.path.startsWith('/admin/appearance')">
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
                <!-- Phone top notch -->
                <div class="phone-notch"></div>
                
                <div class="phone-inner">
                  <!-- Background gradient layer -->
                  <div class="phone-bg-gradient"></div>
                  
                  <!-- Profile card -->
                  <div class="phone-card">
                    <!-- Online indicator -->
                    <div class="d-flex justify-end mb-1">
                      <div class="phone-online-badge">● 在線上</div>
                    </div>
                    
                    <!-- Avatar -->
                    <div class="d-flex justify-center mb-2">
                      <div class="phone-avatar-wrap">
                        <img
                          :src="previewProfile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`"
                          class="phone-avatar-img"
                        />
                      </div>
                    </div>

                    <!-- Name -->
                    <div class="phone-name">{{ previewProfile.name || '@' + userEmail }}</div>
                    <div class="phone-desc">{{ previewProfile.description || '點擊個人簡介來編輯描述' }}</div>

                    <!-- Persona chips -->
                    <div class="d-flex justify-center flex-wrap" style="gap:4px;margin-bottom:10px">
                      <span v-if="previewProfile.persona?.mbti && previewProfile.persona.mbti !== 'UNKNOWN'" class="phone-chip chip-blue">
                        {{ previewProfile.persona.mbti }}
                      </span>
                      <span v-if="previewProfile.persona?.zodiac && previewProfile.persona.zodiac !== 'UNKNOWN'" class="phone-chip chip-purple">
                        {{ previewProfile.persona.zodiac }}
                      </span>
                      <span v-for="tag in (previewProfile.persona?.tags || []).slice(0, 2)" :key="tag" class="phone-chip chip-grey">
                        {{ tag }}
                      </span>
                    </div>

                    <!-- Links -->
                    <div v-if="previewLinks.length">
                      <div v-for="link in previewLinks" :key="link.id" class="phone-link-item">
                        <v-icon size="12" style="opacity:0.7;flex-shrink:0">{{ link.icon || 'mdi-link-variant' }}</v-icon>
                        <span class="phone-link-title">{{ link.title }}</span>
                        <v-icon size="10" style="opacity:0.4;flex-shrink:0">mdi-chevron-right</v-icon>
                      </div>
                    </div>
                    <div v-else class="phone-empty">
                      <v-icon size="36" style="color:rgba(255,255,255,0.2)" class="mb-1">mdi-link-plus</v-icon>
                      <div style="font-size:9px;color:rgba(255,255,255,0.35)">從左側新增你的第一個連結</div>
                    </div>
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

const route = useRoute()
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
  height: 420px;
  background: #0f0f1a;
  border-radius: 40px;
  border: 6px solid #1a1a2e;
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.08),
    inset 0 0 0 1px rgba(255,255,255,0.04),
    0 24px 64px -12px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  position: relative;
}

.phone-notch {
  width: 60px;
  height: 14px;
  background: #0f0f1a;
  border-radius: 0 0 12px 12px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.phone-screen {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 34px;
}

.phone-inner {
  height: 100%;
  position: relative;
  overflow-y: auto;
}

.phone-bg-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at top, rgba(99, 102, 241, 0.3) 0%, transparent 60%),
    linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
}

.phone-card {
  position: relative;
  z-index: 1;
  padding: 8px 12px 16px;
  text-align: center;
}

.phone-online-badge {
  display: inline-flex;
  align-items: center;
  font-size: 7px;
  font-weight: 700;
  color: #4ade80;
  background: rgba(74, 222, 128, 0.12);
  border-radius: 20px;
  padding: 2px 6px;
  letter-spacing: 0.03em;
}

.phone-avatar-wrap {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.06), 0 8px 24px rgba(0,0,0,0.4);
  overflow: hidden;
  background: rgba(255,255,255,0.1);
}

.phone-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.phone-name {
  font-size: 13px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
  margin-bottom: 3px;
}

.phone-desc {
  font-size: 8.5px;
  color: rgba(255,255,255,0.45);
  margin-bottom: 8px;
  line-height: 1.4;
  padding: 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.phone-chip {
  display: inline-block;
  font-size: 7.5px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 20px;
  letter-spacing: 0.02em;
}

.chip-blue {
  background: rgba(99, 102, 241, 0.25);
  color: #a5b4fc;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.chip-purple {
  background: rgba(168, 85, 247, 0.2);
  color: #d8b4fe;
  border: 1px solid rgba(168, 85, 247, 0.25);
}

.chip-grey {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255,255,255,0.6);
  border: 1px solid rgba(255,255,255,0.1);
}

.phone-link-item {
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 7px 10px;
  margin-bottom: 6px;
  color: white;
  backdrop-filter: blur(8px);
}

.phone-link-title {
  flex: 1;
  font-size: 10px;
  font-weight: 600;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.phone-empty {
  padding-top: 20px;
  text-align: center;
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
