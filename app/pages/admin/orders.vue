<template>
  <NuxtLayout name="admin">
    <div class="profile-page-header mb-8">
      <div>
        <h2 class="page-title">來單與轉化</h2>
        <p class="page-subtitle">追蹤您的成效漏斗、訂單轉換與商業增長指標</p>
      </div>
      <div class="d-flex align-center gap-3">
        <v-btn color="primary" rounded="xl" class="font-weight-black shadow-sm" prepend-icon="mdi-download">
          匯出報表
        </v-btn>
      </div>
    </div>

    <!-- Top Grid: Funnel & Key Metrics -->
    <v-row :gutter="20">
      <v-col cols="12" lg="7">
        <v-card class="bento-card glass-card pa-8 fill-height" rounded="xl" elevation="0">
          <div class="d-flex align-center gap-3 mb-10">
            <div class="icon-box primary">
              <v-icon size="20">mdi-filter-variant</v-icon>
            </div>
            <div>
              <h3 class="card-title">轉化漏斗分析</h3>
              <p class="card-subtitle">從訪客到實際轉化的路徑</p>
            </div>
          </div>

          <!-- Funnel Visualization -->
          <div class="funnel-container px-4">
            <div v-for="(step, idx) in funnelSteps" :key="step.label" class="funnel-step-wrap">
              <div class="funnel-bar-outer">
                <div class="funnel-bar-inner" :style="{ width: step.percentage + '%', opacity: 1 - (idx * 0.15) }">
                  <span class="funnel-value">{{ step.count }}</span>
                </div>
              </div>
              <div class="d-flex justify-space-between mt-2">
                <span class="text-caption font-weight-black text-slate-700">{{ step.label }}</span>
                <span class="text-caption text-grey">{{ step.percentage }}%</span>
              </div>
              <!-- Conversion rate between steps -->
              <div v-if="idx < funnelSteps.length - 1 && funnelSteps[idx+1]" class="funnel-connector">
                <v-icon size="14" color="primary">mdi-chevron-double-down</v-icon>
                <span class="text-xs font-weight-black text-primary ml-1">{{ funnelSteps[idx+1] ? Math.round((funnelSteps[idx+1].count / step.count) * 100) : 0 }}% 轉化</span>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" lg="5">
        <v-row :gutter="20">
          <v-col cols="12">
            <v-card class="bento-card bento-hero-card" rounded="xl" elevation="0">
              <div class="hero-glow"></div>
              <div class="card-inner pa-8 d-flex flex-column justify-center align-center text-center">
                <div class="hero-label mb-2">本月預估營收</div>
                <div class="hero-value mb-2">NT$ 42,850</div>
                <div class="d-flex align-center gap-2 text-success font-weight-black text-caption">
                  <v-icon size="14">mdi-arrow-up</v-icon> 較上月增長 18.5%
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card class="bento-card glass-card pa-8" rounded="xl" elevation="0">
              <div class="d-flex align-center gap-3 mb-6">
                <div class="icon-box green">
                  <v-icon size="20">mdi-currency-usd</v-icon>
                </div>
                <div>
                  <h3 class="card-title">平均訂單價值 (AOV)</h3>
                </div>
              </div>
              <div class="text-h4 font-weight-black text-slate-900">NT$ 1,250</div>
              <v-divider class="my-4"></v-divider>
              <div class="d-flex justify-space-between text-caption">
                <span class="text-grey font-weight-bold">付費用戶數</span>
                <span class="font-weight-black">34 位</span>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Bottom Row: Recent Orders -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="bento-card glass-card pa-8" rounded="xl" elevation="0">
          <div class="d-flex align-center justify-space-between mb-8">
            <div class="d-flex align-center gap-3">
              <div class="icon-box purple">
                <v-icon size="20">mdi-receipt-text-outline</v-icon>
              </div>
              <h3 class="card-title">近期成交紀錄</h3>
            </div>
            <v-btn variant="tonal" color="primary" rounded="xl" size="small" class="font-weight-bold">查看完整帳單</v-btn>
          </div>

          <v-table class="premium-table">
            <thead>
              <tr>
                <th class="text-left text-overline text-grey-darken-1">訂單編號</th>
                <th class="text-left text-overline text-grey-darken-1">訪客資訊</th>
                <th class="text-left text-overline text-grey-darken-1">成交方案</th>
                <th class="text-left text-overline text-grey-darken-1">成交金額</th>
                <th class="text-left text-overline text-grey-darken-1">日期</th>
                <th class="text-right text-overline text-grey-darken-1">狀態</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.id" class="table-row">
                <td class="font-weight-bold text-caption text-mono">{{ order.id }}</td>
                <td>
                  <div class="d-flex align-center gap-2">
                    <v-avatar size="24" color="slate-100">
                      <v-img :src="order.avatar"></v-img>
                    </v-avatar>
                    <span class="text-body-2 font-weight-bold">{{ order.user }}</span>
                  </div>
                </td>
                <td><v-chip size="x-small" variant="tonal" class="rounded-lg">{{ order.plan }}</v-chip></td>
                <td class="font-weight-black">NT$ {{ order.amount }}</td>
                <td class="text-caption text-grey">{{ order.date }}</td>
                <td class="text-right">
                  <v-chip color="success" size="x-small" class="font-weight-black" variant="flat">已入帳</v-chip>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const store = useProfileStore()
