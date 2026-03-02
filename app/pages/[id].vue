<template>
  <div :class="['profile-container d-flex flex-column align-center pa-4', `theme-${profile.theme}`]">
    <!-- Aurora Background (Matching Studio) -->
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
      <div v-if="profile" :class="['glass-card-premium px-6 py-10 w-100 max-width-mobile text-center card-reveal premium-blur', profile.theme]">
        <!-- Status Indicator -->
        <div class="d-flex justify-end mb-n6">
          <v-chip size="x-small" color="success" variant="flat" class="text-caption font-weight-black pulse-indicator">
            <v-icon start size="10">mdi-circle</v-icon>
            在線上
          </v-chip>
        </div>

        <div class="avatar-container mb-6">
          <v-avatar 
            size="120" 
            class="avatar-border-premium elevation-24"
            :style="{ 
              borderWidth: `${profile.themeConfig?.profileBorderWidth || 4}px`,
              borderRadius: `${profile.themeConfig?.profileBorderRadius || 50}%`
            }"
          >
            <v-img :src="profile.avatar"></v-img>
            <!-- Profile Glow -->
            <div 
              class="avatar-glow-overlay"
              :style="{ opacity: profile.themeConfig?.profileGlow || 0 }"
            ></div>
          </v-avatar>
        </div>
        
        <h1 
          class="text-h4 font-weight-black mb-2 text-slate-900 letter-spacing-tight"
          :style="{ transform: `scale(${profile.themeConfig?.nameScale || 1})` }"
        >
          {{ profile.name }}
        </h1>
        <p class="text-body-1 text-slate-600 mb-6 px-4 font-weight-medium line-height-relaxed">{{ profile.description }}</p>

        <!-- Persona Flow Tags -->
        <div class="d-flex flex-wrap justify-center gap-2 mb-8">
          <v-chip variant="tonal" color="indigo-accent-2" class="font-weight-black px-4">{{ profile.persona.mbti }}</v-chip>
          <v-chip variant="tonal" color="deep-purple-accent-2" class="font-weight-black px-4">{{ profile.persona.zodiac }}</v-chip>
          <v-chip variant="tonal" color="pink-accent-2" class="font-weight-black px-4">📍 {{ profile.persona.location }}</v-chip>
        </div>

        <!-- Interactive Bento Stats -->
        <div class="bento-stats-container mb-10 px-2">
          <v-row no-gutters class="rounded-2xl overflow-hidden glass-stats-row border-light">
            <v-col cols="4" class="pa-4 border-end">
              <div class="text-h5 font-weight-black text-indigo-accent-4">{{ displayScore }}%</div>
              <div class="text-overline text-slate-400 font-weight-black">契合度</div>
            </v-col>
            <v-col cols="4" class="pa-4 border-end">
              <div class="text-h5 font-weight-black text-slate-800">{{ formatNumber(profile.interactiveStats.likes) }}</div>
              <div class="text-overline text-slate-400 font-weight-black">人喜歡</div>
            </v-col>
            <v-col cols="4" class="pa-4">
              <div class="text-h5 font-weight-black text-slate-800">{{ formatNumber(profile.interactiveStats.followers) }}</div>
              <div class="text-overline text-slate-400 font-weight-black">追蹤中</div>
            </v-col>
          </v-row>
        </div>

        <!-- Interests Tags -->
        <div class="d-flex flex-wrap justify-center gap-3 mb-10 px-4">
          <span v-for="tag in profile.persona.tags" :key="tag" class="interest-tag-premium font-weight-bold">
            # {{ tag }}
          </span>
        </div>

        <!-- Social Row -->
        <div class="social-row-premium d-flex justify-center mb-10">
          <v-btn
            v-for="social in (profile.socialLinks || [])"
            :key="social.platform"
            icon
            :color="social.color"
            variant="flat"
            size="large"
            class="social-btn-premium mx-3 elevated-1"
          >
            <v-icon size="24">{{ social.icon }}</v-icon>
          </v-btn>
        </div>

        <!-- Action Links (Multi-Layout Support) -->
        <div 
          :class="['links-container-premium px-2', `layout-${profile.themeConfig?.linkLayout || 'list'}`]"
          :style="{ gap: `${profile.themeConfig?.linkGap || 12}px` }"
        >
          <v-btn
            v-for="link in profile.actionLinks"
            :key="link.id"
            block
            variant="flat"
            class="premium-link-item hover-scale d-flex align-center"
            :class="[
              link.metadata?.animation ? `anim-${link.metadata.animation}` : '',
              profile.themeConfig?.linkLayout === 'grid' ? 'grid-item' : '',
              (profile.themeConfig?.linkLayout === 'grid' && link.metadata?.gridSpan === 'full') ? 'grid-full' : ''
            ]"
            :style="getLinkStyle(link)"
            :href="link.url"
            target="_blank"
            @click="store.recordClick(link.id)"
          >
            <!-- List Layout Content -->
            <div v-if="(profile.themeConfig?.linkLayout || 'list') === 'list'" class="d-flex align-center w-100 px-2 py-4">
              <div class="link-icon-circle mr-5" :style="{ background: link.metadata?.color || '' }">
                <v-icon size="20" color="white">{{ link.icon || 'mdi-link-variant' }}</v-icon>
              </div>
              <span class="flex-grow-1 text-left font-weight-black text-slate-800 text-h6" style="font-size: 1rem !important">{{ link.title }}</span>
              <v-icon size="medium" color="slate-300">mdi-chevron-right</v-icon>
            </div>

            <!-- Grid/Carousel Layout Content -->
            <div v-else class="grid-content-wrap py-6">
              <v-icon size="32" :color="link.metadata?.color || 'primary'" class="mb-2">{{ link.icon || 'mdi-link-variant' }}</v-icon>
              <div class="text-caption font-weight-black text-slate-800 text-truncate w-100">{{ link.title }}</div>
            </div>
          </v-btn>
        </div>

        <!-- Floating Action Button for Likes -->
        <div class="mt-12 d-flex justify-center">
          <v-btn
            icon
            color="red-lighten-5"
            class="like-btn-premium heartbeat"
            size="x-large"
            elevation="12"
            @click="onLike"
          >
            <v-icon color="red-accent-3" size="32">mdi-heart</v-icon>
          </v-btn>
        </div>

        <div class="mt-16 mb-2">
          <v-chip variant="flat" color="grey-lighten-4" size="small" class="px-6 branding-chip-premium font-weight-black">
            POWERED BY POMATCH
          </v-chip>
        </div>
      </div>
    </v-fade-transition>
  </div>
