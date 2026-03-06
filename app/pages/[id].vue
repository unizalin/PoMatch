<template>
  <div :class="['profile-container d-flex flex-column align-center', `theme-${profile.theme}`, { 'is-wallet-mode': isWalletMode }]">
    <!-- Aurora Background -->
    <div 
      v-if="profile?.themeConfig"
      class="aurora-bg"
      :style="{ 
        opacity: profile.themeConfig.auroraIntensity,
        filter: `blur(${profile.themeConfig.glassIntensity}px)`
      }"
    ></div>

    <!-- Grain Overlay -->
    <div 
      v-if="profile?.themeConfig?.grainOpacity" 
      class="grain-overlay"
      :style="{ opacity: profile.themeConfig.grainOpacity }"
    ></div>

    <v-fade-transition>
      <div v-if="profile" class="profile-card-wrapper w-100">
        <!-- 3D Perspective Container -->
        <div 
          class="card-perspective" 
          :class="{ 
            'is-flipped': isFlipped, 
            'is-vertical': profile.themeConfig?.flipDirection === 'vertical',
            'no-flip': !profile.themeConfig?.cardMode
          }"
          @click="handleFlip"
        >
          <div class="card-inner">
            <!-- ── FRONT SIDE ── -->
            <div class="card-front">
              <div :class="['glass-card-premium px-8 py-10 w-100 h-100 card-reveal overflow-hidden d-flex flex-column', profile.theme]">
                <!-- Status -->
                <div class="d-flex justify-end mb-n6">
                  <v-chip size="x-small" color="success" variant="flat" class="text-caption font-weight-black pulse-indicator">
                    <v-icon start size="10">mdi-circle</v-icon>
                    在線上
                  </v-chip>
                </div>

                <!-- Shared Content Container (Centered + Offset) -->
                <div class="card-content-front flex-grow-1 d-flex flex-column justify-center align-center">
                  <div class="profile-hero-section d-flex flex-column align-center gap-6 mt-4 mb-8 text-center">
                    <div 
                      class="avatar-container-premium"
                      :style="{ 
                        transform: `translate(${profile.themeConfig?.avatarOffset || 0}px, ${profile.themeConfig?.vOffset || 0}px)` 
                      }"
                    >
                      <v-avatar 
                        size="90" 
                        class="avatar-border-premium elevation-24"
                        :style="{ 
                          borderWidth: `${profile.themeConfig?.profileBorderWidth || 4}px`,
                          borderRadius: `${profile.themeConfig?.profileBorderRadius || 50}%`
                        }"
                      >
                        <v-img :src="profile.avatar"></v-img>
                      </v-avatar>
                    </div>

                    <div 
                      class="text-center w-100"
                      :style="{ 
                        transform: `translate(${profile.themeConfig?.textOffset || 0}px, ${profile.themeConfig?.textVOffset || 0}px)` 
                      }"
                    >
                      <h1 
                        class="text-h4 font-weight-black mb-4 text-slate-900 letter-spacing-tight"
                        :style="{ 
                          transform: `scale(${profile.themeConfig?.nameScale || 1.1})`, 
                          transformOrigin: 'center'
                        }"
                      >
                        {{ profile.name || '@' + profile.username }}
                      </h1>
                      
                      <!-- Identity DNA -->
                      <div class="d-flex flex-wrap justify-center gap-2 mb-4">
                         <v-chip variant="tonal" size="x-small" color="indigo-accent-2" class="font-weight-black profile-dna-chip">
                           <v-icon start size="12">mdi-dna</v-icon>{{ profile.persona.mbti }}
                         </v-chip>
                         <v-chip variant="tonal" size="x-small" color="deep-purple-accent-2" class="font-weight-black profile-dna-chip">
                           <v-icon start size="12">mdi-zodiac-cancer</v-icon>{{ profile.persona.zodiac }}
                         </v-chip>
                      </div>

                      <!-- Interest Tags -->
                      <div v-if="profile.persona?.tags?.length" class="d-flex flex-wrap justify-center gap-3 mb-6">
                        <span v-for="tag in profile.persona.tags" :key="tag" class="interest-tag-mini text-uppercase">
                          #{{ tag }}
                        </span>
                      </div>

                      <!-- Bio Description -->
                      <p v-if="profile.description" class="profile-bio-text mb-0 opacity-80 font-weight-medium line-clamp-2">
                        {{ profile.description }}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Social Icons Row -->
                  <div v-if="profile.socialLinks?.length" class="social-icons-front d-flex justify-center gap-3 mb-5">
                    <v-btn
                      v-for="social in profile.socialLinks"
                      :key="social.platform"
                      icon
                      :color="social.color"
                      variant="text"
                      size="48"
                      class="social-icon-btn-clean"
                      @click.stop="openLink(social.url)"
                    >
                      <v-icon size="28">{{ social.icon }}</v-icon>
                    </v-btn>
                  </div>

                  <!-- Action Links -->
                  <div class="links-section-minimal mb-4"></div>
                  <div class="overflow-hidden d-flex flex-column" style="max-height: 300px;">
                    <div class="back-scroll-area pr-1 custom-scrollbar overflow-y-auto">
                      <div v-if="profile.themeConfig?.linkLayout === 'bento'" class="links-grid-bento">
                        <div 
                          v-for="(link, index) in profile.actionLinks" 
                          :key="link.id"
                          class="link-bento-item"
                          :class="{ 'bento-wide': index % 3 === 0 }"
                          :style="getLinkStyle(link)"
                          @click.stop="recordClick(link.id); openLink(link.url)"
                        >
                          <v-icon :size="index % 3 === 0 ? 32 : 24" :color="link.metadata?.color || 'primary'">{{ link.icon || 'mdi-link-variant' }}</v-icon>
                          <div class="link-bento-content">
                            <div class="link-bento-title">{{ link.title }}</div>
                            <div v-if="index % 3 === 0 && link.url && link.url !== '#'" class="link-bento-url opacity-40">{{ link.url }}</div>
                          </div>
                        </div>
                      </div>
                      <div v-else-if="profile.themeConfig?.linkLayout === 'grid'" class="links-grid-naked">
                        <div 
                          v-for="(link, index) in profile.actionLinks" 
                          :key="link.id"
                          class="link-grid-item-naked"
                          @click.stop="recordClick(link.id); openLink(link.url)"
                        >
                          <v-icon size="32" :color="link.metadata?.color || 'primary'">{{ link.icon || 'mdi-link-variant' }}</v-icon>
                          <span class="link-grid-title-naked mt-1 text-truncate">{{ link.title }}</span>
                        </div>
                      </div>
                      <div v-else class="links-list-naked">
                        <div 
                          v-for="(link, index) in profile.actionLinks" 
                          :key="link.id"
                          class="link-item-naked"
                          @click.stop="recordClick(link.id); openLink(link.url)"
                        >
                          <div class="link-icon-naked">
                            <v-icon size="24" :color="link.metadata?.color || 'primary'">{{ link.icon || 'mdi-link-variant' }}</v-icon>
                          </div>
                          <div class="link-content-naked">
                            <div class="link-title-naked">{{ link.title }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flip-hint mt-auto opacity-50 text-center pb-2">
                  <v-icon size="14" class="mr-2">mdi-rotate-3d-variant</v-icon>
                  <span class="text-caption font-weight-bold">翻轉查看數據</span>
                </div>
              </div>
            </div> <!-- end card-front -->

            <!-- ── BACK SIDE ── -->
            <div class="card-back">
              <div :class="['glass-card-premium px-8 py-10 w-100 h-100 card-reveal premium-blur d-flex flex-column align-center justify-center', profile.theme]">
                <!-- Stats Area -->
                <div class="w-100 mb-12">
                  <div class="glass-stats-minimal d-flex justify-space-around py-8">
                    <div class="text-center">
                      <div class="text-h4 font-weight-black text-slate-900 mb-1">{{ profile.interactiveStats?.matchScore || 88 }}%</div>
                      <div class="text-caption font-weight-bold text-slate-500 uppercase letter-spacing-1">契合度</div>
                    </div>
                    <div class="stats-divider"></div>
                    <div class="text-center">
                      <div class="text-h4 font-weight-black text-slate-900 mb-1">{{ profile.interactiveStats?.likes || 0 }}</div>
                      <div class="text-caption font-weight-bold text-slate-500 uppercase letter-spacing-1">喜歡</div>
                    </div>
                    <div class="stats-divider"></div>
                    <div class="text-center">
                      <div class="text-h4 font-weight-black text-slate-900 mb-1">{{ profile.interactiveStats?.followers || 0 }}</div>
                      <div class="text-caption font-weight-bold text-slate-500 uppercase letter-spacing-1">追蹤</div>
                    </div>
                  </div>
                </div>

                <!-- Branding Centerpiece -->
                <div class="branding-ring-premium mb-12">
                   <div class="ring-outer pulse-slow"></div>
                   <div class="ring-inner">
                     <v-icon size="48" color="primary" class="opacity-40">mdi-face-recognition</v-icon>
                   </div>
                </div>

                <!-- Social Row - Centered & Premium -->
                <div class="social-row-naked d-flex justify-center flex-wrap gap-6 mb-8">
                  <v-btn
                    v-for="social in (profile.socialLinks || [])"
                    :key="social.platform"
                    icon
                    :color="social.color"
                    variant="text"
                    size="56"
                    class="social-btn-premium transition-bounce"
                    @click.stop="openLink(social.url)"
                  >
                    <v-icon size="32">{{ social.icon }}</v-icon>
                  </v-btn>
                </div>

                <div class="branding-pill mt-auto">
                  <v-icon size="14" class="mr-2" color="primary">mdi-rocket-launch</v-icon>
                  <span class="font-weight-black">POMATCH</span>
                </div>
              </div>
            </div> <!-- end card-back -->
          </div> <!-- end card-inner -->
        </div> <!-- end card-perspective -->


      </div> <!-- end card-wrapper -->
    </v-fade-transition>

    <!-- Dialog -->
    <v-dialog v-model="showQR" max-width="320">
      <v-card class="rounded-xl pa-6 text-center">
        <h3 class="font-weight-black mb-4">掃描分享名片</h3>
        <div class="qr-placeholder mx-auto mb-4 d-flex align-center justify-center rounded-xl bg-grey-lighten-4" style="aspect-ratio: 1; width: 200px">
          <v-icon size="100" color="grey-lighten-1">mdi-qrcode</v-icon>
        </div>
        <p class="text-caption text-grey-darken-1 mb-6">讓對方直接掃描 QR Code 即可開啟你的 PoMatch 名片</p>
        <v-btn block color="primary" class="rounded-pill" @click="showQR = false">關閉</v-btn>
      </v-card>
    </v-dialog>
  </div> <!-- end profile-container -->
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProfileStore } from '~/stores/profile'
import { downloadVCard } from '~/utils/vcard'
import BlockProductGrid from '~/components/profile/blocks/BlockProductGrid.vue'
import BlockSchedule from '~/components/profile/blocks/BlockSchedule.vue'
import BlockService from '~/components/profile/blocks/BlockService.vue'

