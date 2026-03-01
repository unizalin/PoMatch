<template>
  <NuxtLayout name="admin">
    <div class="profile-page-header mb-8">
      <div>
        <h2 class="page-title">連結樣式</h2>
        <p class="page-subtitle">自定義按鈕圓角、陰影、懸停動畫與點擊回饋</p>
      </div>
      <div class="d-flex align-center gap-3">
        <v-btn color="primary" rounded="xl" class="font-weight-black shadow-sm" @click="saveLinkStyle">
          儲存設定
        </v-btn>
      </div>
    </div>

    <v-row :gutter="20">
      <!-- Controls Column -->
      <v-col cols="12" lg="7">
        <div class="d-flex flex-column gap-6">
          
          <!-- Bento Case: Style Explorer -->
          <v-card class="bento-card glass-card pa-8" rounded="xl" elevation="0">
            <div class="d-flex align-center gap-3 mb-8">
              <div class="icon-box primary">
                <v-icon size="20">mdi-cursor-default-click-outline</v-icon>
              </div>
              <div>
                <h3 class="card-title">連結風格探索</h3>
                <p class="card-subtitle">選擇適合您的按鈕視覺基礎</p>
              </div>
            </div>

            <div class="style-explorer-grid">
              <div 
                v-for="style in linkStyles" 
                :key="style.id" 
                class="style-preset-card"
                :class="{ active: currentLinkStyle === style.id }"
                @click="currentLinkStyle = style.id"
              >
                <div class="style-preview" :style="style.previewCss">
                  <span class="text-xs font-weight-black" :style="{ color: style.textColor }">示例文字</span>
                </div>
                <div class="text-center mt-3">
                  <div class="text-caption font-weight-black">{{ style.label }}</div>
                </div>
              </div>
            </div>
          </v-card>

          <!-- Bento Case: Customization -->
          <v-card class="bento-card glass-card pa-8" rounded="xl" elevation="0">
            <div class="d-flex align-center gap-3 mb-10">
              <div class="icon-box purple">
                <v-icon size="20">mdi-tune-variant</v-icon>
              </div>
              <div>
                <h3 class="card-title">細項微調</h3>
                <p class="card-subtitle">控制按鈕的幾何與光影細節</p>
              </div>
            </div>

            <v-row :gutter="24">
              <v-col cols="12" md="6">
                <div class="text-caption font-weight-black text-slate-700 mb-4">按鈕圓角 (Radius)</div>
                <v-slider
                  v-model="customSettings.borderRadius"
                  min="0"
                  max="40"
                  color="purple"
                  hide-details
                ></v-slider>
              </v-col>
              <v-col cols="12" md="6">
                <div class="text-caption font-weight-black text-slate-700 mb-4">懸停縮放 (Hover Scale)</div>
                <v-slider
                  v-model="customSettings.hoverScale"
                  min="1.0"
                  max="1.1"
                  step="0.01"
                  color="primary"
                  hide-details
                ></v-slider>
              </v-col>
              <v-col cols="12" md="6">
                <div class="text-caption font-weight-black text-slate-700 mb-4">陰影擴散 (Glow)</div>
                <v-slider
                  v-model="customSettings.shadowIntensity"
                  min="0"
                  max="100"
                  color="orange"
                  hide-details
                ></v-slider>
              </v-col>
            </v-row>
          </v-card>

          <!-- Bento Case: Interaction Feedback -->
          <v-card class="bento-card glass-card pa-8" rounded="xl" elevation="0">
            <div class="d-flex align-center gap-3 mb-8">
              <div class="icon-box orange">
                <v-icon size="20">mdi-gesture-tap</v-icon>
              </div>
              <div>
                <h3 class="card-title">互動反饋</h3>
                <p class="card-subtitle">增強用戶點擊時的體感連結</p>
              </div>
            </div>

            <div class="d-flex gap-4">
              <div v-for="effect in interactionEffects" :key="effect.id" class="interaction-card" :class="{ active: customSettings.activeEffect === effect.id }" @click="customSettings.activeEffect = effect.id">
                <v-icon size="24" :color="customSettings.activeEffect === effect.id ? 'primary' : 'slate-400'">{{ effect.icon }}</v-icon>
                <div class="text-xs font-weight-black mt-2">{{ effect.label }}</div>
              </div>
            </div>
          </v-card>

        </div>
      </v-col>

      <!-- Preview Column (Real-time Sync) -->
      <v-col cols="12" lg="5">
        <div class="sticky-preview">
          <div class="device-preview-container">
            <ProfileCard :profile="store.profile" :link-style="previewStyle" />
            <div class="preview-badge">觸感體驗</div>
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
const currentLinkStyle = ref('glassmorphism')