const profile = computed(() => store.profile)

const visitors = computed(() => (profile.value.interactiveStats?.likes * 3.5 || 12480))

const funnelSteps = computed(() => [
  { label: '總造訪訪客', count: Math.floor(visitors.value), percentage: 100 },
  { label: '查看連結次數', count: Math.floor(visitors.value * 0.38), percentage: 38 },
  { label: '點擊聯絡/購買', count: Math.floor(visitors.value * 0.06), percentage: 6 },
  { label: '最後成交', count: Math.floor(visitors.value * 0.01), percentage: 1 }
])

const recentOrders = [
  { id: 'PM-8241', user: 'Alex Lin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', plan: '進階專業版', amount: '1,980', date: '2024/02/27' },
  { id: 'PM-8240', user: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', plan: '基礎入門裝', amount: '680', date: '2024/02/26' },
  { id: 'PM-8239', user: 'Kevin Wang', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin', plan: '進階專業版', amount: '1,980', date: '2024/02/26' },
  { id: 'PM-8238', user: 'Emma H.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', plan: 'VIP 尊爵包', amount: '4,500', date: '2024/02/25' }
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

/* ─── Hero Metric Card ─── */
.bento-hero-card { background: linear-gradient(135deg, #10B981 0%, #064E3B 100%) !important; height: 100%; }
.hero-glow { position: absolute; top: -100px; right: -100px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%); z-index: 1; }
.card-inner { position: relative; z-index: 2; height: 100%; }
.hero-label { font-size: 13px; font-weight: 800; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 0.1em; }
.hero-value { font-size: 42px; font-weight: 900; color: white; letter-spacing: -0.05em; line-height: 1; }

/* ─── Icon Boxes ─── */
.icon-box { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
.icon-box.primary { background: #EEF2FF; color: #4F46E5; }
.icon-box.purple { background: #F5F3FF; color: #8B5CF6; }
.icon-box.green { background: #ECFDF5; color: #10B981; }

/* ─── Funnel Visualization ─── */
.funnel-container { display: flex; flex-direction: column; gap: 8px; }
.funnel-step-wrap { position: relative; margin-bottom: 24px; }
.funnel-bar-outer { height: 48px; background: #F8FAFC; border-radius: 16px; overflow: hidden; display: flex; align-items: center; padding: 0 4px; border: 1px solid #F1F5F9; }
.funnel-bar-inner { height: 40px; background: linear-gradient(90deg, #4F46E5, #818CF8); border-radius: 12px; transition: width 1s ease; position: relative; display: flex; align-items: center; justify-content: flex-end; padding-right: 16px; }
.funnel-value { font-size: 14px; font-weight: 900; color: white; }
.funnel-connector { position: absolute; left: 50%; bottom: -32px; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; z-index: 2; }

/* ─── Premium Table ─── */
.premium-table { background: transparent !important; }
.table-row { transition: background 0.2s; cursor: pointer; }
.table-row:hover { background: #F8FAFC !important; }
.text-mono { font-family: 'JetBrains Mono', monospace; letter-spacing: -0.02em; }
.shadow-sm { box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important; }

/* ─── Helpers ─── */
.card-title { font-size: 18px; font-weight: 900; color: #0F172A; letter-spacing: -0.03em; margin-bottom: 2px; }
.card-subtitle { font-size: 13px; color: #94A3B8; font-weight: 500; }
.text-slate-900 { color: #0F172A; }
.text-slate-700 { color: #334155; }
.text-xs { font-size: 11px; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
</style>
