<template>
  <v-dialog v-model="visible" max-width="440">
    <v-card class="style-dialog-card pa-6" rounded="xl">
      <div class="d-flex align-center justify-space-between mb-6">
        <h3 class="text-h6 font-weight-black">編輯連結</h3>
        <v-btn icon="mdi-close" variant="text" size="small" @click="visible = false"></v-btn>
      </div>

      <!-- Preview Section -->
      <div class="style-section mb-6">
        <label class="style-label mb-3">預覽效果</label>
        <div class="preview-mini-link" :style="previewStyle">
          <v-icon color="white" size="20">{{ localLink.icon || 'mdi-link-variant' }}</v-icon>
          <span class="ml-3 font-weight-black text-white text-truncate">{{ localLink.title }}</span>
        </div>
      </div>

      <!-- Content Editing -->
      <div class="style-section mb-4">
        <label class="style-label mb-2">連結名稱</label>
        <input v-model="localLink.title" class="field-input" placeholder="例如: 我的 Instagram" />
      </div>

      <div class="style-section mb-6">
        <label class="style-label mb-2">連結網址</label>
        <input v-model="localLink.url" class="field-input" placeholder="https://..." />
      </div>

      <!-- Style Customization -->
      <div class="style-section mb-6">
        <label class="style-label mb-3">主題顏色</label>
        <div class="color-grid">
          <div 
            v-for="c in presetColors" 
            :key="c" 
            class="color-circle" 
            :style="{ background: c }"
            :class="{ active: metadata.color === c }"
            @click="metadata.color = c"
          ></div>
        </div>
      </div>

      <div class="style-section mb-6">
        <label class="style-label mb-3">強調效果</label>
        <v-select
          v-model="metadata.animation"
          hide-details
          flat
          density="comfortable"
          variant="solo-filled"
          rounded="lg"
          :items="[
            { title: '無', value: '' },
            { title: '呼吸燈 (Glow)', value: 'glow' },
            { title: '脈衝 (Pulse)', value: 'pulse' },
            { title: '彈跳 (Bounce)', value: 'bounce' }
          ]"
        ></v-select>
      </div>

      <!-- Bento Grid Settings -->
      <div v-if="store.profile.themeConfig?.linkLayout === 'grid'" class="style-section mb-8">
        <label class="style-label mb-3">網格排列寬度</label>
        <v-btn-toggle
          v-model="metadata.gridSpan"
          mandatory
          color="primary"
          variant="tonal"
          rounded="lg"
          class="w-100"
          style="height: 48px;"
        >
          <v-btn value="full" class="flex-grow-1 font-weight-bold">
            <v-icon start>mdi-view-headline</v-icon>
            滿版 (Full)
          </v-btn>
          <v-btn value="half" class="flex-grow-1 font-weight-bold">
            <v-icon start>mdi-view-grid-outline</v-icon>
            半版 (Half)
          </v-btn>
        </v-btn-toggle>
      </div>

      <v-btn
        color="primary"
        block
        rounded="xl"
        size="large"
        class="font-weight-black"
        :loading="loading"
        @click="handleSave"
      >
        儲存變更
      </v-btn>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'

const props = defineProps<{
  modelValue: boolean
  link: any
}>()

const emit = defineEmits(['update:modelValue', 'saved'])

const store = useProfileStore()
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const loading = ref(false)
const localLink = ref({ title: '', url: '', icon: '' })
const metadata = ref({
  color: '',
  animation: '',
  gridSpan: 'full'
})

const presetColors = [
  '#6366f1', '#1877F2', '#E1306C', '#FF0000', '#F59E0B', '#10B981', '#333333', '#000000'
]

watch(() => props.link, (val) => {
  if (val) {
    localLink.value = { ...val }
    metadata.value = {
      color: val.metadata?.color || '',
      animation: val.metadata?.animation || '',
      gridSpan: val.metadata?.gridSpan || 'full'
    }
  }
}, { immediate: true, deep: true })

const previewStyle = computed(() => ({
  background: metadata.value.color || 'linear-gradient(135deg, #6366f1, #a855f7)',
  borderRadius: '16px',
  padding: '14px 20px',
  display: 'flex',
  alignItems: 'center',
  minHeight: '52px',
  boxShadow: metadata.value.animation === 'glow' ? `0 0 20px ${metadata.value.color || '#6366f1'}` : 'none'
}))

const handleSave = async () => {
  loading.value = true
  // 1. Update basic info (title, url) via RPC or general method
  const client = useSupabaseClient()
  await client.from('links').update({ 
    title: localLink.value.title, 
    url: localLink.value.url,
    metadata: metadata.value 
  }).eq('id', props.link.id)
  
  // 2. Update local store
  const storeLink = store.profile.actionLinks.find(l => l.id === props.link.id)
  if (storeLink) {
    storeLink.title = localLink.value.title
    storeLink.url = localLink.value.url
    storeLink.metadata = metadata.value
  }

  loading.value = false
  visible.value = false
  emit('saved')
}
</script>

<style scoped>
.style-dialog-card {
  background: white;
}
.style-label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
}
.color-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.color-circle {
  aspect-ratio: 1;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.2s;
}
.color-circle.active {
  border-color: #cbd5e1;
  transform: scale(1.1);
}
.field-input {
  width: 100%; height: 44px; padding: 0 14px; border: 1.5px solid #e2e8f0; border-radius: 12px;
  font-size: 14px; color: #0f172a; background: white; outline: none; transition: all 0.15s;
}
.field-input:focus { border-color: #1867c0; box-shadow: 0 0 0 3px rgba(24,103,192,0.1); }
</style>