/**
 * ── 同步與預覽規則 (Synchronization Rules) ──
 * 1. 狀態來源：此頁面使用 useProfileStore 作為單一真理來源 (Single Source of Truth)。
 * 2. 即時預覽：當在 Studio 管理介面修改主題、按鈕樣式或個人資訊時，Store 中的 profile 數據會同步更新。
 * 3. 翻轉聯動：isFlipped 現在連結至 store.currentFlipSide，確保 Studio 預覽點擊翻轉時，
 *    如果此頁面在同一個 Session (如 Iframe 或開發模式) 中開啟，兩邊會保持同步。
 * 4. 數據持久化：Studio 的變更會透過 debouncedUpdateProfile 寫入資料庫，此頁面重新整理後會讀取最新狀態。
 */

const RESERVED_PATHS = ['confirm', 'login', 'register', 'explore', 'admin']
definePageMeta({
  middleware: (to) => {
    const id = String(to.params.id || '')
    if (RESERVED_PATHS.includes(id)) {
      return navigateTo('/' + id, { replace: true })
    }
  }
})

const store = useProfileStore()
const profile = computed(() => store.profile)

useSeoMeta({
  title: () => profile.value ? `${profile.value.name} | PoMatch` : 'PoMatch 數位名片',
  ogTitle: () => profile.value ? `${profile.value.name} | PoMatch` : 'PoMatch 數位名片',
  description: () => profile.value ? `我是 ${profile.value.name}，這是我在 PoMatch 的數位名片。` : 'PoMatch 數位名片'
})

