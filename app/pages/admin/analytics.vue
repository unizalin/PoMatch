<template>
  <NuxtLayout name="admin">
    <div class="profile-page-header mb-8">
      <div>
        <h2 class="page-title">數據總覽</h2>
        <p class="page-subtitle">追蹤您的數位名片造訪、點擊與互動成效</p>
      </div>
      <div class="d-flex align-center gap-3">
        <div class="time-select-wrap">
          <v-select
            v-model="timeRange"
            :items="timeRanges"
            variant="plain"
            density="compact"
            hide-details
            rounded="xl"
            class="time-select-input"
          ></v-select>
        </div>
        <v-btn icon="mdi-refresh" variant="tonal" color="primary" size="small" rounded="lg"></v-btn>
      </div>
    </div>

    <!-- Stats Grid (Premium Bento Style) -->
    <v-row :gutter="20">
      <v-col cols="12" lg="4">
        <v-card class="bento-card bento-hero-card" rounded="xl" elevation="0">
          <div class="hero-glow"></div>
          <div class="card-inner pa-8">
            <div class="d-flex align-center justify-space-between mb-8">
              <div class="hero-icon-wrap">
                <v-icon color="white" size="32">mdi-account-group</v-icon>
              </div>
              <v-chip color="rgba(255,255,255,0.2)" size="small" class="text-white font-weight-black" variant="flat">
                +12.5% <v-icon size="12" class="ml-1">mdi-trending-up</v-icon>
              </v-chip>
            </div>
            <div class="hero-label">預估總訪客數</div>
            <div class="hero-value mt-2">{{ analytics.totalVisitors || 1248 }}</div>
            <div class="hero-chart-wrap mt-8">
              <v-sparkline
                :model-value="[12, 18, 15, 29, 22, 35, 28, 42, 38, 55, 48, 62]"
                color="rgba(255,255,255,0.6)"
                line-width="3"
                padding="8"
                smooth
              ></v-sparkline>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" lg="8">
        <v-row :gutter="20">
          <v-col cols="12" md="6">
            <v-card class="bento-card glass-card pa-6" rounded="xl" elevation="0">
              <div class="d-flex align-center justify-space-between mb-2">
                <div class="d-flex align-center gap-3">
                  <div class="metric-icon blue">
                    <v-icon size="18">mdi-eye-outline</v-icon>
                  </div>
                  <div class="metric-label">總瀏覽次數</div>
                </div>
                <div class="text-success text-caption font-weight-black">+24%</div>
              </div>
              <div class="metric-value">{{ analytics.totalViews || 8426 }}</div>
              <div class="metric-subtext mt-1 text-grey">較上期增加 1,245 次</div>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="bento-card glass-card pa-6" rounded="xl" elevation="0">
              <div class="d-flex align-center justify-space-between mb-2">
                <div class="d-flex align-center gap-3">
                  <div class="metric-icon purple">
                    <v-icon size="18">mdi-cursor-default-click</v-icon>
                  </div>
                  <div class="metric-label">平均點擊率</div>
                </div>
                <div class="text-success text-caption font-weight-black">+2.1%</div>
              </div>
              <div class="metric-value">{{ analytics.ctr || '18.4%' }}</div>
              <div class="metric-subtext mt-1 text-grey">高於業界平均水平</div>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card class="bento-card glass-card pa-6" rounded="xl" elevation="0">
              <div class="d-flex align-center justify-space-between mb-6">
                <div>
                  <h3 class="card-title">造訪趨勢圖</h3>
                  <p class="card-subtitle">最近 7 天的流量趨勢</p>
                </div>
                <div class="d-flex align-center gap-4">
                  <div class="chart-legend">
                    <span class="legend-dot primary"></span>
                    <span class="text-caption">訪客數</span>
                  </div>
                </div>
              </div>
              <div class="chart-container">
                <Line :data="chartData" :options="chartOptions" />
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Lower Grid -->
    <v-row class="mt-4" :gutter="20">
      <v-col cols="12" md="6">
        <v-card class="bento-card glass-card pa-8" rounded="xl" elevation="0">
          <div class="d-flex align-center justify-space-between mb-8">
            <h3 class="card-title">熱門連結點擊</h3>
            <v-btn variant="text" color="primary" size="small" rounded="lg">詳細細節</v-btn>
          </div>
          <div class="stats-list">
            <div v-for="item in socialStats" :key="item.name" class="stats-item mb-6">
              <div class="d-flex align-center justify-space-between mb-2">
                <div class="d-flex align-center gap-3">
                  <v-icon :color="item.color" size="20">{{ item.icon }}</v-icon>
                  <span class="text-body-2 font-weight-bold">{{ item.name }}</span>
                </div>
                <div class="text-body-2 font-weight-black">{{ item.count }} <span class="text-caption text-grey font-weight-medium">次點擊</span></div>
              </div>
              <v-progress-linear
                :model-value="(item.count / 250) * 100"
                :color="item.color"
                height="8"
                rounded="pill"
                bg-color="#F1F5F9"
                bg-opacity="1"
              ></v-progress-linear>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="bento-card glass-card pa-8" rounded="xl" elevation="0">
          <div class="d-flex align-center justify-space-between mb-8">
            <h3 class="card-title">主要點閱區域</h3>
            <v-btn variant="text" color="primary" size="small" rounded="lg">地理中心</v-btn>
          </div>
          <div class="location-list">
            <div v-for="loc in locations" :key="loc.name" class="location-item pa-4 mb-3 rounded-xl border-dashed">
              <div class="d-flex align-center justify-space-between w-100">
                <div class="d-flex align-center gap-4">
                  <div class="flag-icon">{{ loc.flag }}</div>
                  <div>
                    <div class="text-body-2 font-weight-black">{{ loc.name }}</div>
                    <div class="text-caption text-grey">台灣區域</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-body-2 font-weight-black">{{ loc.count }}</div>
                  <div class="text-caption text-success font-weight-bold">{{ loc.percentage }}%</div>
                </div>
              </div>
            </div>
            <v-btn block color="primary" variant="tonal" rounded="xl" class="mt-4 font-weight-bold">
              查看全球分佈圖
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </NuxtLayout>
</template>

