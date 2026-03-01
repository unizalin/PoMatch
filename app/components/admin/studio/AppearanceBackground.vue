<template>
  <div class="studio-appearance-background">
    <!-- Component Header -->
    <div class="studio-section-header mb-6">
      <div>
        <h2 class="studio-title">背景設計</h2>
        <p class="studio-subtitle">打造獨一無二的視覺氛圍，讓名片更有層次感</p>
      </div>
    </div>

    <!-- ── Aurora Generator ── -->
    <div class="section-card mb-4">
      <div class="section-label">
        <v-icon size="16" color="primary">mdi-auto-fix</v-icon>
        Premium 極光產生器
      </div>
      
      <div class="control-row mb-4">
        <div class="control-label">極光強度</div>
        <v-slider
          v-model="store.profile.themeConfig.auroraIntensity"
          min="0"
          max="1"
          step="0.1"
          hide-details
          color="primary"
        ></v-slider>
      </div>

      <div class="control-row">
        <div class="control-label">玻璃霧化 (Glass)</div>
        <v-slider
          v-model="store.profile.themeConfig.glassIntensity"
          min="0"
          max="20"
          step="1"
          hide-details
          color="primary"
        ></v-slider>
      </div>
    </div>

    <!-- ── Texture & Presets ── -->
    <div class="section-card">
      <div class="section-label">
        <v-icon size="16" color="amber-darken-2">mdi-texture-box</v-icon>
        細節質感與預設
      </div>

      <div class="preset-grid mb-6">
        <button
          v-for="p in presets"
          :key="p.name"
          class="preset-btn"
          :class="{ active: store.profile.theme === p.theme }"
          @click="applyPreset(p)"
        >
          <div class="preset-preview" :style="{ background: p.previewBg }"></div>
          <span class="preset-name">{{ p.name }}</span>
        </button>
      </div>

      <div class="control-row">
        <div class="control-label">顆粒質感 (Grain)</div>
        <v-slider
          v-model="store.profile.themeConfig.grainOpacity"
          min="0"
          max="0.5"
          step="0.05"
          hide-details
          color="primary"
        ></v-slider>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'

const store = useProfileStore()

const presets = [
  { name: '晨曦玻璃', theme: 'glassmorphism', previewBg: 'linear-gradient(135deg, #e0f2fe 0%, #ddd6fe 100%)' },
  { name: '霓虹深淵', theme: 'cyberpunk', previewBg: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' },
  { name: '純粹簡約', theme: 'minimalist', previewBg: '#f8fafc' },
]

const applyPreset = (p: any) => {
  store.profile.theme = p.theme
}
</script>

<style scoped>
.studio-section-header { display: flex; align-items: center; justify-content: space-between; }
.studio-title { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
.studio-subtitle { font-size: 13px; color: #94a3b8; }

.section-card { background: white; border: 1px solid #f1f5f9; border-radius: 20px; padding: 24px; }
.section-label { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 20px; }

.control-row { margin-bottom: 12px; }
.control-label { font-size: 12px; font-weight: 600; color: #64748b; margin-bottom: 8px; }

.preset-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.preset-btn {
  border: 1.5px solid #f1f5f9; border-radius: 12px; padding: 8px; transition: all 0.2s; background: white; cursor: pointer;
}
.preset-btn:hover { border-color: #e2e8f0; transform: translateY(-2px); }
.preset-btn.active { border-color: #1867c0; background: #eff6ff; }
.preset-preview { height: 40px; border-radius: 8px; margin-bottom: 6px; }
.preset-name { font-size: 11px; font-weight: 700; color: #475569; }
</style>