const isFlipped = computed({
  get: () => store.currentFlipSide === 'back',
  set: (val: boolean) => {
    store.currentFlipSide = val ? 'back' : 'front'
  }
})
const isWalletMode = ref(false)
const showQR = ref(false)
const route = useRoute()
const userId = route.params.id as string
const notFound = ref(false)

const handleFlip = () => {
  if (profile.value?.themeConfig?.cardMode) {
    isFlipped.value = !isFlipped.value
  }
}

const displayScore = computed(() => Math.floor(75 + Math.random() * 20))

onMounted(async () => {
  if (!userId) { notFound.value = true; return }
  const { data } = await store.fetchProfile(userId)
  if (!data) notFound.value = true
})

const formatNumber = (num: number) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num || 0
}

const exportVCard = () => {
  if (profile.value) downloadVCard(profile.value)
}

const recordClick = async (linkId: string | number) => {
  await store.recordClick(linkId);
}

const openLink = (url: string) => {
  if (!url || url === '#') return
  window.open(url, '_blank')
}

const getLinkStyle = (link: any) => {
  const cfg = profile.value?.themeConfig
  const style: any = {
    borderRadius: `${cfg?.linkRadius || 24}px`,
    marginBottom: (cfg?.linkLayout === 'grid') ? '0' : `${cfg?.linkGap || 16}px`
  }
  if (link.metadata?.color) {
    if ((cfg?.linkLayout || 'list') === 'list') {
      style.border = `1px solid ${link.metadata.color}44`
      style.borderLeft = `4px solid ${link.metadata.color}`
    } else {
      style.background = `${link.metadata.color}15`
      style.border = `1px solid ${link.metadata.color}33`
    }
  }
  return style
}

