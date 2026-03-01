<template>
  <NuxtLayout name="admin">
    <div class="profile-page-header mb-8">
      <div>
        <h2 class="page-title">訪客流量</h2>
        <p class="page-subtitle">深入了解您的訪客來源、使用設備與造訪時段</p>
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
      </div>
    </div>

    <!-- Top Grid: Geographic & Devices -->
    <v-row :gutter="20">
      <v-col cols="12" lg="8">
        <v-card class="bento-card glass-card pa-8" rounded="xl" elevation="0">
          <div class="d-flex align-center justify-space-between mb-8">
            <div class="d-flex align-center gap-3">
              <div class="icon-box primary">
                <v-icon size="20">mdi-map-marker-radius</v-icon>
              </div>
              <div>
                <h3 class="card-title">地理位置分佈</h3>
                <p class="card-subtitle">訪客主要的造訪區域</p>
              </div>
            </div>
          </div>

          <!-- Taiwan Map Placeholder (Stylized SVG) -->
          <div class="map-placeholder d-flex align-center justify-center mb-8">
            <div class="map-illustration">
              <div class="glow-dot" style="top: 20%; left: 60%; width: 24px; height: 24px;"></div>
              <div class="glow-dot" style="top: 45%; left: 45%; width: 16px; height: 16px;"></div>
              <div class="glow-dot" style="top: 70%; left: 40%; width: 12px; height: 12px;"></div>
              <v-icon size="200" color="#F1F5F9">mdi-map-outline</v-icon>
              <div class="map-overlay-text text-h6 font-weight-black text-slate-300">GEO MAP</div>
            </div>
          </div>

          <v-row :gutter="16">
            <v-col v-for="loc in locations" :key="loc.name" cols="12" sm="6" md="3">
              <div class="location-mini-card pa-4 rounded-xl border-dashed">
                <div class="d-flex align-center gap-2 mb-1">
                  <span class="text-h6">{{ loc.flag }}</span>
                  <span class="text-caption font-weight-black text-slate-700">{{ loc.name }}</span>
                </div>
                <div class="text-h6 font-weight-black">{{ loc.count }}</div>
                <div class="text-caption text-success font-weight-bold">{{ loc.percentage }}%</div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card class="bento-card glass-card pa-8 fill-height" rounded="xl" elevation="0">
          <div class="d-flex align-center gap-3 mb-8">
            <div class="icon-box purple">
              <v-icon size="20">mdi-cellphone-link</v-icon>
            </div>
            <h3 class="card-title">裝置比例</h3>
          </div>

          <div class="device-stats mt-4">
            <div v-for="device in devices" :key="device.name" class="device-item mb-8">
              <div class="d-flex align-center justify-space-between mb-3">
                <div class="d-flex align-center gap-3">
                  <v-icon :color="device.color" size="24">{{ device.icon }}</v-icon>
                  <div>
                    <div class="text-body-2 font-weight-black">{{ device.name }}</div>
                    <div class="text-caption text-grey">{{ device.subtext }}</div>
                  </div>
                </div>
                <div class="text-h6 font-weight-black">{{ device.percentage }}%</div>
              </div>
              <v-progress-linear
                :model-value="device.percentage"
                :color="device.color"
                height="8"
                rounded="pill"
                bg-color="#F1F5F9"
                bg-opacity="1"
              ></v-progress-linear>
            </div>
          </div>

          <div class="mt-8 pa-5 rounded-xl bg-slate-50 border-1">
            <div class="text-caption font-weight-bold text-slate-500 mb-2">瀏覽器分佈</div>
            <div class="d-flex gap-4">
              <v-icon size="18" color="grey-darken-1">mdi-google-chrome</v-icon>
              <v-icon size="18" color="grey-darken-1">mdi-apple-safari</v-icon>
              <v-icon size="18" color="grey-darken-1">mdi-firefox</v-icon>
              <v-spacer></v-spacer>
              <span class="text-caption font-weight-black text-slate-700">Chrome 為主 (64%)</span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Bottom Row: Time Analysis -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="bento-card glass-card pa-8" rounded="xl" elevation="0">
          <div class="d-flex align-center justify-space-between mb-8">
            <div class="d-flex align-center gap-3">
              <div class="icon-box orange">
                <v-icon size="20">mdi-clock-outline</v-icon>
              </div>
              <h3 class="card-title">造訪時段分佈</h3>
            </div>
            <div class="d-flex gap-2">
              <v-chip size="small" variant="tonal" class="rounded-lg">週末流量較高</v-chip>
            </div>
          </div>
          
          <!-- Hourly chart placeholder -->
          <div class="hourly-grid">
            <div v-for="h in 24" :key="h" class="hour-bar-wrap">
              <div class="hour-bar" :style="{ height: Math.random() * 80 + 20 + '%' }"></div>
              <div class="hour-label">{{ h-1 }}h</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const timeRange = ref('最近 7 天')
