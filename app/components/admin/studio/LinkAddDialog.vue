<template>
  <v-dialog v-model="visible" max-width="460" transition="dialog-bottom-transition">
    <v-card class="glass-card premium-blur pa-6 border-xl" elevation="0">
      <div class="d-flex align-center justify-space-between mb-6">
        <h3 class="text-h6 font-weight-black">新增功能區塊</h3>
        <v-btn icon="mdi-close" variant="text" size="small" @click="visible = false"></v-btn>
      </div>

      <div class="form-field mb-6">
        <label class="field-label">區塊類型</label>
        <div class="block-type-selector d-flex flex-wrap gap-2">
          <v-btn
            v-for="type in blockTypeOptions"
            :key="type.value"
            variant="tonal"
            size="small"
            rounded="lg"
            class="flex-grow-1 font-weight-bold"
            :color="newLink.metadata?.block_type === type.value ? 'primary' : 'grey-lighten-1'"
            :class="{ 'active-type': newLink.metadata?.block_type === type.value }"
            @click="setBlockType(type.value)"
          >
            <v-icon start size="16">{{ type.icon }}</v-icon>
            {{ type.label }}
          </v-btn>
        </div>
      </div>
      
      <div class="form-field mb-4">
        <label class="field-label">區塊標題</label>
        <div class="field-input-wrap">
          <v-icon size="16" class="field-icon">mdi-format-title</v-icon>
          <input
            v-model="newLink.title"
            class="field-input field-with-icon"
            :placeholder="getBlockPlaceholder()"
          />
        </div>
      </div>

      <div v-if="(newLink.metadata?.block_type || 'standard_link') === 'standard_link'" class="form-field mb-4">
        <label class="field-label">連結網址</label>
        <div class="field-input-wrap">
          <v-icon size="16" class="field-icon">mdi-link-variant</v-icon>
          <input
            v-model="newLink.url"
            class="field-input field-with-icon"
            placeholder="https://..."
            @input="detectFromUrl"
          />
        </div>
      </div>

      <div class="form-field mb-8">
        <label class="field-label">呈現圖示</label>
        <div class="field-input-wrap">
          <v-icon size="16" class="field-icon">mdi-shape-outline</v-icon>
          <select v-model="newLink.icon" class="field-input field-select field-with-icon">
            <option v-for="opt in iconOptions" :key="opt.value" :value="opt.value">{{ opt.title }}</option>
          </select>
        </div>
      </div>
      
      <div class="d-flex gap-3">
        <v-btn variant="text" rounded="xl" @click="visible = false" class="flex-grow-1 font-weight-bold">取消</v-btn>
        <v-btn 
          color="primary" 
          rounded="xl" 
          elevation="8"
          class="flex-grow-1 font-weight-black save-btn" 
          :loading="loading" 
          @click="handleAdd"
        >
          儲存連結
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue', 'added'])

const store = useProfileStore()
const loading = ref(false)

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const newLink = ref({ 
  title: '', 
  url: '', 
  icon: 'mdi-link-variant', 
  metadata: { block_type: 'standard_link' } 
})

const blockTypeOptions = [
  { label: '標準連結', value: 'standard_link', icon: 'mdi-link-variant' },
  { label: '產品網格', value: 'product_grid', icon: 'mdi-view-grid' },
  { label: '時段課表', value: 'schedule_list', icon: 'mdi-calendar-clock' },
  { label: '服務卡片', value: 'service_card', icon: 'mdi-briefcase-variant' }
]

const iconOptions = [
  { title: '一般連結', value: 'mdi-link-variant' },
  { title: 'Instagram', value: 'mdi-instagram' },
  { title: 'Facebook', value: 'mdi-facebook' },
  { title: 'YouTube', value: 'mdi-youtube' },
  { title: 'Threads', value: 'mdi-at' },
  { title: 'TikTok', value: 'mdi-music-note' },
  { title: 'X (Twitter)', value: 'mdi-twitter' },
  { title: 'Github', value: 'mdi-github' },
  { title: 'LINE', value: 'mdi-chat' },
  { title: 'LinkedIn', value: 'mdi-linkedin' },
  { title: 'Spotify', value: 'mdi-spotify' }
]

const urlPatterns = [
  { pattern: /instagram\.com/i, icon: 'mdi-instagram', title: 'Instagram' },
  { pattern: /facebook\.com|fb\.com/i, icon: 'mdi-facebook', title: 'Facebook' },
  { pattern: /youtube\.com|youtu\.be/i, icon: 'mdi-youtube', title: 'YouTube' },
  { pattern: /tiktok\.com/i, icon: 'mdi-music-note', title: 'TikTok' },
  { pattern: /twitter\.com|x\.com/i, icon: 'mdi-twitter', title: 'X (Twitter)' },
  { pattern: /github\.com/i, icon: 'mdi-github', title: 'GitHub' },
  { pattern: /threads\.net/i, icon: 'mdi-at', title: 'Threads' },
  { pattern: /line\.me/i, icon: 'mdi-chat', title: 'LINE' },
  { pattern: /linkedin\.com/i, icon: 'mdi-linkedin', title: 'LinkedIn' },
  { pattern: /spotify\.com/i, icon: 'mdi-spotify', title: 'Spotify' }
]

const setBlockType = (type: string) => {
  newLink.value.metadata.block_type = type
  if (type === 'product_grid') newLink.value.icon = 'mdi-view-grid'
  else if (type === 'schedule_list') newLink.value.icon = 'mdi-calendar-clock'
  else if (type === 'service_card') newLink.value.icon = 'mdi-briefcase-variant'
}

const getBlockPlaceholder = () => {
  const type = newLink.value.metadata.block_type
  if (type === 'product_grid') return '例如: 精選菜單、熱銷產品'
  if (type === 'schedule_list') return '例如: 本週課表、營業時間'
  if (type === 'service_card') return '例如: 服務項目項目'
  return '例如: 我的 Instagram'
}

const detectFromUrl = () => {
  const url = newLink.value.url
  if (!url) return
  const match = urlPatterns.find(p => p.pattern.test(url))
  if (match) {
    newLink.value.icon = match.icon
    if (!newLink.value.title) {
      newLink.value.title = match.title
    }
  }
}

const handleAdd = async () => {
  if (!newLink.value.title || !newLink.value.url) return
  loading.value = true
  const { error } = await store.addLink(newLink.value)
  loading.value = false
  if (!error) {
    visible.value = false
    emit('added')
    // Reset form
    newLink.value = { title: '', url: '', icon: 'mdi-link-variant', metadata: { block_type: 'standard_link' } }
  } else {
    console.error('Add link failed:', error)
  }
}
</script>

<style scoped>
.field-label { font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
.field-input {
  width: 100%; height: 48px; padding: 0 16px; border: 1.5px solid #e2e8f0; border-radius: 14px;
  font-size: 14px; color: #0f172a; background: white; outline: none; transition: all 0.2s;
}
.field-input:focus { border-color: #1867c0; box-shadow: 0 0 0 4px rgba(24,103,192,0.1); }
.field-select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Cpath fill='%2394a3b8' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }

.field-input-wrap { position: relative; }
.field-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); opacity: 0.4; pointer-events: none; }
.field-with-icon { padding-left: 40px !important; }

.active-type {
  border: 2px solid #1867c0 !important;
  background: rgba(24, 103, 192, 0.05) !important;
}

.save-btn {
  background: linear-gradient(135deg, #1867C0 0%, #1e40af 100%) !important;
}

.gap-3 { gap: 12px; }
</style>