</template>

<script setup>
import { useProfileStore } from '~/stores/profile'

// Guard: reserved paths should NOT be handled by this dynamic [id] route
// This is a safety net in case routeRules SSR config doesn't fully prevent the conflict
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
  description: () => profile.value ? `我是 ${profile.value.name}，這是我在 PoMatch 的數位名片。我的 MBTI 是 ${profile.value.persona.mbti}，來自 ${profile.value.persona.location}。` : 'PoMatch 數位名片',
  ogDescription: () => profile.value ? `我是 ${profile.value.name}，這是我在 PoMatch 的數位名片。我的 MBTI 是 ${profile.value.persona.mbti}，來自 ${profile.value.persona.location}。` : 'PoMatch 數位名片',
  ogImage: () => profile.value?.avatar,
  twitterCard: 'summary_large_image',
})

const route = useRoute()
const userId = String(route.params.id || '')

const matchScore = ref(0)
const displayScore = ref(0)
const notFound = ref(false)

onMounted(async () => {
    // Always fetch fresh data from DB by URL username slug
    // (don't rely on store.profile which may have stale/different user's data)
    if (!userId) { notFound.value = true; return }

    const { data, error } = await store.fetchProfile(userId)
    if (error || !data) {
        notFound.value = true
        return
    }

    if (profile.value && store.calculateMatch) {
        matchScore.value = store.calculateMatch(profile.value.persona)
        const duration = 1500
        const start = Date.now()
        const animate = () => {
            const elapsed = Date.now() - start
            const progress = Math.min(elapsed / duration, 1)
            displayScore.value = Math.floor(progress * matchScore.value)
            if (progress < 1) requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
    }
})

const formatNumber = (num) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num
}

const onLike = () => {
  store.incrementLike()
  // Add haptic feedback or local animation logic here
}

const getLinkStyle = (link) => {
  const isGrid = profile.value.themeConfig?.linkLayout === 'grid'
  const style = {
    borderRadius: `${profile.value.themeConfig?.linkRadius || 24}px`,
    marginBottom: isGrid ? '0' : `${profile.value.themeConfig?.linkGap || 16}px`
  }
  
  if (link.metadata?.color) {
    if (isGrid) {
      style.border = `2px solid ${link.metadata.color}22`
    } else {
      style.borderLeft = `4px solid ${link.metadata.color}`
    }
  }

  return style
}
</script>

