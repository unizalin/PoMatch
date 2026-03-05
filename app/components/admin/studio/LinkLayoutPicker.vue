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
  { id: 'grid', name: '網格', desc: '2x2 社交矩陣', icon: 'mdi-view-grid-outline' },
  { id: 'bento', name: 'Bento', desc: '動態質感版型', icon: 'mdi-apps-box' },
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
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.layout-opt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 16px 8px;
  background: #f8fafc;
  border: 1.5px solid transparent;
  border-radius: 12px;
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
  box-shadow: 0 8px 16px rgba(24, 103, 192, 0.06);
}
.layout-icon-box {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}
.layout-info {
  width: 100%;
}
.layout-name {
  font-size: 13px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 2px;
}
.layout-desc {
  font-size: 10px;
  color: #94a3b8;
  line-height: 1.1;
}
.check-icon {
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 14px;
}
</style>
