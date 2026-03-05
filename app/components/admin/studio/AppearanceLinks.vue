<template>
  <div class="studio-appearance-links">
    <!-- Component Header -->
    <div class="studio-section-header mb-6">
      <div>
        <h2 class="studio-title">連結樣式</h2>
        <p class="studio-subtitle">自定義連結按鈕的形狀、動畫與互動回饋</p>
      </div>
    </div>

    <!-- ── Button Layout ── -->
    <div class="section-card mb-4">
      <div class="section-label">
        <v-icon size="16" color="primary">mdi-shape-outline</v-icon>
        按鈕形狀與間距
      </div>

      <div class="control-row mb-6">
        <div class="control-label d-flex justify-space-between">
          <span>按鈕圓角 (Radius)</span>
          <span class="text-primary font-weight-bold">{{ store.profile.themeConfig.linkRadius }}px</span>
        </div>
        <v-slider
          v-model="store.profile.themeConfig.linkRadius"
          min="0"
          max="32"
          step="2"
          hide-details
          color="primary"
        ></v-slider>
      </div>

      <div class="control-row">
        <div class="control-label">列表間隙 (Margin)</div>
        <v-slider
          v-model="store.profile.themeConfig.linkGap"
          min="4"
          max="24"
          step="2"
          hide-details
          color="primary"
        ></v-slider>
      </div>
    </div>

    <!-- ── Interactions ── -->
    <div class="section-card">
      <div class="section-label">
        <v-icon size="16" color="pink">mdi-cursor-default-click-outline</v-icon>
        互動與動畫
      </div>

      <div class="control-row mb-6">
        <div class="control-label">懸停縮放 (Scale)</div>
        <v-slider
          v-model="store.profile.themeConfig.linkHoverScale"
          min="1"
          max="1.1"
          step="0.01"
          hide-details
          color="pink"
        ></v-slider>
      </div>

      <div class="d-flex align-center justify-space-between py-2">
        <div class="text-subtitle-2 text-grey-darken-1">啟用懸停發光效果</div>
        <v-switch
          v-model="store.profile.themeConfig.linkGlow"
          color="pink"
          hide-details
          inset
        ></v-switch>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'

const store = useProfileStore()

// 監聽重要的設定變更並存入歷史紀錄 (使用 debounce 避免滑動時產生過多快照)
let snapshotTimer: any = null
watch(() => [
  store.profile.themeConfig.linkRadius,
  store.profile.themeConfig.linkGap,
  store.profile.themeConfig.linkHoverScale,
  store.profile.themeConfig.linkGlow,
  store.profile.themeConfig.linkLayout
], () => {
  if (snapshotTimer) clearTimeout(snapshotTimer)
  snapshotTimer = setTimeout(() => {
    store.takeSnapshot()
  }, 500)
}, { deep: true })
</script>

<style scoped>
.studio-section-header { display: flex; align-items: center; justify-content: space-between; }
.studio-title { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
.studio-subtitle { font-size: 13px; color: #94a3b8; }

.section-card { background: white; border: 1px solid #f1f5f9; border-radius: 20px; padding: 24px; }
.section-label { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 20px; }

.control-row { margin-bottom: 12px; }
.control-label { font-size: 12px; font-weight: 600; color: #64748b; margin-bottom: 8px; }
</style>
