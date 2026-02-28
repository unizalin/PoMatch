<template>
  <NuxtLayout name="admin">
    <div class="d-flex align-center justify-space-between mb-8">
      <div>
        <h2 class="text-h4 font-weight-black mb-1">成效分析</h2>
        <p class="text-body-2 text-grey">追蹤您的數位名片造訪與點擊成效</p>
      </div>
      <div class="d-flex align-center gap-3">
        <v-select
          v-model="timeRange"
          :items="timeRanges"
          variant="solo"
          density="comfortable"
          hide-details
          flat
          rounded="xl"
          bg-color="white"
          class="time-select border shadow-sm"
        ></v-select>
        <v-btn icon="mdi-refresh" variant="text" color="grey"></v-btn>
      </div>
    </div>

    <!-- Stats Grid (Bento Style) -->
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="bento-card bento-card-primary pa-6 fill-height" rounded="xl">
          <div class="d-flex align-center justify-space-between mb-4">
            <v-icon color="white" size="32">mdi-account-group-outline</v-icon>
            <div class="text-white text-caption font-weight-bold">+12.5%</div>
          </div>
          <div class="text-white-50 text-subtitle-2 mb-1">預估總訪客數</div>
          <div class="text-white text-h3 font-weight-black mb-4">{{ analytics.totalVisitors || 124 }}</div>
          <v-sparkline
            :model-value="[0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0]"
            color="white"
            line-width="2"
            padding="16"
            smooth
          ></v-sparkline>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-row>
          <v-col cols="12" md="6">
            <v-card class="bento-card glass-card pa-6" rounded="xl">
              <div class="d-flex align-center gap-3 mb-2">
                <v-avatar color="blue-lighten-5" size="32">
                  <v-icon color="blue" size="18">mdi-eye-outline</v-icon>
                </v-avatar>
                <div class="text-caption text-grey font-weight-bold">總瀏覽次數</div>
              </div>
              <div class="text-h4 font-weight-black">{{ analytics.totalViews || 842 }}</div>
              <div class="text-caption text-success mt-2 d-flex align-center">
                <v-icon size="14" class="mr-1">mdi-arrow-up</v-icon> 24% 較上週
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="bento-card glass-card pa-6" rounded="xl">
              <div class="d-flex align-center gap-3 mb-2">
                <v-avatar color="purple-lighten-5" size="32">
                  <v-icon color="purple" size="18">mdi-cursor-default-click-outline</v-icon>
                </v-avatar>
                <div class="text-caption text-grey font-weight-bold">平均點擊率 (CTR)</div>
              </div>
              <div class="text-h4 font-weight-black">{{ analytics.ctr || '18.4%' }}</div>
              <div class="text-caption text-success mt-2 d-flex align-center">
                <v-icon size="14" class="mr-1">mdi-arrow-up</v-icon> 2.1% 較上週
              </div>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card class="bento-card glass-card pa-6" rounded="xl">
              <div class="d-flex align-center justify-space-between mb-4">
                <div class="text-subtitle-1 font-weight-bold">最近 7 天造訪趨勢</div>
                <div class="d-flex align-center gap-2">
                  <div class="indicator bg-primary"></div>
                  <span class="text-caption text-grey">訪客數</span>
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

    <!-- Detailed Stats -->
    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card class="bento-card glass-card pa-6" rounded="xl">
          <h3 class="text-subtitle-1 font-weight-bold mb-6">社群連結點擊分佈</h3>
          <v-list class="bg-transparent" density="comfortable">
            <v-list-item v-for="item in socialStats" :key="item.name" class="px-0">
              <template v-slot:prepend>
                <v-icon :color="item.color" class="mr-4">{{ item.icon }}</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium">{{ item.name }}</v-list-item-title>
              <template v-slot:append>
                <div class="text-right">
                  <div class="font-weight-bold">{{ item.count }}</div>
                  <v-progress-linear
                    :model-value="(item.count / 250) * 100"
                    :color="item.color"
                    height="4"
                    rounded
                    class="mt-1"
                    style="width: 60px"
                  ></v-progress-linear>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="bento-card glass-card pa-6" rounded="xl">
          <h3 class="text-subtitle-1 font-weight-bold mb-6">主要來源區域</h3>
          <div class="d-flex flex-column gap-6">
            <div v-for="loc in locations" :key="loc.name" class="d-flex align-center justify-space-between">
              <div class="d-flex align-center gap-3">
                <span class="text-h6">{{ loc.flag }}</span>
                <span class="text-body-2 font-weight-bold">{{ loc.name }}</span>
              </div>
              <div class="d-flex align-center gap-4">
                <span class="text-caption text-grey">{{ loc.percentage }}%</span>
                <div class="text-body-2 font-weight-black">{{ loc.count }}</div>
              </div>
            </div>
            <v-spacer class="mt-4"></v-spacer>
            <v-btn variant="tonal" color="primary" block rounded="lg">查看完整地理報告</v-btn>
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

const store = useProfileStore()
const analytics = computed(() => store.analytics)

const timeRange = ref('最近 7 天')
const timeRanges = ['最近 7 天', '最近 30 天', '本月']

const socialStats = computed(() => [
  { name: 'Instagram', icon: 'mdi-instagram', color: '#E4405F', count: 128 },
  { name: 'LINE', icon: 'mdi-message-text', color: '#06C755', count: 88 },
  { name: 'TikTok', icon: 'mdi-music-note', color: '#000000', count: 56 },
  { name: 'Facebook', icon: 'mdi-facebook', color: '#1877F2', count: 42 },
  { name: 'X (Twitter)', icon: 'mdi-twitter', color: '#000000', count: 24 }
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
      backgroundColor: 'rgba(24, 103, 192, 0.1)',
      borderColor: '#1867C0',
      pointBackgroundColor: '#1867C0',
      pointBorderColor: '#fff',
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
    legend: {
      display: false
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      padding: 12,
      backgroundColor: '#1e293b',
      titleFont: { size: 14, weight: 'bold' },
      bodyFont: { size: 13 }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: '#f1f5f9'
      },
      ticks: {
        font: { size: 11 },
        color: '#94a3b8'
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: { size: 11 },
        color: '#94a3b8'
      }
    }
  }
}
</script>

<style scoped>
.bento-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #f1f5f9;
}

.bento-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.05);
}

.bento-card-primary {
  background: linear-gradient(135deg, #1867C0 0%, #5CBBF6 100%) !important;
  color: white;
}

.text-white-50 {
  color: rgba(255, 255, 255, 0.7);
}

.chart-container {
  height: 240px;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.time-select {
  width: 140px;
}

.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
.gap-6 { gap: 24px; }

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
}

.tracking-tighter {
  letter-spacing: -0.05em;
}
</style>
