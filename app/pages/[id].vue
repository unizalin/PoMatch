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
              <div :class="['glass-card-premium px-6 py-8 w-100 h-100 text-center card-reveal premium-blur overflow-hidden d-flex flex-column', profile.theme, { 'wallet-card': isWalletMode }]">
                <!-- Status -->
                <div class="d-flex justify-end mb-n6">
                  <v-chip size="x-small" color="success" variant="flat" class="text-caption font-weight-black pulse-indicator">
                    <v-icon start size="10">mdi-circle</v-icon>
                    在線上
                  </v-chip>
                </div>

                <div class="d-flex align-center gap-6 mb-6 mt-4">
                  <v-avatar 
                    size="80" 
                    class="avatar-border-premium elevation-24"
                    :style="{ 
                      borderWidth: `${profile.themeConfig?.profileBorderWidth || 4}px`,
                      borderRadius: `${profile.themeConfig?.profileBorderRadius || 50}%`
                    }"
                  >
                    <v-img :src="profile.avatar"></v-img>
                  </v-avatar>
                  <div class="text-left">
                    <h1 
                      class="text-h4 font-weight-black mb-1 text-slate-900 letter-spacing-tight"
                      :style="{ transform: `scale(${profile.themeConfig?.nameScale || 1.1})`, transformOrigin: 'left' }"
                    >
                      {{ profile.name }}
                    </h1>
                    <div class="d-flex gap-2">
                       <v-chip variant="tonal" size="small" color="indigo-accent-2" class="font-weight-black">{{ profile.persona.mbti }}</v-chip>
                       <v-chip variant="tonal" size="small" color="deep-purple-accent-2" class="font-weight-black">{{ profile.persona.zodiac }}</v-chip>
                    </div>
                  </div>
                </div>
                


                <!-- Social Icons Row -->
                <div v-if="profile.socialLinks?.length" class="social-icons-front d-flex justify-center gap-3 mb-5">
                  <v-btn
                    v-for="social in profile.socialLinks"
                    :key="social.platform"
                    icon
                    :color="social.color"
                    variant="flat"
                    size="42"
                    class="social-icon-btn elevation-4"
                    @click.stop="openLink(social.url)"
                  >
                    <v-icon size="22">{{ social.icon }}</v-icon>
                  </v-btn>
                </div>

                <!-- Action Links on Front (always list mode) -->
                <div class="links-section-divider mb-4"></div>
                <div class="flex-grow-1 overflow-hidden d-flex flex-column">
                  <div class="back-scroll-area flex-grow-1 pr-1 custom-scrollbar overflow-y-auto">
                    <div v-if="profile.actionLinks?.length" class="links-list-clean">
                      <div 
                        v-for="link in profile.actionLinks" 
                        :key="link.id" 
                        class="mb-3 w-100"
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
                          class="link-item-premium"
                          :style="getLinkStyle(link)"
                          @click.stop="recordClick(link.id); openLink(link.url)"
                        >
                          <div class="link-icon-wrap" :style="{ '--icon-color': link.metadata?.color || '#6366f1' }">
                            <v-icon size="20" color="white">{{ link.icon || 'mdi-link-variant' }}</v-icon>
                          </div>
                          <span class="link-title-text font-weight-bold text-truncate">{{ link.title }}</span>
                          <v-icon size="16" class="link-chevron">mdi-chevron-right</v-icon>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flip-hint mt-auto opacity-50 text-center">
                  <v-icon size="14" class="mr-2">mdi-rotate-3d-variant</v-icon>
                  <span class="text-caption font-weight-bold">翻轉查看數據</span>
                </div>
              </div>
            </div> <!-- end card-front -->

            <!-- ── BACK SIDE ── -->
            <div class="card-back">
              <div :class="['glass-card-premium px-8 py-10 w-100 h-100 card-reveal premium-blur overflow-hidden d-flex flex-column align-center', profile.theme]">
                <!-- Stats Area -->
                <div class="w-100 mb-10 mt-6">
                  <div class="glass-stats-row border-light d-flex rounded-2xl overflow-hidden py-6 bg-white-opacity-5">
                    <div class="flex-grow-1 border-end text-center">
                      <div class="text-h4 font-weight-black text-indigo-accent-2">{{ displayScore }}%</div>
                      <div class="text-caption text-slate-400 font-weight-black uppercase">契合度</div>
                    </div>
                    <div class="flex-grow-1 border-end text-center">
                      <div class="text-h4 font-weight-black text-slate-800">{{ formatNumber(profile.interactiveStats.likes) }}</div>
                      <div class="text-caption text-slate-400 font-weight-black uppercase">喜歡</div>
                    </div>
                    <div class="flex-grow-1 text-center">
                      <div class="text-h4 font-weight-black text-slate-800">{{ formatNumber(profile.interactiveStats.followers) }}</div>
                      <div class="text-caption text-slate-400 font-weight-black uppercase">追蹤</div>
                    </div>
                  </div>
                </div>

                <!-- Simulation Chip/Stripe -->
                <div class="mb-10 w-100 d-flex justify-end opacity-20 px-4">
                  <div class="bg-indigo-accent-1 rounded-md" style="width: 60px; height: 40px;"></div>
                </div>

                <!-- Social Center Row -->
                <div class="social-row-premium d-flex justify-center flex-wrap gap-6 mb-12">
                  <v-btn
                    v-for="social in (profile.socialLinks || [])"
                    :key="social.platform"
                    icon
                    :color="social.color"
                    variant="flat"
                    size="56"
                    class="social-btn-premium elevation-12"
                  >
                    <v-icon size="28">{{ social.icon }}</v-icon>
                  </v-btn>
                </div>

                <div class="branding-pill mt-auto">
                  <v-icon size="14" class="mr-2" color="primary">mdi-rocket-launch</v-icon>
                  <span class="font-weight-black uppercase">POWERED BY POMATCH</span>
                </div>
              </div> <!-- end glass BACK -->
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

const isFlipped = ref(false)
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
  await store.recordClick(linkId)
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
  if (profile.value) store.incrementLike(profile.value.id)
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
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.card-back {
  transform: rotateY(180deg);
}

.card-perspective.is-vertical .card-back {
  transform: rotateX(180deg);
}

.glass-card-premium {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  border-radius: 40px;
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

.social-icon-btn {
  border-radius: 50% !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.social-icon-btn:hover {
  transform: scale(1.15) translateY(-2px);
}

.links-section-divider {
  width: 60%;
  height: 1px;
  margin: 0 auto;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.2), transparent);
}

.links-list-clean {
  display: flex;
  flex-direction: column;
}

.link-item-premium {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.link-item-premium:hover {
  transform: translateY(-3px) scale(1.01);
  background: white;
  box-shadow: 0 12px 28px rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.2);
}

.link-item-premium:active {
  transform: translateY(-1px) scale(0.99);
}

.link-icon-wrap {
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--icon-color), color-mix(in srgb, var(--icon-color) 70%, #ec4899));
  box-shadow: 0 4px 12px color-mix(in srgb, var(--icon-color) 40%, transparent);
  margin-right: 14px;
  transition: transform 0.3s ease;
}

.link-item-premium:hover .link-icon-wrap {
  transform: scale(1.08) rotate(-3deg);
}

.link-title-text {
  font-size: 0.95rem;
  line-height: 1.3;
  color: #1e293b;
  flex: 1;
  min-width: 0;
}

.link-chevron {
  color: #cbd5e1;
  transition: transform 0.3s ease, color 0.3s ease;
  flex-shrink: 0;
}

.link-item-premium:hover .link-chevron {
  color: #6366f1;
  transform: translateX(3px);
}


</style>
