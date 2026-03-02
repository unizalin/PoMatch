<template>
  <div class="studio-preview-device">
    <div class="preview-toolbar d-flex align-center justify-space-between mb-4">
      <div class="d-flex align-center gap-2">
        <v-icon size="14" color="grey">mdi-cellphone</v-icon>
        <span class="text-caption font-weight-bold text-grey">即時預覽</span>
      </div>
      <v-chip size="x-small" color="primary" variant="flat" class="font-weight-black">LIVE</v-chip>
    </div>

    <!-- Phone Frame -->
    <div class="phone-frame shadow-2xl">
      <div class="phone-screen" :class="[`theme-${profile.theme}`]">
        <!-- Phone Notch -->
        <div class="phone-notch"></div>
        
        <!-- Dynamic Background (Aurora) -->
        <div 
          class="phone-aurora"
          :style="{ 
            opacity: profile.themeConfig?.auroraIntensity || 0.5,
            filter: `blur(${profile.themeConfig?.glassIntensity || 10}px)`
          }"
        ></div>

        <!-- Scrollable Content -->
        <div class="phone-content-scroll" :style="{ gap: `${profile.themeConfig?.contentGap || 16}px` }">
          <!-- Glass Card Wrapper (Matching [id].vue style) -->
          <div :class="['glass-card-mockup pa-6 w-100 mx-4 text-center', profile.theme]">
            <!-- Status Indicator -->
            <div class="d-flex justify-end mb-n2">
              <v-chip size="x-small" color="success" variant="flat" class="text-caption font-weight-bold zoom-70">
                <v-icon start size="8">mdi-circle</v-icon>
                在線上
              </v-chip>
            </div>

            <!-- Profile Section -->
            <div class="phone-profile-section mt-2">
              <v-avatar size="70" class="mb-3 phone-avatar-border elevation-10">
                <v-img :src="profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`"></v-img>
              </v-avatar>
              
              <h1 
                class="phone-name"
                :style="{ transform: `scale(${profile.themeConfig?.nameScale || 1})` }"
              >
                {{ profile.name || '@' + profile.username }}
              </h1>
              <p class="phone-desc">{{ profile.description || '點擊左側來編輯你的簡介...' }}</p>

              <!-- Persona Chips -->
              <div class="d-flex flex-wrap justify-center gap-1 mt-3 mb-4">
                <v-chip size="x-small" variant="tonal" color="primary" class="font-weight-bold zoom-85">{{ profile.persona?.mbti || 'INFJ' }}</v-chip>
                <v-chip size="x-small" variant="tonal" color="secondary" class="font-weight-bold zoom-85">{{ profile.persona?.zodiac || '天蠍座' }}</v-chip>
                <v-chip size="x-small" variant="tonal" color="accent" class="font-weight-bold zoom-85">📍 {{ profile.persona?.location || '台北' }}</v-chip>
              </div>

              <!-- Interactive Stats (3-Column Style) -->
              <v-row class="mb-4 bg-grey-lighten-4 rounded-lg py-2 mx-1 stats-row">
                <v-col cols="4" class="pa-0">
                  <div class="text-caption font-weight-bold text-primary">60%</div>
                  <div class="text-tiny text-grey">契合度</div>
                </v-col>
                <v-col cols="4" class="pa-0 border-s border-e">
                  <div class="text-caption font-weight-bold">{{ profile.interactiveStats?.likes || 0 }}</div>
                  <div class="text-tiny text-grey">被喜歡</div>
                </v-col>
                <v-col cols="4" class="pa-0">
                  <div class="text-caption font-weight-bold">{{ profile.interactiveStats?.followers || 0 }}</div>
                  <div class="text-tiny text-grey">追蹤中</div>
                </v-col>
              </v-row>

              <!-- Social Links Row -->
              <div class="social-row d-flex justify-center mb-4">
                <v-btn
                  v-for="social in (profile.socialLinks || [])"
                  :key="social.platform"
                  icon
                  :color="social.color"
                  variant="tonal"
                  size="x-small"
                  class="social-btn-mock mx-1"
                >
                  <v-icon size="12">{{ social.icon }}</v-icon>
                </v-btn>
              </div>

            <!-- Action Links (Multi-Layout Support) -->
            <div 
              :class="['phone-links-container w-100', `layout-${profile.themeConfig?.linkLayout || 'list'}`]"
              :style="{ gap: `${profile.themeConfig?.linkGap || 8}px` }"
            >
              <div 
                v-for="link in profile.actionLinks" 
                :key="link.id" 
                class="phone-link-btn"
                :class="[
                  link.metadata?.animation ? `anim-${link.metadata.animation}` : '',
                  profile.themeConfig?.linkLayout === 'grid' ? 'grid-item' : '',
                  (profile.themeConfig?.linkLayout === 'grid' && link.metadata?.gridSpan === 'full') ? 'grid-full' : ''
                ]"
                :style="getLinkStyle(link)"
              >
                <!-- List Layout Content -->
                <template v-if="(profile.themeConfig?.linkLayout || 'list') === 'list'">
                  <div class="link-circle-mock mr-3" :style="{ background: link.metadata?.color || '' }">
                    <v-icon size="12" color="white">{{ link.icon || 'mdi-link-variant' }}</v-icon>
                  </div>
                  <span class="text-truncate flex-grow-1 text-left font-weight-bold" style="font-size: 11px">{{ link.title }}</span>
                  <v-icon size="10" color="grey-lighten-2">mdi-chevron-right</v-icon>
                </template>

                <!-- Grid Layout Content -->
                <template v-else>
                  <div class="grid-preview-content d-flex align-center flex-column justify-center w-100 h-100">
                    <v-icon :size="link.metadata?.gridSpan === 'full' ? 16 : 20" :color="link.metadata?.color || 'primary'" :class="link.metadata?.gridSpan === 'full' ? 'mr-2' : 'mb-1'">{{ link.icon || 'mdi-link-variant' }}</v-icon>
                    <div class="text-tiny font-weight-black text-truncate px-1" :class="link.metadata?.gridSpan === 'full' ? 'text-left' : 'text-center'">{{ link.title }}</div>
                  </div>
                </template>
              </div>
            </div>

            <!-- Floating Action Button for Likes (Mock) -->
            <div class="mt-6 d-flex justify-center">
              <v-btn
                icon
                color="red-lighten-4"
                class="like-btn-mock"
                size="small"
              >
                <v-icon color="red" size="14">mdi-heart</v-icon>
              </v-btn>
            </div>

            <!-- Branded Footer (Internal styled chip) -->
            <div class="mt-8 mb-2">
              <v-chip variant="outlined" color="grey-lighten-1" size="x-small" class="px-3 branding-chip-real font-weight-black">
                POWERED BY POMATCH
              </v-chip>
            </div>
          </div>
        </div>
      </div>

        <!-- Grain Overlay -->
        <div 
          v-if="profile.themeConfig?.grainOpacity" 
          class="phone-grain-overlay"
          :style="{ opacity: profile.themeConfig.grainOpacity }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'

