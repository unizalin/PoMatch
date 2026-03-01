<template>
  <NuxtLayout name="admin">
    <div class="profile-page-header mb-8">
      <div>
        <h2 class="page-title">配對洞察</h2>
        <p class="page-subtitle">基於 MBTI 與星座的多維度配對大數據分析</p>
      </div>
      <v-chip color="primary" variant="flat" size="small" class="font-weight-black px-4" rounded="pill">
        <v-icon start size="14">mdi-dna</v-icon>
        AI 配對運算中
      </v-chip>
    </div>

    <!-- My Persona Summary (Bento Grid) -->
    <v-row :gutter="20" class="mb-4">
      <v-col cols="12" lg="8">
        <v-card class="bento-card glass-card pa-8" rounded="xl" elevation="0">
          <div class="d-flex align-center gap-3 mb-8">
            <div class="icon-box primary">
              <v-icon size="20">mdi-account-heart</v-icon>
            </div>
            <div>
              <h3 class="card-title">我的配對基礎</h3>
              <p class="card-subtitle">您的個人特質設定</p>
            </div>
          </div>
          
          <v-row :gutter="16">
            <v-col v-for="stat in personaStats" :key="stat.label" cols="6" sm="3">
              <div class="persona-item text-center pa-5 rounded-xl">
                <div class="p-value mb-1" :class="{ 'text-primary': stat.isPrimary }">{{ stat.value }}</div>
                <div class="p-label">{{ stat.label }}</div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card class="bento-card bento-hero-card" rounded="xl" elevation="0">
          <div class="hero-glow"></div>
          <div class="card-inner pa-8 text-center">
            <div class="hero-label mb-2">配對大師指數</div>
            <div class="hero-value mb-4">{{ compatibilityScore }}</div>
            <div class="text-white-50 text-caption mb-6">您的個人資料完整度越高，<br>配對精準度將提升。</div>
            <v-btn block color="white" variant="flat" rounded="xl" class="font-weight-black" to="/admin/profile">
              完善資料 <v-icon end size="14">mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Detailed Analysis Row -->
    <v-row :gutter="20">
      <!-- Top Matches (Bento Style) -->
      <v-col cols="12" lg="7">
        <v-card class="bento-card glass-card pa-8 fill-height" rounded="xl" elevation="0">
          <div class="d-flex align-center justify-space-between mb-8">
            <div class="d-flex align-center gap-3">
              <div class="icon-box pink">
                <v-icon size="20">mdi-heart-multiple</v-icon>
              </div>
              <h3 class="card-title">最契合的靈魂伴侶</h3>
            </div>
            <v-btn variant="text" color="grey" size="small" icon="mdi-information-outline"></v-btn>
          </div>

          <div v-if="!topMatches.length" class="empty-state py-12">
            <v-icon size="64" color="#E2E8F0" class="mb-4">mdi-magnify</v-icon>
            <p class="text-body-2 text-grey">正在蒐集更多數據...<br>完善個人標籤可加快計算速度</p>
          </div>

          <div v-else class="match-list">
            <div
              v-for="(match, idx) in topMatches"
              :key="match.id"
              class="premium-match-card d-flex align-center pa-4 mb-4"
            >
              <div class="rank-badge mr-4">{{ idx + 1 }}</div>
              <v-avatar size="52" class="mr-4 border-white-shadow">
                <v-img :src="match.avatar"></v-img>
              </v-avatar>
              
              <div class="flex-grow-1">
                <div class="text-body-1 font-weight-black text-slate-900">{{ match.name }}</div>
                <div class="d-flex gap-2 mt-1">
                  <v-chip size="x-small" variant="tonal" class="rounded-lg">{{ match.persona.mbti }}</v-chip>
                  <v-chip size="x-small" variant="tonal" class="rounded-lg">{{ match.persona.zodiac }}</v-chip>
                </div>
              </div>

              <div class="text-right ml-4">
                <div class="text-h6 font-weight-black text-primary">{{ match.score }}%</div>
                <div class="text-caption text-grey font-weight-bold">契合度</div>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Personality Distribution -->
      <v-col cols="12" lg="5">
        <v-card class="bento-card glass-card pa-8" rounded="xl" elevation="0">
          <div class="d-flex align-center gap-3 mb-8">
            <div class="icon-box purple">
              <v-icon size="20">mdi-chart-donut-variant</v-icon>
            </div>
            <h3 class="card-title">配對分數分佈</h3>
          </div>
          
          <div class="score-stats mt-6">
            <div v-for="range in scoreRanges" :key="range.label" class="mb-6">
              <div class="d-flex justify-space-between align-end mb-2">
                <span class="text-caption font-weight-bold text-slate-700">{{ range.label }}</span>
                <span class="text-body-2 font-weight-black">{{ range.count }} <span class="text-caption text-grey font-weight-medium">人</span></span>
              </div>
              <v-progress-linear
                :model-value="(range.count / 20) * 100"
                :color="range.color"
                height="10"
                rounded="pill"
                bg-color="#F1F5F9"
                bg-opacity="1"
              ></v-progress-linear>
            </div>
          </div>

          <div class="insight-tips mt-8 pa-4 rounded-xl bg-slate-50 border-dashed">
            <div class="d-flex gap-3">
              <v-icon color="primary" size="20">mdi-lightbulb-on-outline</v-icon>
              <div class="text-caption text-slate-600 leading-relaxed">
                數據顯示，與你最契合的族群通常具備 <b>{{ personaInsight }}</b> 標籤，建議增加相關互動。
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'

definePageMeta({ layout: false })