const timeRanges = ['最近 7 天', '最近 30 天', '本月']

const locations = [
  { name: '台北市', flag: '🇹🇼', count: 420, percentage: 48 },
  { name: '台中市', flag: '🇹🇼', count: 180, percentage: 21 },
  { name: '新北市', flag: '🇹🇼', count: 120, percentage: 14 },
  { name: '高雄市', flag: '🇹🇼', count: 85, percentage: 10 }
]

const devices = [
  { name: 'iOS', icon: 'mdi-apple', subtext: 'iPhone & iPad', percentage: 72, color: '#000000' },
  { name: 'Android', icon: 'mdi-android', subtext: 'Pixel, Samsung', percentage: 24, color: '#3DDC84' },
  { name: 'Desktop', icon: 'mdi-laptop', subtext: 'macOS & Windows', percentage: 4, color: '#64748B' }
]
</script>

<style scoped>
/* ─── Page Header ─── */
.profile-page-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.page-title { font-size: 28px; font-weight: 900; letter-spacing: -0.04em; color: #0f172a; margin-bottom: 4px; }
.page-subtitle { font-size: 14px; color: #64748b; margin: 0; }

/* ─── Bento Cards ─── */
.bento-card { background: white; border: 1px solid #F1F5F9 !important; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); overflow: hidden; position: relative; }
.bento-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px -12px rgba(0,0,0,0.08); }

/* ─── Icon Boxes ─── */
.icon-box { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
.icon-box.primary { background: #EEF2FF; color: #4F46E5; }
.icon-box.purple { background: #F5F3FF; color: #8B5CF6; }
.icon-box.orange { background: #FFF7ED; color: #F97316; }

/* ─── Map Placeholder ─── */
.map-placeholder { height: 300px; background: #F8FAFC; border-radius: 24px; position: relative; overflow: hidden; }
.map-illustration { position: relative; transform-style: preserve-3d; }
.glow-dot { position: absolute; border-radius: 50%; background: radial-gradient(circle, rgba(79, 70, 229, 0.6) 0%, transparent 70%); animation: pulse 2s infinite; z-index: 2; }
@keyframes pulse { 0% { opacity: 0.4; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.1); } 100% { opacity: 0.4; transform: scale(0.8); } }
.map-overlay-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.2; letter-spacing: 0.5em; pointer-events: none; }

/* ─── Location Mini Card ─── */
.location-mini-card { background: #F8FAFC; transition: all 0.2s; }
.location-mini-card:hover { border-color: #4F46E5; background: white; box-shadow: 0 8px 16px rgba(0,0,0,0.04); transform: translateY(-2px); }

/* ─── Hourly Grid ─── */
.hourly-grid { display: flex; align-items: flex-end; gap: 4px; height: 160px; padding-top: 20px; }
.hour-bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.hour-bar { width: 100%; border-radius: 4px 4px 0 0; background: linear-gradient(to top, #F1F5F9, #4F46E5); opacity: 0.4; transition: opacity 0.2s, height 0.5s; }
.hour-bar-wrap:hover .hour-bar { opacity: 0.9; }
.hour-label { font-size: 8px; font-weight: 700; color: #94A3B8; }

/* ─── Time Select ─── */
.time-select-wrap { background: white; border: 1px solid #E2E8F0; border-radius: 12px; padding: 0 12px; width: 140px; height: 36px; display: flex; align-items: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
.time-select-input :deep(.v-field__input) { font-size: 13px; font-weight: 700; color: #1e293b; min-height: unset; padding: 0; }

/* ─── Helpers ─── */
.card-title { font-size: 18px; font-weight: 900; color: #0F172A; letter-spacing: -0.03em; margin-bottom: 2px; }
.card-subtitle { font-size: 13px; color: #94A3B8; font-weight: 500; }
.bg-slate-50 { background-color: #F8FAFC; }
.text-slate-700 { color: #334155; }
.text-slate-300 { color: #CBD5E1; }
.border-dashed { border: 1.5px dashed #E2E8F0; }
.border-1 { border: 1px solid #F1F5F9; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
</style>