<script setup>
import { useProfileStore } from '~/stores/profile'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler
)

definePageMeta({ layout: false }) // Using custom NuxtLayout inside

const store = useProfileStore()
const analytics = computed(() => store.analytics)

const timeRange = ref('最近 7 天')
const timeRanges = ['最近 7 天', '最近 30 天', '本月']

const socialStats = computed(() => [
  { name: 'Instagram Portfolio', icon: 'mdi-instagram', color: '#E4405F', count: 128 },
  { name: 'LINE 預約諮詢', icon: 'mdi-message-text', color: '#06C755', count: 88 },
  { name: 'TikTok 影片集錦', icon: 'mdi-music-note', color: '#000000', count: 56 },
  { name: 'Threads 日常分享', icon: 'mdi-at', color: '#000000', count: 42 },
  { name: 'Facebook 粉絲專頁', icon: 'mdi-facebook', color: '#1877F2', count: 24 }
])

const locations = [
  { name: '台北市', flag: '🇹🇼', count: 420, percentage: 48 },
  { name: '台中市', flag: '🇹🇼', count: 180, percentage: 21 },
  { name: '新北市', flag: '🇹🇼', count: 120, percentage: 14 },
  { name: '高雄市', flag: '🇹🇼', count: 85, percentage: 10 }
]

const chartData = {
  labels: ['2/21', '2/22', '2/23', '2/24', '2/25', '2/26', '2/27'],
  datasets: [
    {
      label: '訪客數',
      backgroundColor: (context) => {
        const chart = context.chart;
        const {ctx, chartArea} = chart;
        if (!chartArea) return null;
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, 'rgba(24, 103, 192, 0)');
        gradient.addColorStop(1, 'rgba(24, 103, 192, 0.1)');
        return gradient;
      },
      borderColor: '#1867C0',
      borderWidth: 3,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#1867C0',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.4,
      data: [45, 52, 38, 65, 48, 72, 84]
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: 'index',
      intersect: false,
      padding: 12,
      backgroundColor: '#1e293b',
      titleFont: { size: 14, weight: 'bold' },
      bodyFont: { size: 13 },
      cornerRadius: 12
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { display: true, color: '#f1f5f9', drawBorder: false },
      ticks: { font: { size: 11, weight: '600' }, color: '#94a3b8', padding: 8 }
    },
    x: {
      grid: { display: false },
      ticks: { font: { size: 11, weight: '600' }, color: '#94a3b8', padding: 8 }
    }
  }
}
</script>

<style scoped>
/* ─── Page Container ─── */
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
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%) !important;
  height: 100%;
}
.hero-glow {
  position: absolute;
  top: -100px;
  right: -100px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
  z-index: 1;
}
.card-inner { position: relative; z-index: 2; }
.hero-icon-wrap {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}
.hero-label { font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.1em; }
.hero-value { font-size: 48px; font-weight: 900; color: white; letter-spacing: -0.05em; line-height: 1; }

/* ─── Standard Metrics ─── */
.metric-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}
.metric-icon.blue { background: #E0F2FE; color: #0EA5E9; }
.metric-icon.purple { background: #F5F3FF; color: #8B5CF6; }
.metric-label { font-size: 12px; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; }
.metric-value { font-size: 32px; font-weight: 900; color: #0F172A; letter-spacing: -0.04em; margin-top: 8px; }
.metric-subtext { font-size: 12px; font-weight: 500; }

/* ─── Typography & Charts ─── */
.card-title { font-size: 18px; font-weight: 900; color: #0F172A; letter-spacing: -0.03em; margin-bottom: 4px; }
.card-subtitle { font-size: 13px; color: #94A3B8; font-weight: 500; }
.chart-container { height: 260px; margin-top: 12px; }
.chart-legend { display: flex; align-items: center; gap: 6px; }
.legend-dot { width: 8px; height: 8px; border-radius: 50%; }
.legend-dot.primary { background: #1867C0; }

/* ─── Lists & Items ─── */
.border-dashed { border: 1.5px dashed #E2E8F0; transition: all 0.2s; }
.location-item:hover { border-color: #1867C0; background: #F8FAFC; transform: scale(1.01); }
.flag-icon { font-size: 24px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }

/* ─── Filtering ─── */
.time-select-wrap {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 0 12px;
  width: 140px;
  height: 36px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.time-select-input :deep(.v-field__input) { font-size: 13px; font-weight: 700; color: #1e293b; min-height: unset; padding: 0; }

.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
</style>
