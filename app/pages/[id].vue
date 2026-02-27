<template>
  <div :class="['profile-container d-flex flex-column align-center pa-4', `theme-${profile.theme}`]">
    <v-fade-transition>
      <div v-if="profile" :class="['glass-card pa-8 w-100 max-width-mobile text-center card-reveal', profile.theme]">
        <!-- Status Indicator -->
        <div class="d-flex justify-end mb-n4">
          <v-chip size="x-small" color="success" variant="flat" class="text-caption font-weight-bold">
            <v-icon start size="10">mdi-circle</v-icon>
            在線上
          </v-chip>
        </div>

        <v-avatar size="110" class="mb-5 avatar-border elevation-10">
          <v-img :src="profile.avatar"></v-img>
        </v-avatar>
        
        <h1 class="text-h5 font-weight-bold mb-1 text-grey-darken-4">{{ profile.name }}</h1>
        <p class="text-body-2 text-grey-darken-1 mb-4 px-4 line-height-relaxed">{{ profile.description }}</p>

        <!-- Persona Tags -->
        <div class="d-flex flex-wrap justify-center gap-2 mb-6">
          <v-chip size="small" variant="tonal" color="primary" class="font-weight-bold">{{ profile.persona.mbti }}</v-chip>
          <v-chip size="small" variant="tonal" color="secondary" class="font-weight-bold">{{ profile.persona.zodiac }}</v-chip>
          <v-chip size="small" variant="tonal" color="accent" class="font-weight-bold">📍 {{ profile.persona.location }}</v-chip>
        </div>

        <!-- Interactive Stats -->
        <v-row class="mb-8 bg-grey-lighten-4 rounded-xl py-3 mx-2">
          <v-col cols="4" class="pa-1">
            <div class="text-h6 font-weight-bold text-primary">{{ displayScore }}%</div>
            <div class="text-caption text-grey">契合度</div>
          </v-col>
          <v-col cols="4" class="pa-1 border-s border-e">
            <div class="text-h6 font-weight-bold">{{ formatNumber(profile.interactiveStats.likes) }}</div>
            <div class="text-caption text-grey">被喜歡</div>
          </v-col>
          <v-col cols="4" class="pa-1">
            <div class="text-h6 font-weight-bold">{{ formatNumber(profile.interactiveStats.followers) }}</div>
            <div class="text-caption text-grey">追蹤中</div>
          </v-col>
        </v-row>

        <!-- Interests Tags -->
        <div class="d-flex flex-wrap justify-center gap-2 mb-8 px-4">
          <span v-for="tag in profile.persona.tags" :key="tag" class="text-caption text-grey-darken-2 bg-white px-3 py-1 rounded-pill border shadow-sm">
            # {{ tag }}
          </span>
        </div>

        <div class="social-row d-flex justify-center mb-8">
          <v-btn
            v-for="social in profile.socialLinks"
            :key="social.platform"
            icon
            :color="social.color"
            variant="tonal"
            size="small"
            class="social-btn mx-2"
          >
            <v-icon>{{ social.icon }}</v-icon>
          </v-btn>
        </div>

        <div class="links-list px-2">
          <v-btn
            v-for="link in profile.actionLinks"
            :key="link.id"
            block
            variant="flat"
            color="white"
            class="mb-4 profile-link-btn rounded-xl hover-scale elevation-1 d-flex align-center"
            :href="link.url"
            target="_blank"
            @click="store.recordClick(link.id)"
          >
            <div class="d-flex align-center w-100 py-3 px-1">
              <v-icon color="primary" class="mr-4">{{ link.icon || 'mdi-link-variant' }}</v-icon>
              <span class="flex-grow-1 text-left font-weight-bold text-grey-darken-3">{{ link.title }}</span>
              <v-icon size="small" color="grey-lighten-2">mdi-chevron-right</v-icon>
            </div>
          </v-btn>
        </div>

        <!-- Floating Action Button for Likes (Dating style) -->
        <div class="mt-8 d-flex justify-center">
          <v-btn
            icon
            color="red-lighten-4"
            class="like-btn-pulse"
            size="large"
            @click="onLike"
          >
            <v-icon color="red">mdi-heart</v-icon>
          </v-btn>
        </div>

        <div class="mt-12 mb-4">
          <v-chip variant="outlined" color="grey-lighten-1" size="small" class="px-5 letter-spacing-wide">
            POWERED BY POMATCH
          </v-chip>
        </div>
      </div>
    </v-fade-transition>
  </div>
</template>

<script setup>
import { useProfileStore } from '~/stores/profile'

const store = useProfileStore()
const profile = computed(() => store.profile)

const route = useRoute()
const userId = route.params.id

const matchScore = ref(0)
const displayScore = ref(0)

onMounted(() => {
    if (profile.value && store.calculateMatch) {
        matchScore.value = store.calculateMatch(profile.value.persona)
        
        // Count up animation
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
</script>

<style scoped lang="scss">
/* Cyberpunk Theme */
.theme-cyberpunk {
  background: #0d0221 !important;
  color: #00ffcc !important;
  
  .glass-card.cyberpunk {
    background: rgba(13, 2, 33, 0.9) !important;
    border: 2px solid #ff00ff !important;
    box-shadow: 0 0 20px #ff00ff, inset 0 0 10px #ff00ff !important;
  }
  
  .v-chip {
    background: #ff00ff !important;
    color: white !important;
    box-shadow: 0 0 10px #ff00ff;
  }
  
  .profile-link-btn {
    background: transparent !important;
    border: 1px solid #00ffcc !important;
    color: #00ffcc !important;
    &:hover {
      background: #00ffcc !important;
      color: #0d0221 !important;
      box-shadow: 0 0 15px #00ffcc !important;
    }
  }

  .text-grey-darken-4, .text-grey-darken-3, .text-grey-darken-1, .text-grey {
    color: #00ffcc !important;
  }
}

/* Minimalist Theme */
.theme-minimalist {
  background: #ffffff !important;
  color: #1a1a1a !important;
  
  .glass-card.minimalist {
    background: white !important;
    border: none !important;
    box-shadow: none !important;
  }
  
  .avatar-border {
    border: 1px solid #eee;
  }
  
  .v-chip {
    border-radius: 4px;
    font-weight: 400;
  }
  
  .profile-link-btn {
    border-radius: 4px !important;
    border: 1px solid #eee !important;
    box-shadow: none !important;
  }
}

.profile-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #FDFDFD 0%, #F5F7FA 100%);
  overflow-x: hidden;
}

.max-width-mobile {
  max-width: 440px;
  margin: 0 auto;
}

.avatar-border {
  border: 4px solid white;
  background: white;
}

.line-height-relaxed {
  line-height: 1.6;
}

.gap-2 {
  gap: 8px;
}

.social-btn {
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-3px);
  }
}

.profile-link-btn {
  height: auto !important;
  text-transform: none !important;
  letter-spacing: normal !important;
  border: 1px solid rgba(0, 0, 0, 0.03) !important;
  
  &:hover {
    background-color: #fcfcfc !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05) !important;
  }
}

.like-btn-pulse {
  animation: heartbeat 1.5s infinite;
  box-shadow: 0 0 0 0 rgba(239, 154, 154, 0.7);
  
  &:active {
    transform: scale(0.9);
  }
}

@keyframes heartbeat {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 154, 154, 0.7); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(239, 154, 154, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 154, 154, 0); }
}

.letter-spacing-wide {
  letter-spacing: 2px !important;
  font-size: 10px !important;
  font-weight: 700;
}

.card-reveal {
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
