<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-8">
      <div>
        <h2 class="text-h4 font-weight-black mb-1">進階配對分析</h2>
        <p class="text-body-2 text-grey">基於 MBTI 與星座的多維度配對洞察</p>
      </div>
      <v-chip color="primary" variant="tonal" size="large" class="font-weight-black">
        <v-icon start>mdi-dna</v-icon>
        BETA
      </v-chip>
    </div>

    <!-- My Persona Summary -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card class="bento-card pa-6" rounded="xl">
          <div class="d-flex align-center gap-3 mb-4">
            <v-icon color="primary">mdi-account-heart-outline</v-icon>
            <span class="text-subtitle-1 font-weight-black">我的配對基礎</span>
          </div>
          <v-row>
            <v-col cols="6" md="3">
              <div class="persona-stat-box text-center pa-4 rounded-xl">
                <div class="text-h5 font-weight-black mb-1">{{ myPersona.mbti }}</div>
                <div class="text-caption text-grey">MBTI 類型</div>
              </div>
            </v-col>
            <v-col cols="6" md="3">
              <div class="persona-stat-box text-center pa-4 rounded-xl">
                <div class="text-h5 font-weight-black mb-1">{{ myPersona.zodiac }}</div>
                <div class="text-caption text-grey">星座</div>
              </div>
            </v-col>
            <v-col cols="6" md="3">
              <div class="persona-stat-box text-center pa-4 rounded-xl">
                <div class="text-h5 font-weight-black mb-1">{{ myPersona.tags?.length || 0 }}</div>
                <div class="text-caption text-grey">興趣標籤</div>
              </div>
            </v-col>
            <v-col cols="6" md="3">
              <div class="persona-stat-box text-center pa-4 rounded-xl">
                <div class="text-h5 font-weight-black text-primary mb-1">{{ avgMatchScore }}</div>
                <div class="text-caption text-grey">平均配對分數</div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Top Matches -->
    <v-row>
      <v-col cols="12" md="7">
        <v-card class="bento-card pa-6 fill-height" rounded="xl">
          <div class="d-flex align-center gap-2 mb-6">
            <v-icon color="pink">mdi-heart-multiple-outline</v-icon>
            <span class="text-subtitle-1 font-weight-black">你最相容的用戶</span>
          </div>

          <div v-if="!topMatches.length" class="text-center pa-8">
            <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-magnify</v-icon>
            <p class="text-body-2 text-grey">尚無足夠數據計算配對<br>完善個人資料後可提升配對精準度</p>
          </div>

          <v-list v-else class="bg-transparent" density="comfortable">
            <v-list-item
              v-for="(match, idx) in topMatches"
              :key="match.id"
              class="match-item mb-3 pa-4 rounded-xl"
            >
              <template v-slot:prepend>
                <div class="rank-badge mr-4">{{ idx + 1 }}</div>
                <v-avatar size="48" class="mr-3">
                  <v-img :src="match.avatar"></v-img>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-black">{{ match.name }}</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip size="x-small" class="mr-1">{{ match.persona.mbti }}</v-chip>
                <v-chip size="x-small">{{ match.persona.zodiac }}</v-chip>
              </v-list-item-subtitle>
              <template v-slot:append>
                <div class="text-right">
                  <div class="text-h6 font-weight-black text-primary">{{ match.score }}%</div>
                  <v-progress-linear
                    :model-value="match.score"
                    color="primary"
                    rounded
                    height="4"
                    style="width: 80px"
                  ></v-progress-linear>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Match Distribution -->
      <v-col cols="12" md="5">
        <v-card class="bento-card pa-6 mb-4" rounded="xl">
          <div class="d-flex align-center gap-2 mb-6">
            <v-icon color="secondary">mdi-chart-donut-variant</v-icon>
            <span class="text-subtitle-1 font-weight-black">配對分數分佈</span>
          </div>
          <div v-for="range in scoreRanges" :key="range.label" class="mb-3">
            <div class="d-flex justify-space-between text-caption text-grey mb-1">
              <span>{{ range.label }}</span>
              <span class="font-weight-black">{{ range.count }} 人</span>
            </div>
            <v-progress-linear
              :model-value="(range.count / 20) * 100"
              :color="range.color"
              rounded
              height="8"
            ></v-progress-linear>
          </div>
        </v-card>

        <v-card class="bento-card pa-6" rounded="xl">
          <div class="d-flex align-center gap-2 mb-4">
            <v-icon color="warning">mdi-star-outline</v-icon>
            <span class="text-subtitle-1 font-weight-black">配對大師指數</span>
          </div>
          <div class="text-center py-4">
            <div class="text-h2 font-weight-black primary--text mb-2">{{ compatibilityScore }}</div>
            <div class="text-body-2 text-grey mb-4">您的個人資料完整度</div>
            <v-btn color="primary" variant="tonal" rounded="lg" to="/admin/profile" prepend-icon="mdi-pencil">
              完善資料提升分數
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'

const store = useProfileStore()

const myPersona = computed(() => store.profile.persona)

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

const scoreRanges = [
  { label: '極高配對 (80-100%)', count: 3, color: 'success' },
  { label: '良好配對 (60-79%)', count: 8, color: 'primary' },
  { label: '普通配對 (40-59%)', count: 6, color: 'warning' },
  { label: '低配對 (<40%)', count: 3, color: 'error' }
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

onMounted(async () => {
  if (!store.allProfiles.length) {
    await store.fetchAllProfiles()
  }
})
</script>

<style scoped>
.bento-card {
  background-color: white;
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.persona-stat-box {
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  transition: all 0.2s ease;
}

.persona-stat-box:hover {
  border-color: #cbd5e1;
  transform: translateY(-2px);
}

.rank-badge {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1867C0, #5CBBF6);
  color: white;
  font-weight: 900;
  font-size: 12px;
  flex-shrink: 0;
}

.match-item {
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  transition: all 0.2s ease;
}

.match-item:hover {
  background: #f0f9ff;
  border-color: #bae6fd;
}

.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
</style>
