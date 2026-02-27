<template>
  <NuxtLayout name="admin">
    <div class="d-flex align-center mb-6">
      <div class="mr-4">
        <v-select
          v-model="timeRange"
          :items="timeRanges"
          label="時間範圍"
          variant="outlined"
          density="compact"
          hide-details
          style="width: 200px"
        ></v-select>
      </div>
      <div class="text-body-2 text-grey">2026/02/21 - 2026/02/27</div>
    </div>

    <v-row>
      <v-col cols="12" md="3">
        <v-card class="glass-card pa-4 h-100 d-flex flex-column align-center justify-center">
          <v-progress-circular
            :model-value="100"
            size="100"
            width="12"
            color="primary"
            class="mb-2"
          >
            <div class="text-center">
              <div class="text-h6">0</div>
              <div class="text-caption">總訪客數</div>
            </div>
          </v-progress-circular>
          <div class="text-success text-caption">+100.0%</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="9">
        <v-row>
          <v-col cols="12" md="6">
            <v-card class="glass-card pa-4 h-100">
              <div class="text-caption text-grey mb-1">總瀏覽數</div>
              <div class="text-h4 font-weight-bold">0</div>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="glass-card pa-4 h-100">
              <div class="text-caption text-grey mb-1">平均點擊率</div>
              <div class="text-h4 font-weight-bold">0.0%</div>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="glass-card pa-4 h-100">
              <div class="text-caption text-grey mb-1">總互動數</div>
              <div class="text-h4 font-weight-bold">0</div>
              <div class="text-caption text-grey">總按鈕點擊數</div>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="glass-card pa-4 h-100">
              <div class="text-caption text-grey mb-1">短網址點擊數</div>
              <div class="text-h4 font-weight-bold">0</div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <h3 class="text-subtitle-1 font-weight-bold mt-8 mb-4">社群連結點擊數</h3>
    <v-card class="glass-card pa-6">
      <v-row>
        <v-col cols="6" md="2" v-for="item in socialStats" :key="item.name" class="d-flex align-center">
          <v-icon :color="item.color" class="mr-2">{{ item.icon }}</v-icon>
          <div>
            <div class="text-caption text-grey">{{ item.name }}</div>
            <div class="text-body-1 font-weight-bold">{{ item.count }}</div>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <h3 class="text-subtitle-1 font-weight-bold mt-8 mb-4">每日趨勢</h3>
    <v-card class="glass-card pa-6" height="300">
      <div class="d-flex align-center justify-center h-100 text-grey-lighten-1">
        圖表加載中...
      </div>
    </v-card>
  </NuxtLayout>
</template>

<script setup>
const timeRange = ref('最近7天')
const timeRanges = ['最近7天', '最近30天', '本月', '自定義']

const socialStats = [
  { name: 'Facebook', icon: 'mdi-facebook', color: '#1877F2', count: 0 },
  { name: 'Instagram', icon: 'mdi-instagram', color: '#E4405F', count: 0 },
  { name: 'Threads', icon: 'mdi-at', color: '#000000', count: 0 },
  { name: 'LINE', icon: 'mdi-message-text', color: '#06C755', count: 0 },
  { name: 'TikTok', icon: 'mdi-music-note', color: '#000000', count: 0 },
  { name: 'X', icon: 'mdi-twitter', color: '#000000', count: 0 }
]
</script>