const store = useProfileStore()
const profile = computed(() => store.profile)

const getLinkStyle = (link: any) => {
  const isGrid = profile.value.themeConfig?.linkLayout === 'grid'
  const style: any = {
    borderRadius: `${profile.value.themeConfig?.linkRadius || 12}px`,
    marginBottom: isGrid ? '0' : `${profile.value.themeConfig?.linkGap || 8}px`
  }
  
  if (link.metadata?.color) {
    if (isGrid) {
      style.border = `1.5px solid ${link.metadata.color}22`
    } else {
      style.borderLeft = `3px solid ${link.metadata.color}`
    }
  }

  return style
}
</script>

<style scoped lang="scss">
.phone-frame {
  width: 280px;
  height: 560px;
  background: #000;
  border: 10px solid #1a1a2e;
  border-radius: 40px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.phone-screen {
  width: 100%;
  height: 100%;
  background: #0f172a;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 30px;
}

.phone-notch {
  width: 90px;
  height: 22px;
  background: #000;
  border-radius: 0 0 18px 18px;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
}

.phone-aurora {
  position: absolute;
  inset: -50%;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
  animation: aurora-rotate 10s linear infinite;
  z-index: 1;
}

@keyframes aurora-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.phone-content-scroll {
  flex: 1;
  position: relative;
  z-index: 5;
  padding: 40px 16px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

.glass-card-mockup-premium {
  background: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
  border-radius: 40px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  width: 100%;
}

.phone-avatar-border-premium {
  border: 3px solid white;
  background: white;
}

.phone-name-premium { 
  font-size: 18px; 
  font-weight: 900; 
  color: #0f172a; 
  margin: 4px 0; 
  letter-spacing: -0.05em;
}

.phone-desc-premium { 
  font-size: 11px; 
  color: #475569; 
  padding: 0 8px;
  line-height: 1.5;
  font-weight: 500;
}

.stats-row-premium {
  background: rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  .text-tiny { font-size: 8px; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
  .text-caption { font-size: 11px !important; }
}

.social-btn-mock-premium {
  width: 32px !important;
  height: 32px !important;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1) !important;
}

.phone-links-container {
  display: flex;
  flex-direction: column;
  &.layout-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-flow: dense;
    gap: 10px !important;
  }
}

.phone-link-btn {
  width: 100%; 
  padding: 8px 12px;
  background: white; 
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.02);
  color: #1e293b; 
  display: flex; 
  align-items: center; 
  box-shadow: 0 4px 10px rgba(0,0,0,0.04);
  margin-bottom: 8px;
  position: relative;

  &.grid-item {
    flex-direction: column;
    justify-content: center;
    aspect-ratio: 1;
    padding: 8px 4px;
    margin-bottom: 0;
    
    &.grid-full {
      grid-column: span 2;
      aspect-ratio: auto;
      min-height: 44px;
      padding: 8px 12px;
      
      .grid-preview-content {
        flex-direction: row !important;
        justify-content: flex-start !important;
      }
    }
  }
  
  .link-circle-mock {
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, #6366f1, #a855f7);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Animations for Preview */
  &.anim-glow { animation: preview-link-glow 2s infinite ease-in-out; }
  &.anim-bounce { animation: preview-link-bounce 3s infinite ease-in-out; }
}

@keyframes preview-link-glow {
  0%, 100% { box-shadow: 0 4px 10px rgba(0,0,0,0.04); }
  50% { box-shadow: 0 0 12px rgba(99, 102, 241, 0.4); }
}

@keyframes preview-link-bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-4px); }
  60% { transform: translateY(-2px); }
}

.heartbeat-mock {
  animation: HeartbeatAnimation 2s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95);
}

.branding-chip-real {
  letter-spacing: 2px !important;
  font-size: 8px !important;
  color: #94a3b8 !important;
}

.pulse-indicator {
  box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
  animation: PulseIndicatorAnim 2s infinite;
}

@keyframes PulseIndicatorAnim {
  0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(74, 222, 128, 0); }
  100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
}

.scale-75 { transform: scale(0.75); transform-origin: right top; }
.scale-90 { transform: scale(0.9); }

.theme-cyberpunk {
  .glass-card-mockup-premium {
    background: rgba(13, 2, 33, 0.8) !important;
    border: 2px solid #ff00ff !important;
  }
  .phone-name-premium, .phone-desc-premium, .text-grey, .text-slate-800 { color: #00ffcc !important; }
}

.phone-grain-overlay {
  position: absolute; inset: 0; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  z-index: 100; mix-blend-mode: overlay;
}

  .gap-2 { gap: 8px; }
</style>