<style scoped lang="scss">
/* Premium Aesthetics Overhaul */
.glass-card-premium {
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(24px) saturate(180%) !important;
  border: 1px solid rgba(255, 255, 255, 0.45) !important;
  border-radius: 48px !important;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2) !important;
  overflow-y: visible !important;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.text-slate-900 { color: #0f172a !important; }
.text-slate-800 { color: #1e293b !important; }
.text-slate-600 { color: #475569 !important; }
.text-slate-400 { color: #94a3b8 !important; }

.letter-spacing-tight { letter-spacing: -0.05em !important; }
.line-height-relaxed { line-height: 1.6; }

.avatar-container {
  display: flex;
  justify-content: center;
  position: relative;
}

.avatar-border-premium {
  border: 4px solid white;
  background: white;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05) rotate(2deg);
  }
}

.glass-stats-row {
  background: rgba(255, 255, 255, 0.3) !important;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.border-light { border: 1px solid rgba(0, 0, 0, 0.03); }

.interest-tag-premium {
  font-size: 13px;
  color: #4f46e5;
  background: white;
  padding: 8px 18px;
  border-radius: 99px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(79, 70, 229, 0.08);
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(79, 70, 229, 0.12);
  }
}

.social-btn-premium {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08) !important;
  &:hover {
    transform: translateY(-5px) scale(1.1);
  }
}

/* Multi-Layout Containers */
.links-container-premium {
  display: flex;
  flex-direction: column;
  
  &.layout-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-flow: dense;
    gap: 16px !important;
  }
}

/* Premium Link Item */
.premium-link-item {
  height: auto !important;
  background: white !important;
  border: 1px solid rgba(0, 0, 0, 0.02) !important;
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.05) !important;
  padding: 0 !important;
  
  &.grid-item {
    aspect-ratio: 1;
    .grid-content-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
    
    &.grid-full {
      grid-column: span 2;
      aspect-ratio: auto;
      min-height: 80px;
      
      .grid-content-wrap {
        flex-direction: row;
        padding-left: 20px;
        padding-right: 20px;
        justify-content: flex-start;
        
        i {
          margin-bottom: 0 !important;
          margin-right: 16px;
          font-size: 24px !important;
        }
        
        div {
          font-size: 1rem;
          text-align: left !important;
        }
      }
    }
  }

  .link-icon-circle {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, #6366f1, #a855f7);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 16px rgba(99, 102, 241, 0.2);
  }

  /* Animations */
  &.anim-glow {
    animation: link-glow-pulse 2s infinite ease-in-out;
  }
  &.anim-bounce {
    animation: link-bounce 3s infinite ease-in-out;
  }

  &:hover {
    background: #fafafa !important;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important;
  }
}

@keyframes link-glow-pulse {
  0%, 100% { box-shadow: 0 10px 20px -5px rgba(0,0,0,0.05); }
  50% { box-shadow: 0 0 20px -5px var(--v-primary-base), 0 0 15px rgba(99, 102, 241, 0.3); }
}

@keyframes link-bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
  60% { transform: translateY(-3px); }
}

.like-btn-premium {
  background: white !important;
  &.heartbeat {
    animation: HeartbeatAnimation 2s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95);
  }
}

@keyframes HeartbeatAnimation {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  50% { transform: scale(1.1); box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

.branding-chip-premium {
  letter-spacing: 3px !important;
  font-size: 11px !important;
  color: #94a3b8 !important;
}

.pulse-indicator {
  box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
  animation: PulseIndicatorAnim 2s infinite;
}

@keyframes PulseIndicatorAnim {
  0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(74, 222, 128, 0); }
  100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
}

/* Theme Adaptations */
.theme-cyberpunk {
  .glass-card-premium {
    background: rgba(13, 2, 33, 0.85) !important;
    border: 2px solid #ff00ff !important;
    box-shadow: 0 0 30px #ff00ff, inset 0 0 15px #ff00ff !important;
  }
  .link-icon-circle { background: #ff00ff; }
  .text-slate-900, .text-slate-800, .text-slate-600 { color: #00ffcc !important; }
}

.profile-container {
  min-height: 100vh;
  position: relative;
  background: #0f172a;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.aurora-bg {
  position: fixed;
  inset: -50%;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
  animation: aurora-rotate 25s linear infinite;
  z-index: 1;
  pointer-events: none;
}

@keyframes aurora-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.grain-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  z-index: 2;
  mix-blend-mode: overlay;
}

.max-width-mobile {
  max-width: 440px;
  margin: 40px auto;
}

.card-reveal {
  animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
