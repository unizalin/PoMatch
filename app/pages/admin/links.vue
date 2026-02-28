<template>
  <NuxtLayout name="admin">
    <div class="d-flex align-center justify-space-between mb-8">
      <div>
        <h2 class="text-h4 font-weight-black mb-1">連結管理</h2>
        <p class="text-body-2 text-grey">管理您的社群連結與自定義按鈕</p>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        rounded="xl"
        size="large"
        class="font-weight-bold"
        @click="openDialog"
      >
        新增連結
      </v-btn>
    </div>

    <v-row>
      <!-- Main Content -->
      <v-col cols="12" md="8">
        <!-- Empty State -->
        <div v-if="links.length === 0" class="mt-4">
          <v-card class="bento-card glass-card pa-12 text-center d-flex flex-column align-center" rounded="xl">
            <v-icon size="80" color="primary-lighten-4" class="mb-6">mdi-link-plus</v-icon>
            <div class="text-h5 font-weight-black mb-2">打造您的個人首頁</div>
            <div class="text-body-2 text-grey mb-8" style="max-width: 300px">
              目前還沒有任何連結。點擊右上角的按鈕來新增您的網站、社群帳號或自定義動作。
            </div>
            <v-btn color="primary" variant="tonal" rounded="lg" @click="openDialog">立即開始</v-btn>
          </v-card>
        </div>

        <!-- Links List -->
        <div v-else class="link-stack">
          <h3 class="text-subtitle-1 font-weight-black mb-4 px-2 d-flex align-center">
            <v-icon size="20" class="mr-2">mdi-sort-variant</v-icon>
            所有連結 ({{ links.length }})
          </h3>
          
          <v-card
            v-for="(link, index) in links"
            :key="link.id"
            class="link-bento-item mb-4 pa-4 d-flex align-center gap-4"
            rounded="xl"
            flat
            border
          >
            <div class="d-flex flex-column gap-1 mr-2">
              <v-btn icon="mdi-chevron-up" variant="text" size="x-small" :disabled="index === 0" @click="moveLink(index, -1)"></v-btn>
              <v-btn icon="mdi-chevron-down" variant="text" size="x-small" :disabled="index === links.length - 1" @click="moveLink(index, 1)"></v-btn>
            </div>

            <v-avatar :color="getIconColor(link.icon)" variant="tonal" size="48" rounded="lg">
              <v-icon size="24">{{ link.icon || 'mdi-link-variant' }}</v-icon>
            </v-avatar>

            <div class="flex-grow-1 overflow-hidden">
              <div class="text-subtitle-1 font-weight-black text-truncate">{{ link.title }}</div>
              <div class="text-caption text-grey text-truncate d-flex align-center">
                <v-icon size="12" class="mr-1">mdi-link-variant</v-icon>
                {{ link.url }}
              </div>
            </div>

            <div class="stats-box text-right px-4 border-l border-r">
                <div class="text-h6 font-weight-black">{{ link.clicks || 0 }}</div>
                <div class="text-caption text-grey">點擊</div>
            </div>

            <div class="d-flex gap-1">
                <v-btn icon="mdi-pencil-outline" variant="text" color="grey-darken-1" size="small"></v-btn>
                <v-btn icon="mdi-delete-outline" variant="text" color="error" size="small" @click="confirmDelete(link)"></v-btn>
            </div>
          </v-card>
        </div>
      </v-col>

      <!-- Preview Sidebar -->
      <v-col cols="12" md="4">
        <v-card class="bento-card glass-card pa-6 sticky-top" rounded="xl">
          <div class="d-flex align-center justify-space-between mb-6">
            <span class="text-subtitle-2 font-weight-black uppercase">即時預覽</span>
            <v-chip size="x-small" color="success" class="font-weight-black">LIVE</v-chip>
          </div>
          
          <div class="mobile-preview-container mx-auto">
            <div class="mobile-preview-screen pa-6 text-center">
              <v-avatar size="64" class="mb-4 border elevation-4">
                <v-img src="https://api.dicebear.com/7.x/avataaars/svg?seed=User"></v-img>
              </v-avatar>
              <div class="text-subtitle-1 font-weight-black mb-1 text-white">Your Name</div>
              <div class="text-caption text-white-50 mb-6">Bio preview here...</div>

              <div class="preview-links-stack">
                <div
                  v-for="link in links"
                  :key="'preview-'+link.id"
                  class="preview-link-btn py-2 px-4 mb-3 rounded-pill text-white text-caption d-flex align-center"
                >
                  <v-icon size="14" class="mr-3">{{ link.icon || 'mdi-link-variant' }}</v-icon>
                  <span class="text-truncate flex-grow-1">{{ link.title }}</span>
                </div>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Simple Progress Overlay -->
    <v-overlay v-model="loading" class="align-center justify-center" persistent>
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </v-overlay>

    <!-- Add Link Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card class="pa-6 border-0" rounded="xl">
        <h3 class="text-h6 font-weight-black mb-6">新增連結</h3>
        <v-text-field
            v-model="newLink.title"
            label="連結標題"
            variant="outlined"
            placeholder="例如: 我的 Instagram"
            rounded="lg"
            class="mb-2"
        ></v-text-field>
        <v-text-field
            v-model="newLink.url"
            label="連結網址"
            variant="outlined"
            placeholder="https://..."
            rounded="lg"
            class="mb-2"
        ></v-text-field>
        <v-select
            v-model="newLink.icon"
            :items="iconOptions"
            label="圖示類型"
            variant="outlined"
            rounded="lg"
            prepend-inner-icon="mdi-emoticon-outline"
        ></v-select>
        
        <v-card-actions class="px-0 pt-6">
            <v-spacer></v-spacer>
            <v-btn variant="text" rounded="lg" @click="dialog = false">取消</v-btn>
            <v-btn color="primary" variant="flat" rounded="lg" class="px-8 font-weight-bold" :loading="isAdding" @click="handleAdd">儲存連結</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" rounded="pill" class="mb-4">
      {{ snackbarText }}
    </v-snackbar>
  </NuxtLayout>