const onLike = () => {
  if (profile.value) store.incrementLike()
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow-x: hidden;
  background-color: #f8fafc;
}

.aurora-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
  z-index: 0;
  opacity: 0.15;
  filter: blur(80px);
}

.grain-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("https://grainy-gradients.vercel.app/noise.svg");
  opacity: 0.05;
  z-index: 1;
  pointer-events: none;
}

.profile-card-wrapper {
  position: relative;
  z-index: 2;
}

.card-perspective {
  perspective: 2000px;
  width: calc(100% - 32px);
  height: calc(100dvh - 32px);
  margin: 16px auto;
  cursor: pointer;
  position: relative;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
}

.card-perspective.is-flipped .card-inner {
  transform: rotateY(180deg);
}

.card-perspective.is-flipped.is-vertical .card-inner {
  transform: rotateX(180deg);
}

.card-front, .card-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transition: z-index 0s step-end 0.4s;
}
.card-front {
  z-index: 2;
  transform: rotateY(0deg);
}
.card-back {
  z-index: 1;
  transform: rotateY(180deg);
}
.card-perspective.is-flipped .card-front {
  z-index: 1;
}
.card-perspective.is-flipped .card-back {
  z-index: 2;
}
.card-perspective.is-vertical .card-back {
  transform: rotateX(180deg);
}

