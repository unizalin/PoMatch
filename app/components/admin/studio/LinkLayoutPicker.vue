<template>
  <div class="layout-picker-container">
    <div class="picker-label mb-3">連結排列佈局</div>
    <div class="layout-grid">
      <div 
        v-for="opt in layouts" 
        :key="opt.id"
        class="layout-opt"
        :class="{ active: currentLayout === opt.id }"
        @click="selectLayout(opt.id)"
      >
        <div class="layout-icon-box">
          <v-icon size="24">{{ opt.icon }}</v-icon>
        </div>
        <div class="layout-info">
          <div class="layout-name">{{ opt.name }}</div>
          <div class="layout-desc">{{ opt.desc }}</div>
        </div>
        <v-icon v-if="currentLayout === opt.id" color="primary" class="check-icon">mdi-check-circle</v-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

const layouts = [
  { id: 'list', name: '清單', desc: '經典單欄列表', icon: 'mdi-format-list-bulleted' },
  { id: 'grid', name: '網格', desc: '2x2 社交圖示矩陣', icon: 'mdi-view-grid-outline' },
  { id: 'carousel', name: '輪播', desc: '橫向滑動卡片', icon: 'mdi-view-carousel-outline' }
]

const currentLayout = computed(() => props.modelValue || 'list')

const selectLayout = (id: string) => {
  emit('update:modelValue', id)
}
</script>

<style scoped>
.layout-picker-container {
  width: 100%;
}
.picker-label {
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.layout-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 12px;
}
.layout-opt {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border: 2px solid transparent;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}
.layout-opt:hover {
  background: white;
  border-color: #e2e8f0;
}
.layout-opt.active {
  background: white;
  border-color: #1867c0;
  box-shadow: 0 4px 12px rgba(24, 103, 192, 0.08);
}
.layout-icon-box {
  width: 44px;
  height: 44px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
}
.layout-info {
  flex-grow: 1;
}
.layout-name {
  font-size: 15px;
  font-weight: 800;
  color: #1e293b;
}
.layout-desc {
  font-size: 12px;
  color: #94a3b8;
}
.check-icon {
  position: absolute;
  right: 16px;
}
</style>
