<template>
  <NuxtLayout name="admin">
    <div class="profile-page-header mb-8">
      <div>
        <h2 class="page-title">背景視覺</h2>
        <p class="page-subtitle">自定義您的數位名片底色、光影與進階極光效果</p>
      </div>
      <div class="d-flex align-center gap-3">
        <v-btn color="primary" rounded="xl" class="font-weight-black shadow-sm" @click="saveBackground">
          儲存設定
        </v-btn>
      </div>
    </div>

    <v-row :gutter="20">
      <!-- Controls Column -->
      <v-col cols="12" lg="7">
        <div class="d-flex flex-column gap-6">
          
          <!-- Bento Case: Premium Themes -->
          <v-card class="bento-card glass-card pa-8" rounded="xl" elevation="0">
            <div class="d-flex align-center gap-3 mb-8">
              <div class="icon-box primary">
                <v-icon size="20">mdi-palette-swatch</v-icon>
              </div>
              <div>
                <h3 class="card-title">風格主題預設</h3>
                <p class="card-subtitle">快速切換精心設計的視覺氛圍</p>
              </div>
            </div>

            <div class="theme-grid">
              <div 
                v-for="theme in themes" 
                :key="theme.id" 
                class="theme-preset-card"
                :class="{ active: currentTheme === theme.id }"
                @click="applyTheme(theme.id)"
              >
                <div class="theme-preview" :style="{ background: theme.previewBg }">
                  <div v-if="theme.hasAurora" class="theme-aurora-sm"></div>
                </div>
                <div class="theme-info mt-3">
                  <div class="text-caption font-weight-black">{{ theme.label }}</div>
                </div>
              </div>
            </div>
          </v-card>

          <!-- Bento Case: Aurora Generator -->
          <v-card class="bento-card glass-card pa-8" rounded="xl" elevation="0">
            <div class="d-flex align-center justify-space-between mb-8">
              <div class="d-flex align-center gap-3">
                <div class="icon-box purple">
                  <v-icon size="20">mdi-auto-fix</v-icon>
                </div>
                <div>
                  <h3 class="card-title">Premium 極光產生器</h3>
                  <p class="card-subtitle">調整動態背景的光流比例與色彩</p>
                </div>
              </div>
              <v-switch v-model="backgroundSettings.enableAurora" color="primary" hide-details inset density="compact"></v-switch>
            </div>

            <div class="control-group mb-8">
              <div class="d-flex justify-space-between mb-4">
                <span class="text-caption font-weight-black text-slate-700">光影流動感 ({{ backgroundSettings.auroraSpeed }}x)</span>
              </div>
              <v-slider
                v-model="backgroundSettings.auroraSpeed"
                min="0.1"
                max="2.0"
                step="0.1"
                color="primary"
                hide-details
                track-color="#F1F5F9"
              ></v-slider>
            </div>

            <div class="d-flex gap-4">
              <div v-for="(color, idx) in backgroundSettings.auroraColors" :key="idx" class="color-picker-wrap">
                <div class="color-dot" :style="{ backgroundColor: color }"></div>
                <span class="text-xs font-weight-black text-slate-500 mt-2">色塊 {{ idx + 1 }}</span>
              </div>
              <v-btn icon="mdi-plus" variant="tonal" size="x-small" rounded="lg" color="slate-300"></v-btn>
            </div>
          </v-card>

          <!-- Bento Case: Texture & Glass -->
          <v-card class="bento-card glass-card pa-8" rounded="xl" elevation="0">
            <div class="d-flex align-center gap-3 mb-8">
              <div class="icon-box orange">
                <v-icon size="20">mdi-texture</v-icon>
              </div>
              <div>
                <h3 class="card-title">質感與細節</h3>
                <p class="card-subtitle">疊加顆粒感或毛玻璃強度</p>
              </div>
            </div>

            <v-row :gutter="24">
              <v-col cols="12" md="6">
                <div class="text-caption font-weight-black text-slate-700 mb-4">膠卷顆粒強度</div>
                <v-slider
                  v-model="backgroundSettings.grainIntensity"
                  min="0"
                  max="100"
                  color="orange"
                  hide-details
                ></v-slider>
              </v-col>
              <v-col cols="12" md="6">
                <div class="text-caption font-weight-black text-slate-700 mb-4">毛玻璃透明度</div>
                <v-slider
                  v-model="backgroundSettings.glassOpacity"
                  min="0"
                  max="100"
                  color="blue"
                  hide-details
                ></v-slider>
              </v-col>
            </v-row>
          </v-card>

        </div>
      </v-col>

      <!-- Preview Column (Real-time Sync) -->
      <v-col cols="12" lg="5">
        <div class="sticky-preview">
          <div class="device-preview-container">
            <ProfileCard :profile="store.profile" :background-style="previewStyle" />
            <div class="preview-badge">及時預覽</div>
          </div>
        </div>
      </v-col>
    </v-row>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'
