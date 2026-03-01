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

              <!-- Action Links list -->
              <div class="phone-links-section w-100">
                <div 
                  v-for="link in profile.actionLinks" 
                  :key="link.id" 
                  class="phone-link-btn"
                  :style="{ 
                    borderRadius: `${profile.themeConfig?.linkRadius || 12}px`,
                    marginBottom: `${profile.themeConfig?.linkGap || 8}px`
                  }"
                >
                  <v-icon size="12" class="mr-2 opacity-70">{{ link.icon || 'mdi-link-variant' }}</v-icon>
                  <span class="text-truncate flex-grow-1 text-left">{{ link.title }}</span>
                  <v-icon size="10" color="grey-lighten-2">mdi-chevron-right</v-icon>
                </div>
              </div>

              <!-- Branded Footer -->
              <div class="mt-8 mb-2">
                <v-chip variant="outlined" color="grey-lighten-1" size="x-small" class="px-3 zoom-80 branding-chip">
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
  width: 100px;
  height: 20px;
  background: #1a1a2e;
  border-radius: 0 0 15px 15px;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
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
  padding: 30px 0 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(2px);
}

.glass-card-mockup {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(12px) !important;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  
  &.cyberpunk {
    background: rgba(13, 2, 33, 0.9) !important;
    border: 2px solid #ff00ff !important;
    box-shadow: 0 0 15px #ff00ff, inset 0 0 5px #ff00ff !important;
    
    .phone-name, .phone-desc, .text-grey, .text-grey-darken-3 {
      color: #00ffcc !important;
    }
    
    .v-chip {
      background: #ff00ff !important;
      color: white !important;
      box-shadow: 0 0 8px #ff00ff;
    }

    .stats-row {
      background: rgba(255, 255, 255, 0.05) !important;
      border: 1px solid rgba(0, 255, 204, 0.2);
    }

    .phone-link-btn {
      background: transparent !important;
      border: 1px solid #00ffcc !important;
      color: #00ffcc !important;
    }

    .branding-chip {
      border-color: rgba(0, 255, 204, 0.3) !important;
      color: #00ffcc !important;
    }
  }

  &.minimalist {
    background: white !important;
    box-shadow: none !important;
    border: none !important;
    .phone-avatar-border { border: 1px solid #eee; }
  }
}

.phone-avatar-border {
  border: 3px solid white;
  background: white;
}

.phone-name { 
  font-size: 16px; 
  font-weight: 800; 
  color: #1a1a1a; 
  margin: 8px 0 4px; 
  transition: all 0.3s; 
}

.phone-desc { 
  font-size: 10px; 
  color: #4b5563; 
  padding: 0 10px;
  line-height: 1.4; 
}

.stats-row {
  .text-tiny { font-size: 8px; font-weight: 500; }
  .text-caption { font-size: 10px !important; }
}

.social-btn-mock {
  width: 28px !important;
  height: 28px !important;
}

.phone-link-btn {
  width: 100%; 
  padding: 10px 12px;
  background: white; 
  border: 1px solid rgba(0, 0, 0, 0.03);
  color: #374151; 
  font-size: 11px; 
  font-weight: 700;
  display: flex; 
  align-items: center; 
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: all 0.2s;
}

.zoom-70 { transform: scale(0.7); transform-origin: right center; }
.zoom-80 { transform: scale(0.8); }
.zoom-85 { transform: scale(0.85); }

.phone-grain-overlay {
  position: absolute; inset: 0; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  z-index: 100; mix-blend-mode: overlay;
}

.gap-2 { gap: 8px; }
</style>
