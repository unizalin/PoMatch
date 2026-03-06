<template>
  <div class="studio-appearance-profile">
    <!-- Component Header -->
    <div class="studio-section-header mb-6">
      <div>
        <h2 class="studio-title">簡介樣式</h2>
        <p class="studio-subtitle">自定義頭像與文字外觀，展現獨特的個人風格</p>
      </div>
    </div>

    <!-- ── Avatar Styling ── -->
    <div class="section-card mb-4">
      <div class="section-label">
        <v-icon size="16" color="primary">mdi-image-outline</v-icon>
        頭像進階設定
      </div>

      <div class="control-row mb-6">
        <div class="control-label d-flex justify-space-between">
          <span>頭像外光暈 (Glow)</span>
          <span class="text-primary font-weight-bold">{{ store.profile.themeConfig.profileGlow * 100 }}%</span>
        </div>
        <v-slider
          v-model="store.profile.themeConfig.profileGlow"
          min="0"
          max="2"
          step="0.1"
          hide-details
          color="primary"
        ></v-slider>
      </div>

      <div class="form-row">
        <div class="form-field">
          <label class="field-label">邊框寬度</label>
          <div class="field-input-wrap">
            <v-icon size="16" class="field-icon">mdi-border-all-variant</v-icon>
            <input
              v-model.number="store.profile.themeConfig.profileBorderWidth"
              type="number"
              class="field-input field-with-icon"
              placeholder="px"
            />
          </div>
        </div>
        <div class="form-field">
          <label class="field-label">圓角百分比</label>
          <div class="field-input-wrap">
            <v-icon size="16" class="field-icon">mdi-rounded-corner</v-icon>
            <input
              v-model.number="store.profile.themeConfig.profileBorderRadius"
              type="number"
              class="field-input field-with-icon"
              placeholder="%"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- ── Typography ── -->
    <div class="section-card">
      <div class="section-label">
        <v-icon size="16" color="deep-purple">mdi-format-text</v-icon>
        文字與佈局
      </div>

      <div class="control-row mb-4">
        <div class="control-label">姓名文字大小 (Scale)</div>
        <v-slider
          v-model="store.profile.themeConfig.nameScale"
          min="0.8"
          max="1.5"
          step="0.05"
          hide-details
          color="deep-purple"
        ></v-slider>
      </div>

      <div class="control-row mb-4">
        <div class="control-label">大頭貼上下微調 (Avatar Y-Offset)</div>
        <v-slider
          v-model="store.profile.themeConfig.vOffset"
          min="-50"
          max="50"
          step="1"
          hide-details
          color="deep-purple-accent-2"
        ></v-slider>
      </div>

      <div class="control-row mb-4">
        <div class="control-label">文字內容上下微調 (Text Y-Offset)</div>
        <v-slider
          v-model="store.profile.themeConfig.textVOffset"
          min="-50"
          max="50"
          step="1"
          hide-details
          color="indigo-lighten-2"
        ></v-slider>
      </div>

      <div class="control-row mb-4">
        <div class="control-label">大頭貼左右微調 (Avatar X-Offset)</div>
        <v-slider
          v-model="store.profile.themeConfig.avatarOffset"
          min="-40"
          max="40"
          step="1"
          hide-details
          color="primary"
        ></v-slider>
      </div>

      <div class="control-row mb-4">
        <div class="control-label">文字內容左右微調 (Text X-Offset)</div>
        <v-slider
          v-model="store.profile.themeConfig.textOffset"
          min="-40"
          max="40"
          step="1"
          hide-details
          color="indigo"
        ></v-slider>
      </div>

      <div class="control-row">
        <div class="control-label">垂直間距 (Gap)</div>
        <v-slider
          v-model="store.profile.themeConfig.contentGap"
          min="8"
          max="32"
          step="2"
          hide-details
          color="deep-purple"
        ></v-slider>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'

const store = useProfileStore()
const config = computed(() => store.profile.themeConfig)

// Watch for deep changes in themeConfig components handled here
watch(() => config.value, (newVal) => {
  store.debouncedUpdateProfile({ themeConfig: newVal })
}, { deep: true })
</script>

<style scoped>
.studio-section-header { display: flex; align-items: center; justify-content: space-between; }
.studio-title { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
.studio-subtitle { font-size: 13px; color: #94a3b8; }

.section-card { background: white; border: 1px solid #f1f5f9; border-radius: 20px; padding: 24px; }
.section-label { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 20px; }

.control-row { margin-bottom: 12px; }
.control-label { font-size: 12px; font-weight: 600; color: #64748b; margin-bottom: 8px; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-field { display: flex; flex-direction: column; }
.field-label { font-size: 12px; font-weight: 600; color: #64748b; margin-bottom: 6px; }
.field-input {
  width: 100%; height: 42px; padding: 0 14px; border: 1.5px solid #e2e8f0; border-radius: 12px;
  font-size: 14px; color: #0f172a; background: white; outline: none; transition: all 0.15s;
}
.field-input:focus { border-color: #1867c0; box-shadow: 0 0 0 3px rgba(24,103,192,0.1); }

.field-input-wrap { position: relative; }
.field-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); opacity: 0.4; pointer-events: none; }
.field-with-icon { padding-left: 36px; }
</style>