const customSettings = ref({
  borderRadius: 16,
  hoverScale: 1.02,
  shadowIntensity: 20,
  activeEffect: 'ripple'
})

const linkStyles = [
  { id: 'glassmorphism', label: '毛玻璃', previewCss: { background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)' }, textColor: '#1E293B' },
  { id: 'neo-brutalism', label: '新酷炫', previewCss: { background: '#FACC15', border: '3px solid #000', boxShadow: '4px 4px 0px #000' }, textColor: '#000' },
  { id: 'minimal-flat', label: '現代簡約', previewCss: { background: '#0F172A' }, textColor: '#FFF' },
  { id: 'soft-ui', label: '柔和 UI', previewCss: { background: '#F1F5F9', boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.05), 5px 5px 15px rgba(0,0,0,0.1)' }, textColor: '#1E293B' }
]

const interactionEffects = [
  { id: 'ripple', label: '水波紋', icon: 'mdi-ripple' },
  { id: 'bounce', label: '微彈跳', icon: 'mdi-auto-fix' },
  { id: 'glow', label: '發光', icon: 'mdi-sparkles' }
]

const previewStyle = computed(() => {
  return {
    '--link-radius': `${customSettings.value.borderRadius}px`,
    '--link-hover-scale': customSettings.value.hoverScale,
    '--link-shadow': `0 ${customSettings.value.shadowIntensity / 4}px ${customSettings.value.shadowIntensity}px rgba(0,0,0,${customSettings.value.shadowIntensity / 200})`,
    '--active-effect': customSettings.value.activeEffect,
    styleId: currentLinkStyle.value
  }
})

const saveLinkStyle = () => {
  store.updateProfile({ linkStyle: { ...customSettings.value, styleId: currentLinkStyle.value } })
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

/* ─── Style Explorer ─── */
.style-explorer-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.style-preset-card { cursor: pointer; transition: transform 0.2s; }
.style-preset-card:hover { transform: translateY(-4px); }
.style-preview { height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 1px solid #F1F5F9; transition: all 0.2s; }
.style-preset-card.active .style-preview { border-color: #4F46E5; box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1); }

/* ─── Interaction Cards ─── */
.interaction-card { flex: 1; height: 80px; background: #F8FAFC; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 2px solid transparent; cursor: pointer; transition: all 0.2s; }
.interaction-card:hover { border-color: #E2E8F0; }
.interaction-card.active { border-color: #4F46E5; background: white; box-shadow: 0 8px 16px rgba(79, 70, 229, 0.05); }

/* ─── Sticky Preview ─── */
.sticky-preview { position: sticky; top: 120px; display: flex; justify-content: center; }
.device-preview-container { position: relative; padding: 20px; background: #F8FAFC; border-radius: 40px; border: 1px solid #F1F5F9; }
.preview-badge { position: absolute; top: 20px; right: 20px; background: #0F172A; color: white; padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 900; letter-spacing: 0.1em; }

/* ─── Helpers ─── */
.card-title { font-size: 18px; font-weight: 900; color: #0F172A; letter-spacing: -0.03em; margin-bottom: 2px; }
.card-subtitle { font-size: 13px; color: #94A3B8; font-weight: 500; }
.text-slate-700 { color: #334155; }
.text-slate-400 { color: #94A3B8; }
.text-xs { font-size: 11px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
.gap-6 { gap: 24px; }
.shadow-sm { box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important; }
</style>