const store = useProfileStore()
const myPersona = computed(() => store.profile.persona)

const personaStats = computed(() => [
  { label: 'MBTI 類型', value: myPersona.value.mbti || 'N/A', isPrimary: false },
  { label: '星座', value: myPersona.value.zodiac || 'N/A', isPrimary: false },
  { label: '興趣標籤', value: myPersona.value.tags?.length || 0, isPrimary: false },
  { label: '平均配對', value: avgMatchScore.value, isPrimary: true },
])

const avgMatchScore = computed(() => {
  if (!store.allProfiles.length) return '--'
  const scores = store.allProfiles.map((p) => store.calculateMatch(p.persona))
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  return `${avg}%`
})

const topMatches = computed(() => {
  return store.allProfiles
    .filter((p) => p.id !== store.profile.id)
    .map((p) => ({ ...p, score: store.calculateMatch(p.persona) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
})

const allProfiles = computed(() => store.allProfiles)
const isLoading = computed(() => store.loading)

onMounted(async () => {
  await store.fetchAllProfiles()
})

const mbtiStats = computed(() => {
  const counts: Record<string, number> = {}
  allProfiles.value.forEach(p => {
    const m = p.persona?.mbti || 'UNKNOWN'
    counts[m] = (counts[m] || 0) + 1
  })
  
  const total = allProfiles.value.length || 1
  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / total) * 100),
      color: name.includes('I') ? '#6366f1' : '#f43f5e'
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 4)
})

const zodiacStats = computed(() => {
  const counts: Record<string, number> = {}
  allProfiles.value.forEach(p => {
    const z = p.persona?.zodiac || 'UNKNOWN'
    counts[z] = (counts[z] || 0) + 1
  })
  
  const total = allProfiles.value.length || 1
  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / total) * 100),
      icon: 'mdi-star-four-points'
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 4)
})

const scoreRanges = [
  { label: '極高相容 (80-100%)', count: 3, color: '#10B981' },
  { label: '良好互動 (60-79%)', count: 8, color: '#6366F1' },
  { label: '普通關聯 (40-59%)', count: 6, color: '#F59E0B' },
  { label: '低度共鳴 (<40%)', count: 3, color: '#EF4444' }
]

const compatibilityScore = computed(() => {
  const persona = myPersona.value
  let score = 0
  if (persona.mbti && persona.mbti !== 'UNKNOWN') score += 35
  if (persona.zodiac && persona.zodiac !== 'UNKNOWN') score += 25
  if (persona.location) score += 15
  if (persona.tags?.length) score += Math.min(persona.tags.length * 5, 25)
  return `${score}%`
})

const personaInsight = computed(() => {
  if (myPersona.value.mbti?.includes('E')) return '外向與活發'
  if (myPersona.value.mbti?.includes('I')) return '內斂與深度'
  return '多元化興趣'
})

onMounted(async () => {
  if (!store.allProfiles.length) {
    await store.fetchAllProfiles()
  }
})
</script>

<style scoped>
/* ─── Page Header ─── */
.profile-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.page-title {
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: #0f172a;
  margin-bottom: 4px;
}
.page-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* ─── Bento Cards ─── */
.bento-card {
  background: white;
  border: 1px solid #F1F5F9 !important;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  position: relative;
}
.bento-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px -12px rgba(0,0,0,0.08);
}

/* ─── Hero Metric Card ─── */
.bento-hero-card {
  background: linear-gradient(135deg, #1867C0 0%, #312E81 100%) !important;
  height: 100%;
}
.hero-glow {
  position: absolute;
  top: -100px;
  right: -100px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  z-index: 1;
}
.card-inner { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; justify-content: center; }
.hero-label { font-size: 13px; font-weight: 800; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.1em; }
.hero-value { font-size: 56px; font-weight: 900; color: white; letter-spacing: -0.05em; line-height: 1; }
.text-white-50 { color: rgba(255,255,255,0.5); font-weight: 500; }

/* ─── Icon Boxes ─── */
.icon-box {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}
.icon-box.primary { background: #EEF2FF; color: #4F46E5; }
.icon-box.purple { background: #F5F3FF; color: #8B5CF6; }
.icon-box.pink { background: #FFF1F2; color: #F43F5E; }

/* ─── Persona Grid ─── */
.persona-item {
  background: #F8FAFC;
  border: 1px solid #F1F5F9;
  transition: all 0.2s;
}
.persona-item:hover {
  background: white;
  border-color: #1867C0;
  box-shadow: 0 8px 16px rgba(0,0,0,0.04);
}
.p-value { font-size: 20px; font-weight: 900; color: #1E293B; }
.p-label { font-size: 11px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.05em; }

/* ─── Top Matches ─── */
.premium-match-card {
  background: #F8FAFC;
  border-radius: 20px;
  border: 1px solid transparent;
  transition: all 0.2s;
}
.premium-match-card:hover {
  background: white;
  border-color: #E2E8F0;
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}
.rank-badge {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0F172A;
  color: white;
  border-radius: 10px;
  font-weight: 900;
  font-size: 14px;
}
.border-white-shadow { border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.05); }

/* ─── Helpers ─── */
.card-title { font-size: 18px; font-weight: 900; color: #0F172A; letter-spacing: -0.03em; margin-bottom: 2px; }
.card-subtitle { font-size: 13px; color: #94A3B8; font-weight: 500; }
.empty-state { text-align: center; }
.bg-slate-50 { background-color: #F8FAFC; }
.border-dashed { border: 1.5px dashed #E2E8F0; }
.leading-relaxed { line-height: 1.6; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
</style>