import ProfileCard from '~/components/ProfileCard.vue'

definePageMeta({ layout: false })

const store = useProfileStore()
const currentTheme = ref('glassmorphism')

const backgroundSettings = ref({
  enableAurora: true,
  auroraSpeed: 1.0,
  auroraColors: ['#6366F1', '#EC4899', '#3B82F6'],
  grainIntensity: 15,
  glassOpacity: 80,
  baseColor: '#FFFFFF'
})

const themes = [
  { id: 'glassmorphism', label: '毛玻璃', previewBg: 'linear-gradient(135deg, #E0E7FF 0%, #F5F3FF 100%)', hasAurora: true },
  { id: 'cyberpunk', label: '賽博龐克', previewBg: '#0F172A', hasAurora: true },
  { id: 'minimalist', label: '極簡白', previewBg: '#F8FAFC', hasAurora: false },
  { id: 'neo-brutalism', label: '新酷炫', previewBg: '#FACC15', hasAurora: false }
]

const previewStyle = computed(() => {
  return {
    '--aurora-speed': `${backgroundSettings.value.auroraSpeed}s`,
    '--grain-opacity': backgroundSettings.value.grainIntensity / 100,
    '--glass-bg': `rgba(255, 255, 255, ${backgroundSettings.value.glassOpacity / 100})`,
    background: backgroundSettings.value.baseColor
  }
})

const applyTheme = (id: string) => {
  currentTheme.value = id
  // Apply preset logic here...
}

const saveBackground = () => {
  // Save logic...
  store.updateProfile({ background: backgroundSettings.value })
}
</script>

<style scoped>
/* ─── Page Header ─── */
.profile-page-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.page-title { font-size: 28px; font-weight: 900; letter-spacing: -0.04em; color: #0f172a; margin-bottom: 4px; }
.page-subtitle { font-size: 14px; color: #64748b; margin: 0; }

/* ─── Bento Cards ─── */
.bento-card { background: white; border: 1px solid #F1F5F9 !important; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); overflow: hidden; position: relative; }

/* ─── Icon Boxes ─── */
.icon-box { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
.icon-box.primary { background: #EEF2FF; color: #4F46E5; }
.icon-box.purple { background: #F5F3FF; color: #8B5CF6; }
.icon-box.orange { background: #FFF7ED; color: #F97316; }

/* ─── Theme Grid ─── */
.theme-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.theme-preset-card { cursor: pointer; transition: transform 0.2s; }
.theme-preset-card:hover { transform: translateY(-4px); }
.theme-preset-card.active .theme-preview { border: 3px solid #4F46E5; box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1); }
.theme-preview { height: 80px; border-radius: 16px; border: 1px solid #F1F5F9; position: relative; overflow: hidden; }
.theme-aurora-sm { position: absolute; width: 150%; height: 150%; background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%); animation: drift 5s infinite; }
@keyframes drift { 0% { transform: translate(-20%, -20%); } 50% { transform: translate(10%, 10%); } 100% { transform: translate(-20%, -20%); } }

/* ─── Color Pickers ─── */
.color-picker-wrap { display: flex; flex-direction: column; align-items: center; }
.color-dot { width: 40px; height: 40px; border-radius: 12px; border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.1); cursor: pointer; }

/* ─── Sticky Preview ─── */
.sticky-preview { position: sticky; top: 120px; display: flex; justify-content: center; }
.device-preview-container { position: relative; padding: 20px; background: #F8FAFC; border-radius: 40px; border: 1px solid #F1F5F9; }
.preview-badge { position: absolute; top: 20px; right: 20px; background: #0F172A; color: white; padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 900; letter-spacing: 0.1em; }

/* ─── Helpers ─── */
.card-title { font-size: 18px; font-weight: 900; color: #0F172A; letter-spacing: -0.03em; margin-bottom: 2px; }
.card-subtitle { font-size: 13px; color: #94A3B8; font-weight: 500; }
.text-slate-700 { color: #334155; }
.text-slate-500 { color: #64748B; }
.text-xs { font-size: 11px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
.gap-6 { gap: 24px; }
.shadow-sm { box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important; }
</style>
