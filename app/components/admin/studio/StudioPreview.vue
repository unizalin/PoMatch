<template>
  <div class="studio-preview-device">
    <div class="preview-toolbar d-flex align-center justify-space-between mb-4">
      <div class="d-flex align-center gap-2">
        <v-icon size="14" color="grey">mdi-cellphone</v-icon>
        <span class="text-caption font-weight-bold text-grey">即時預覽</span>
      </div>
      <div class="d-flex align-center gap-1">
        <v-btn-toggle v-model="deviceIndex" mandatory density="compact" variant="outlined" rounded="lg" color="primary">
          <v-btn size="x-small" value="0">
            <v-icon size="14">mdi-cellphone</v-icon>
          </v-btn>
          <v-btn size="x-small" value="1">
            <v-icon size="14">mdi-cellphone</v-icon>
          </v-btn>
          <v-btn size="x-small" value="2">
            <v-icon size="14">mdi-tablet</v-icon>
          </v-btn>
        </v-btn-toggle>
        
        <!-- Flip Toggle Button -->
        <v-btn
          v-if="profile.themeConfig?.cardMode"
          icon
          size="x-small"
          variant="tonal"
          color="accent"
          class="ml-2"
          @click="isFlipped = !isFlipped"
        >
          <v-icon size="14">mdi-card-refresh-outline</v-icon>
          <v-tooltip activator="parent" location="bottom">翻轉名片</v-tooltip>
        </v-btn>
        
        <v-chip size="x-small" color="primary" variant="flat" class="font-weight-black ml-2">LIVE</v-chip>
      </div>
    </div>

    <!-- Phone Frame -->
    <div class="phone-frame shadow-2xl" :style="deviceStyle">
      <div class="phone-screen" :class="[`theme-${profile.theme}`]">
        <!-- Phone Notch -->
        <div class="phone-notch"></div>
        
        <!-- Dynamic Background -->
        <div 
          class="phone-aurora"
          :style="{ 
            opacity: profile.themeConfig?.auroraIntensity || 0.5,
            filter: `blur(${profile.themeConfig?.glassIntensity || 10}px)`
          }"
        ></div>

        <!-- 3D Perspective Container -->
        <div 
          class="card-perspective" 
          :class="{ 
            'is-flipped': isFlipped, 
            'is-vertical': profile.themeConfig?.flipDirection === 'vertical',
            'no-flip': !profile.themeConfig?.cardMode
          }"
          @click="isFlipped = !isFlipped"
        >
          <div class="card-inner">
            <!-- ── FRONT SIDE ── -->
            <div class="card-front">
              <div 
                class="phone-content-front d-flex flex-column align-center justify-center h-100"
                :style="{ gap: `${profile.themeConfig?.contentGap || 16}px` }"
              >
                <!-- Front Face -->
                <div :class="['front-face glass-card-mockup w-100 h-100 px-8 py-10 d-flex flex-column', `theme-${profile.theme}`]">
                  <!-- Phone Profile Header -->
                  <div class="d-flex justify-end mb-2">
                    <v-chip size="x-small" color="success" variant="flat" class="text-caption font-weight-black pulse-indicator">
                      <v-icon start size="8">mdi-circle</v-icon>
                      在線上
                    </v-chip>
                  </div>

                  <div class="phone-hero d-flex flex-column align-center gap-6 mb-6 mt-4 text-center">
                    <v-avatar 
                      size="64" 
                      class="phone-avatar-border elevation-10"
                      :style="{ 
                        transform: `translate(${profile.themeConfig?.avatarOffset || 0}px, ${profile.themeConfig?.vOffset || 0}px)` 
                      }"
                    >
                      <v-img :src="profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`"></v-img>
                    </v-avatar>
                    <div 
                      class="text-center w-100"
                      :style="{ 
                        transform: `translate(${profile.themeConfig?.textOffset || 0}px, ${profile.themeConfig?.textVOffset || 0}px)` 
                      }"
                    >
                      <h1 
                        class="phone-name mb-3"
                        :style="{ 
                          transform: `scale(${profile.themeConfig?.nameScale || 1.1})`, 
                          transformOrigin: 'center'
                        }"
                      >
                        {{ profile.name || '@' + profile.username }}
                      </h1>
                      
                      <div class="d-flex justify-center gap-1 mb-3">
                        <v-chip size="x-small" variant="tonal" color="primary" class="zoom-70 px-1 font-weight-black">{{ profile.persona?.mbti }}</v-chip>
                        <v-chip size="x-small" variant="tonal" color="secondary" class="zoom-70 px-1 font-weight-black">{{ profile.persona?.zodiac }}</v-chip>
                      </div>

                      <!-- Interests in Preview -->
                      <div v-if="profile.persona?.tags?.length" class="d-flex flex-wrap justify-center gap-2 mb-4">
                        <span v-for="tag in profile.persona.tags" :key="tag" class="interest-tag-tiny text-uppercase">
                          #{{ tag }}
                        </span>
                      </div>

                      <p v-if="profile.description" class="phone-bio-tiny mb-0 line-clamp-2">
                        {{ profile.description }}
                      </p>
                    </div>
                  </div>
                  


                  <!-- Social Icons Row -->
                  <div v-if="profile.socialLinks?.length" class="social-icons-front d-flex justify-center gap-2 mb-3">
                    <v-btn
                      v-for="social in (profile.socialLinks || [])"
                      :key="social.platform"
                      icon
                      :color="social.color"
                      variant="text"
                      size="36"
                      class="social-icon-btn"
                    >
                      <v-icon size="20">{{ social.icon }}</v-icon>
                    </v-btn>
                  </div>

                  <!-- Links on Front (always list mode) -->
                    <!-- Link Layouts Area -->
                    <div class="w-100 flex-grow-1 overflow-y-auto pr-1 phone-scrollbar custom-scrollbar" style="max-height: 280px;">
                      <!-- Bento Layout -->
                      <div v-if="profile.themeConfig?.linkLayout === 'bento'" class="links-bento-tiny">
                        <div 
                          v-for="(link, index) in profile.actionLinks" 
                          :key="link.id" 
                          class="link-bento-pill-tiny"
                          :class="{ 'wide': index % 3 === 0 }"
                        >
                          <v-icon :size="index % 3 === 0 ? 20 : 16" :color="link.metadata?.color || 'primary'">{{ link.icon || 'mdi-link-variant' }}</v-icon>
                          <span class="text-truncate font-weight-bold ml-1" style="font-size: 10px;">{{ link.title }}</span>
                        </div>
                      </div>

                      <!-- Grid Layout -->
                      <div v-else-if="profile.themeConfig?.linkLayout === 'grid'" class="links-grid-tiny">
                        <div v-for="link in profile.actionLinks" :key="link.id" class="link-grid-pill-tiny">
                          <v-icon size="18" :color="link.metadata?.color || 'primary'">{{ link.icon || 'mdi-link-variant' }}</v-icon>
                        </div>
                      </div>
                      
                      <!-- List Layout (Vertical) -->
                      <div v-else class="links-list-tiny">
                        <div v-for="link in profile.actionLinks" :key="link.id" class="link-item-tiny">
                          <v-icon size="16" :color="link.metadata?.color || 'primary'" class="mr-2">{{ link.icon || 'mdi-link-variant' }}</v-icon>
                          <span class="text-truncate" style="font-size: 11px;">{{ link.title }}</span>
                        </div>
                      </div>
                    </div>

                  <div class="flip-prompt mt-auto opacity-40">
                    <v-icon size="12" class="mr-1">mdi-rotate-3d-variant</v-icon>
                    <span class="text-tiny">翻轉查看數據</span>
                  </div>
                </div>
              </div>
            </div> <!-- end card-front -->

            <!-- ── BACK SIDE ── -->
            <div class="card-back">
              <div class="phone-content-back h-100 d-flex flex-column align-center justify-center">
                <!-- Back Face -->
                <div :class="['back-face glass-card-mockup w-100 h-100 d-flex flex-column align-center', `theme-${profile.theme}`]">
                  <!-- Stats Area -->
                  <div class="w-100 mb-8 mt-2">
                    <div class="glass-stats-compact d-flex rounded-xl overflow-hidden py-4 border-white-10">
                      <div class="flex-grow-1 border-e border-white-10">
                        <div class="text-h6 font-weight-black text-white">{{ profile.interactiveStats?.matchScore || 88 }}%</div>
                        <div class="text-caption text-white opacity-60 font-weight-black">契合度</div>
                      </div>
                      <div class="flex-grow-1 border-e border-white-10">
                        <div class="text-h6 font-weight-black text-white">{{ profile.interactiveStats?.likes || 0 }}</div>
                        <div class="text-caption text-white opacity-60 font-weight-black">喜歡</div>
                      </div>
                      <div class="flex-grow-1">
                        <div class="text-h6 font-weight-black text-white">{{ profile.interactiveStats?.followers || 0 }}</div>
                        <div class="text-caption text-white opacity-60 font-weight-black">追蹤</div>
                      </div>
                    </div>
                  </div>

                  <!-- Branding Centerpiece -->
                  <div class="branding-ring mb-8">
                     <v-icon size="32" color="white" class="opacity-20">mdi-face-recognition</v-icon>
                  </div>

                  <!-- Social Row - Centered & Naked -->
                  <div class="social-row-naked d-flex justify-center flex-wrap gap-4 mb-4">
                    <v-btn
                      v-for="social in (profile.socialLinks || [])"
                      :key="social.platform"
                      icon
                      :color="social.color"
                      variant="text"
                      size="48"
                      class="social-btn-naked-preview"
                    >
                      <v-icon size="24">{{ social.icon }}</v-icon>
                    </v-btn>
                  </div>

                <div class="branding-badge-premium mt-auto">
                  <v-icon size="12" class="mr-1" color="primary">mdi-rocket-launch</v-icon>
                  <span class="font-weight-black letter-spacing-2">POMATCH</span>
                </div>
              </div> <!-- end back-face -->
            </div> <!-- end phone-content-back -->
          </div> <!-- end card-back -->
        </div> <!-- end card-inner -->
      </div> <!-- end card-perspective -->

        <!-- Grain Overlay -->
        <div 
          v-if="profile.themeConfig?.grainOpacity" 
          class="phone-grain-overlay"
          :style="{ opacity: profile.themeConfig.grainOpacity }"
        ></div>
      </div> <!-- end phone-screen -->
    </div> <!-- end phone-frame -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useProfileStore } from '~/stores/profile'