.glass-card-premium {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 48px;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.glass-card-premium.theme-dark {
  background: rgba(15, 23, 42, 0.4);
  border-color: rgba(255, 255, 255, 0.1);
}

.max-width-mobile {
  max-width: 420px;
}

.pulse-indicator {
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(74, 222, 128, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
}

.avatar-border-premium {
  padding: 8px;
  background: white;
  border: 4px solid rgba(99, 102, 241, 0.1);
}

.branding-pill {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: white;
  border-radius: 99px;
  font-size: 10px;
  letter-spacing: 2px;
  color: #64748b;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.links-container-premium.layout-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.links-container-premium.layout-carousel {
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding: 4px 4px 12px;
  scroll-snap-type: x mandatory;
}

.links-container-premium.layout-carousel::-webkit-scrollbar {
  display: none;
}

.carousel-item {
  flex: 0 0 200px;
  scroll-snap-align: center;
}

.grid-item {
  flex-direction: column;
  justify-content: center;
  text-align: center;
  aspect-ratio: 1;
}

.profile-dna-chip {
  letter-spacing: 0.05em;
  font-size: 10px !important;
  height: 22px !important;
}

.interest-tag-mini {
  font-size: 10px;
  color: #6366f1;
  font-weight: 700;
  opacity: 0.8;
}

.profile-bio-text {
  font-size: 0.85rem;
  line-height: 1.4;
  color: #475569;
}

.avatar-container-premium {
  position: relative;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.avatar-container-premium:hover {
  transform: scale(1.05) rotate(-3deg);
}

.links-grid-naked {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 8px 0;
}

.link-grid-item-naked {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 16px;
}

.link-grid-item-naked:hover {
  background: rgba(var(--v-theme-primary), 0.06);
  transform: translateY(-4px);
}

.link-grid-title-naked {
  font-size: 0.65rem;
  font-weight: 700;
  color: #64748b;
  width: 100%;
  text-align: center;
}

.links-section-minimal {
  width: 40px;
  height: 4px;
  margin: 0 auto 24px;
  background: rgba(var(--v-theme-primary), 0.2);
  border-radius: 99px;
}

.links-list-naked {
  display: flex;
  flex-direction: column;
}

.link-item-naked {
  padding: 16px 8px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 12px;
}

.link-item-naked:hover {
  background: rgba(var(--v-theme-primary), 0.04);
  transform: translateX(4px);
}

.link-title-text-naked {
  font-size: 1.05rem;
  color: #1e293b;
  letter-spacing: 0.5px;
}

.glass-stats-minimal {
  background: transparent;
}

.glow-text {
  text-shadow: 0 0 20px rgba(255,255,255,0.3);
}

.social-btn-naked {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.social-btn-naked:hover {
  transform: scale(1.3) rotate(5deg);
  filter: drop-shadow(0 0 10px currentColor);
}

.tracking-widest { letter-spacing: 0.2em; }
.letter-spacing-4 { letter-spacing: 4px; }

.border-white-10 { border-color: rgba(255,255,255,0.1) !important; }

/* Custom Scrollbar for clean look */
/* Bento Grid Styles */
.links-grid-bento {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 8px 0;
}

.link-bento-item {
  background: white;
  border-radius: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid rgba(0,0,0,0.03);
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.link-bento-item:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
  border-color: rgba(var(--v-theme-primary), 0.2);
}

.link-bento-item.bento-wide {
  grid-column: span 2;
  flex-direction: row;
  align-items: center;
  padding: 20px;
}

.link-bento-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: #1e293b;
}

.link-bento-url {
  font-size: 0.7rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }


</style>
