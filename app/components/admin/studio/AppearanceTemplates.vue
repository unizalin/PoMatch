<template>
  <div class="studio-appearance-templates">
    <div class="studio-section-header mb-6">
      <div>
        <h2 class="studio-title">風格模版</h2>
        <p class="studio-subtitle">選擇專業設計師製作的模版，一鍵提升名片質感</p>
      </div>
    </div>

    <div class="section-card">
      <div class="template-grid">
        <div v-for="i in 6" :key="i" class="template-skeleton">
          <div class="skeleton-preview mb-3"></div>
          <div class="skeleton-text"></div>
        </div>
      </div>
      
      <div class="mt-8 text-center pa-8 border-dashed rounded-xl">
        <v-icon size="48" color="grey-lighten-2" class="mb-4">mdi-auto-fix</v-icon>
        <p class="text-h6 font-weight-bold text-grey-darken-1 mb-1">更多模版即將推出</p>
        <p class="text-caption text-grey">我們正在為您準備更多精美的專業設計...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.studio-section-header { display: flex; align-items: center; justify-content: space-between; }
.studio-title { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
.studio-subtitle { font-size: 13px; color: #94a3b8; }
.section-card { background: white; border: 1px solid #f1f5f9; border-radius: 20px; padding: 24px; }

.template-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.template-skeleton { border: 1px solid #f1f5f9; border-radius: 16px; padding: 12px; opacity: 0.5; }
.skeleton-preview { height: 120px; background: #f8fafc; border-radius: 12px; }
.skeleton-text { height: 12px; width: 60%; background: #f1f5f9; border-radius: 6px; }

.border-dashed { border: 2px dashed #f1f5f9; }
</style>