const store = useProfileStore()
const profile = computed(() => store.profile)

// Simplify to use store as single source of truth
const isFlipped = computed({
  get: () => store.currentFlipSide === 'back',
  set: (val: boolean) => {
    console.log('[PoMatch Debug] StudioPreview: Setting flip side to', val ? 'back' : 'front')
    store.currentFlipSide = val ? 'back' : 'front'
  }
})

const devices = [
  { name: 'iPhone SE', width: 280, height: 560 },
  { name: 'iPhone 14 Pro', width: 320, height: 640 },
  { name: 'iPad mini', width: 400, height: 600 }
]
const deviceIndex = ref('1')
const deviceStyle = computed(() => {
  const d = devices[Number(deviceIndex.value)] || devices[1]
  return {
    width: (d?.width || 320) + 'px',
    height: (d?.height || 640) + 'px',
    transition: 'width 0.3s ease, height 0.3s ease'
  }
})
</script>

<style scoped>
.studio-preview-device {
  display: flex;
  flex-direction: column;
  align-items: center;
  perspective: 1000px;
}

.phone-frame {
  position: relative;
  background: #111;
  border-radius: 44px;
  padding: 10px;
  box-shadow: 0 50px 100px -20px rgba(0,0,0,0.5);
  overflow: hidden;
}

