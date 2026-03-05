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
                class="phone-content-front d-flex flex-column align-center justify-center h-100 pa-6"
                :style="{ gap: `${profile.themeConfig?.contentGap || 16}px` }"
              >
                <div :class="['glass-card-mockup front-face pa-6 w-100 text-center d-flex flex-column h-100', profile.theme]">
                  <div class="d-flex justify-end mb-n4">
                    <v-chip size="x-small" color="success" variant="flat" class="text-caption font-weight-bold zoom-70">
                      <v-icon start size="8">mdi-circle</v-icon>
                      在線上
                    </v-chip>
                  </div>

                  <div class="d-flex align-center gap-4 mb-4">
                    <v-avatar size="60" class="phone-avatar-border elevation-10">
                      <v-img :src="profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`"></v-img>
                    </v-avatar>
                    <div class="text-left">
                      <h1 
                        class="phone-name mb-0"
                        :style="{ transform: `scale(${profile.themeConfig?.nameScale || 1.1})`, transformOrigin: 'left' }"
                      >
                        {{ profile.name || '@' + profile.username }}
                      </h1>
                      <div class="d-flex gap-1 mt-1">
                        <v-chip size="x-small" variant="tonal" color="primary" class="zoom-80 px-1">{{ profile.persona?.mbti }}</v-chip>
                        <v-chip size="x-small" variant="tonal" color="secondary" class="zoom-80 px-1">{{ profile.persona?.zodiac }}</v-chip>
                      </div>
                    </div>
                  </div>
                  


                  <!-- Social Icons Row -->
                  <div v-if="profile.socialLinks?.length" class="social-icons-front d-flex justify-center gap-2 mb-3">
                    <v-btn
                      v-for="social in (profile.socialLinks || [])"
                      :key="social.platform"
                      icon
                      :color="social.color"
                      variant="flat"
                      size="30"
                      class="social-icon-btn elevation-3"
                    >
                      <v-icon size="16">{{ social.icon }}</v-icon>
                    </v-btn>
                  </div>

                  <!-- Links on Front (always list mode) -->
                  <div class="links-divider mb-3"></div>
                  <div class="flex-grow-1 overflow-y-auto custom-scrollbar pr-1">
                    <div v-if="profile.actionLinks?.length" class="links-list-clean">
                      <div 
                        v-for="link in profile.actionLinks" 
                        :key="link.id" 
                        class="mb-3"
                      >
                        <BlockProductGrid 
                          v-if="link.metadata?.block_type === 'product_grid'"
                          :title="link.title"
                          :items="link.metadata?.items"
                        ></BlockProductGrid>

                        <BlockSchedule
                          v-else-if="link.metadata?.block_type === 'schedule_list'"
                          :title="link.title"
                          :days="link.metadata?.days"
                        ></BlockSchedule>

                        <BlockService
                          v-else-if="link.metadata?.block_type === 'service_card'"
                          :title="link.title"
                          :details="link.metadata?.details"
                          :tag="link.metadata?.tag"
                        ></BlockService>

                        <div
                          v-else
                          class="phone-link-btn"
                          :style="getLinkStyle(link)"
                        >
                          <div class="link-icon-wrap" :style="{ '--icon-color': link.metadata?.color || '#6366f1' }">
                            <v-icon size="14" color="white">{{ link.icon || 'mdi-link-variant' }}</v-icon>
                          </div>
                          <span class="link-title-text font-weight-bold text-truncate">{{ link.title }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="flip-prompt mt-2 opacity-40">
                    <v-icon size="12" class="mr-1">mdi-rotate-3d-variant</v-icon>
                    <span class="text-tiny">翻轉查看數據</span>
                  </div>
                </div>
              </div>
            </div> <!-- end card-front -->

            <!-- ── BACK SIDE ── -->
            <div class="card-back">
              <div class="phone-content-back h-100 pa-6 d-flex flex-column justify-center align-center text-center">
                <!-- Stats Row -->
                <div class="mb-6 bg-white-opacity-10 rounded-xl py-4 w-100 stats-row-premium border-white-10 d-flex text-center">
                  <div class="flex-grow-1">
                    <div class="text-subtitle-1 font-weight-black text-white">88%</div>
                    <div class="text-tiny text-white opacity-70 uppercase">契合度</div>
                  </div>
                  <div class="flex-grow-1 border-s border-e border-white-10">
                    <div class="text-subtitle-1 font-weight-black text-white">{{ profile.interactiveStats?.likes || 0 }}</div>
                    <div class="text-tiny text-white opacity-70 uppercase">喜歡</div>
                  </div>
                  <div class="flex-grow-1">
                    <div class="text-subtitle-1 font-weight-black text-white">{{ profile.interactiveStats?.followers || 0 }}</div>
                    <div class="text-tiny text-white opacity-70 uppercase">追蹤</div>
                  </div>
                </div>

                <!-- Simulation Chip/Stripe -->
                <div class="mb-8 w-100 d-flex justify-end opacity-20">
                  <div class="bg-white rounded-md" style="width: 50px; height: 35px;"></div>
                </div>

                <!-- Social Minimal - Center aligned on back -->
                <div class="social-row-back d-flex justify-center flex-wrap gap-4 mb-4">
                  <v-btn
                    v-for="social in (profile.socialLinks || [])"
                    :key="social.platform"
                    icon
                    :color="social.color"
                    variant="flat"
                    size="44"
                    class="elevation-8"
                  >
                    <v-icon size="22">{{ social.icon }}</v-icon>
                  </v-btn>
                </div>

                <div class="branding-badge mt-auto">
                  <v-icon size="10" class="mr-1">mdi-rocket-launch</v-icon>
                  POWERED BY POMATCH
                </div>
              </div> <!-- end BACK content -->
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
import BlockProductGrid from '~/components/profile/blocks/BlockProductGrid.vue'
import BlockSchedule from '~/components/profile/blocks/BlockSchedule.vue'
import BlockService from '~/components/profile/blocks/BlockService.vue'

const store = useProfileStore()
const profile = computed(() => store.profile)
const isFlipped = ref(store.currentFlipSide === 'back')

watch(() => store.currentFlipSide, (side) => {
  isFlipped.value = (side === 'back')
})

watch(isFlipped, (flipped) => {
  store.currentFlipSide = flipped ? 'back' : 'front'
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

const getLinkStyle = (link: any) => {
  const cfg = profile.value?.themeConfig
  const style: any = {
    borderRadius: `${cfg?.linkRadius || 24}px`,
  }
  if (link.metadata?.color) {
    if ((cfg?.linkLayout || 'list') === 'list') {
      style.borderLeft = `3px solid ${link.metadata.color}`
    } else {
      style.background = `${link.metadata.color}15`
      style.border = `1px solid ${link.metadata.color}33`
    }
  }
  return style
}
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
  width: 94%;
  height: 82%;
  margin: 20px auto;
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
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 24px;
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.2);
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

.links-divider {
  width: 50%;
  height: 1px;
  margin: 0 auto;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
}

.links-list-clean {
  display: flex;
  flex-direction: column;
}

.phone-link-btn {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(6px);
  padding: 10px 12px;
  display: flex;
  align-items: center;
  border-radius: 14px;
  font-size: 0.7rem;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.phone-link-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.12);
}

.link-icon-wrap {
  width: 32px;
  height: 32px;
  min-width: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--icon-color), color-mix(in srgb, var(--icon-color) 70%, #ec4899));
  box-shadow: 0 3px 8px color-mix(in srgb, var(--icon-color) 35%, transparent);
  margin-right: 10px;
}

.link-title-text {
  color: #1e293b;
  flex: 1;
  min-width: 0;
}

.branding-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background: white;
  border-radius: 99px;
  font-size: 8px;
  letter-spacing: 1px;
  font-weight: 900;
  color: #64748b;
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