</template>

<script setup>
import { useProfileStore } from '~/stores/profile'

const store = useProfileStore()
const links = computed(() => store.profile.actionLinks)
const loading = ref(false)

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

const confirmDelete = async (link) => {
    if (confirm(`確定要刪除「${link.title}」嗎？`)) {
        await store.deleteLink(link.id)
        showMsg('連結已移除', 'info')
    }
}

const moveLink = async (index, delta) => {
    const newIndex = index + delta
    if (newIndex < 0 || newIndex >= links.value.length) return
    
    // Sort logic here (Local move first for visual)
    const items = [...links.value]
    const item = items.splice(index, 1)[0]
    items.splice(newIndex, 0, item)
    
    // TC-L03: Update local state and persist sort_order to DB
    store.profile.actionLinks = items
    await store.updateLinkSortOrder()
    showMsg('順序已調整並已同步', 'success')
}

const showMsg = (text, color) => {
    snackbarText.value = text
    snackbarColor.value = color
    snackbar.value = true
}

const getIconColor = (icon) => {
    const map = {
        'mdi-instagram': 'pink',
        'mdi-facebook': 'blue',
        'mdi-youtube': 'red',
        'mdi-twitter': 'black',
        'mdi-github': 'grey-darken-3',
        'mdi-at': 'black',
        'mdi-message-text': 'success',
        'mdi-music-note': 'black'
    }
    return map[icon] || 'primary'
}
</script>

<style scoped>
.link-stack {
  display: flex;
  flex-direction: column;
}

.link-bento-item {
  background-color: white;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid #f1f5f9;
}

.link-bento-item:hover {
  transform: translateX(4px);
  border-color: #cbd5e1;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.sticky-top {
  position: sticky;
  top: 24px;
}

.mobile-preview-container {
  width: 250px;
  height: 500px;
  background-color: #1e293b;
  border-radius: 40px;
  border: 8px solid #000;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.mobile-preview-screen {
  height: 100%;
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  overflow-y: auto;
}

.preview-link-btn {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
}

.text-white-50 {
  color: rgba(255, 255, 255, 0.5);
}

.gap-1 { gap: 4px; }
.gap-4 { gap: 16px; }

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
}

.uppercase {
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.stats-box {
    min-width: 80px;
}
</style>