.phone-screen {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f8fafc;
  border-radius: 36px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.phone-notch {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 25px;
  background: #111;
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
  z-index: 10;
}

.phone-aurora {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
  z-index: 1;
}

.card-perspective {
  perspective: 2000px;
  width: 100%;
  height: 100%;
  padding: 16px;
  z-index: 5;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
}

.card-perspective.is-flipped .card-inner { transform: rotateY(180deg); }
.card-perspective.is-flipped.is-vertical .card-inner { transform: rotateX(180deg); }

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.card-back { transform: rotateY(180deg); }
.card-perspective.is-vertical .card-back { transform: rotateX(180deg); }

.glass-card-mockup {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 36px;
  box-shadow: 0 40px 80px -20px rgba(0,0,0,0.3);
}

.back-face {
  background: rgba(255, 255, 255, 0.6) !important;
  border-color: rgba(255, 255, 255, 0.4);
}

.phone-name { font-size: 1.1rem; font-weight: 900; }
.phone-desc { font-size: 0.7rem; opacity: 0.8; }
.text-tiny { font-size: 10px; }
.zoom-70 { transform: scale(0.7); }
.zoom-80 { transform: scale(0.8); }
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.social-icon-btn {
  border-radius: 50% !important;
  transition: transform 0.3s ease;
}

.interest-tag-tiny {
  font-size: 8px;
  color: #6366f1;
  font-weight: 800;
  opacity: 0.7;
}

.links-bento-tiny {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.link-bento-pill-tiny {
  background: white;
  border-radius: 12px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(0,0,0,0.03);
}

.link-bento-pill-tiny.wide {
  grid-column: span 2;
  flex-direction: row;
  padding: 10px;
}

.phone-bio-tiny {
  font-size: 9px;
  line-height: 1.3;
  color: #64748b;
  opacity: 0.9;
}

.links-grid-naked-preview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 4px 0;
}

.link-grid-item-naked-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  border-radius: 8px;
  background: rgba(var(--v-theme-primary), 0.04);
}

.links-divider-minimal {
  width: 30px;
  height: 3px;
  margin: 0 auto 12px;
  background: rgba(var(--v-theme-primary), 0.2);
  border-radius: 99px;
}

.link-item-naked-preview {
  display: flex;
  align-items: center;
  padding: 8px 4px;
  border-bottom: 1px solid rgba(0,0,0,0.03);
}

.link-title-tiny { font-size: 0.75rem; color: #1e293b; }

.branding-badge-premium {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 99px;
  font-size: 8px;
  color: white;
  opacity: 0.6;
}

.letter-spacing-2 { letter-spacing: 2px; }

.glass-stats-compact {
  background: transparent;
}

.branding-ring {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-btn-naked-preview {
  transition: transform 0.3s ease;
}

.social-btn-naked-preview:hover {
  transform: scale(1.2);
}

.custom-scrollbar::-webkit-scrollbar { width: 2px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }

.phone-links-container.layout-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.phone-links-container.layout-carousel {
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding-bottom: 8px;
  scroll-snap-type: x mandatory;
}

.phone-links-container.layout-carousel::-webkit-scrollbar {
  display: none;
}

.carousel-item {
  flex: 0 0 140px;
  scroll-snap-align: center;
}

.grid-item {
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding: 12px 8px;
}
</style>
