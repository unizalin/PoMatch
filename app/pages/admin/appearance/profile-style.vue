<template>
  <NuxtLayout name="admin">
    <div class="profile-page-header mb-8">
      <div>
        <h2 class="page-title">簡介樣式</h2>
        <p class="page-subtitle">自定義頭像光暈、文字排版與整體的視覺圓角</p>
      </div>
      <div class="d-flex align-center gap-3">
        <v-btn color="primary" rounded="xl" class="font-weight-black shadow-sm" @click="saveProfileStyle">
          儲存變更
        </v-btn>
      </div>
    </div>

    <v-row :gutter="20">
      <!-- Controls Column -->
      <v-col cols="12" lg="7">
        <div class="d-flex flex-column gap-6">
          
          <!-- Bento Case: Avatar Styling -->
          <v-card class="bento-card glass-card pa-8" rounded="xl" elevation="0">
            <div class="d-flex align-center gap-3 mb-10">
              <div class="icon-box primary">
                <v-icon size="20">mdi-account-circle-outline</v-icon>
              </div>
              <div>
                <h3 class="card-title">頭像視覺</h3>
                <p class="card-subtitle">打造具有辨識度的頭像呈現方式</p>
              </div>
            </div>

            <v-row :gutter="24">
              <v-col cols="12" md="6">
                <div class="text-caption font-weight-black text-slate-700 mb-4">外框發光強度 (Glow)</div>
                <v-slider
                  v-model="profileStyle.avatarGlow"
                  min="0"
                  max="40"
                  color="primary"
                  hide-details
                ></v-slider>
              </v-col>
              <v-col cols="12" md="6">
                <div class="text-caption font-weight-black text-slate-700 mb-4">外框粗細 (Border)</div>
                <v-slider
                  v-model="profileStyle.avatarBorderWidth"
                  min="0"
                  max="10"
                  color="slate-300"
                  hide-details
                ></v-slider>
              </v-col>
              <v-col cols="12" md="6">
                <div class="text-caption font-weight-black text-slate-700 mb-4">圓角弧度 (Radius)</div>
                <div class="d-flex gap-2">
                  <v-btn-toggle v-model="profileStyle.avatarShape" color="primary" variant="tonal" rounded="xl" density="comfortable" mandatory>
                    <v-btn value="circle" icon="mdi-circle-outline"></v-btn>
                    <v-btn value="rounded" icon="mdi-rounded-corner"></v-btn>
                    <v-btn value="square" icon="mdi-square-outline"></v-btn>
                  </v-btn-toggle>
                </div>
              </v-col>
            </v-row>
          </v-card>

          <!-- Bento Case: Typography -->
          <v-card class="bento-card glass-card pa-8" rounded="xl" elevation="0">
            <div class="d-flex align-center gap-3 mb-10">
              <div class="icon-box purple">
                <v-icon size="20">mdi-format-text</v-icon>
              </div>
              <div>
                <h3 class="card-title">文字排版樣式</h3>
                <p class="card-subtitle">調整您的稱呼與簡介的字型權重</p>
              </div>
            </div>

            <div class="control-group mb-8">
              <div class="text-caption font-weight-black text-slate-700 mb-4">稱呼字級大小 (Name Size)</div>
              <v-slider
                v-model="profileStyle.nameFontSize"
                min="18"
                max="36"
                step="1"
                color="purple"
                hide-details
              ></v-slider>
            </div>

            <div class="control-group">
              <div class="text-caption font-weight-black text-slate-700 mb-4">簡介字距 (Letter Spacing)</div>
              <v-slider
                v-model="profileStyle.bioLetterSpacing"
                min="-1"
                max="4"
                step="0.5"
                color="indigo"
                hide-details
              ></v-slider>
            </div>
          </v-card>

          <!-- Bento Case: Layout Spacing -->
          <v-card class="bento-card glass-card pa-8" rounded="xl" elevation="0">
            <div class="d-flex align-center gap-3 mb-10">
              <div class="icon-box orange">
                <v-icon size="20">mdi-view-dashboard-outline</v-icon>
              </div>
              <div>
                <h3 class="card-title">間距與佈局</h3>
                <p class="card-subtitle">控制組件之間的呼吸感</p>
              </div>
            </div>

            <v-row :gutter="24">
              <v-col cols="12" md="6">
                <div class="text-caption font-weight-black text-slate-700 mb-4">頭像與文字間距</div>
                <v-slider
                  v-model="profileStyle.spacing"
                  min="0"
                  max="48"
                  color="orange"
                  hide-details
                ></v-slider>
              </v-col>
            </v-row>
          </v-card>

        </div>
      </v-col>

      <!-- Preview Column (Real-time Sync) -->
      <v-col cols="12" lg="5">
        <div class="sticky-preview">
          <div class="device-preview-container">
            <ProfileCard :profile="store.profile" :profile-style="previewStyle" />
            <div class="preview-badge">樣式觀摩</div>
          </div>
        </div>
      </v-col>
    </v-row>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'
import ProfileCard from '~/components/ProfileCard.vue'

definePageMeta({ layout: false })

const store = useProfileStore()

const profileStyle = ref({
  avatarGlow: 15,
  avatarBorderWidth: 2,
  avatarShape: 'circle',
  nameFontSize: 24,
  bioLetterSpacing: 0.5,
  spacing: 24
})

const previewStyle = computed(() => {
  return {
    '--avatar-glow': `${profileStyle.value.avatarGlow}px`,
    '--avatar-border': `${profileStyle.value.avatarBorderWidth}px`,
    '--avatar-radius': profileStyle.value.avatarShape === 'circle' ? '50%' : (profileStyle.value.avatarShape === 'rounded' ? '24px' : '0px'),
    '--name-size': `${profileStyle.value.nameFontSize}px`,
    '--bio-spacing': `${profileStyle.value.bioLetterSpacing}px`,
    '--layout-spacing': `${profileStyle.value.spacing}px`
  }
})

const saveProfileStyle = () => {
  store.updateProfile({ profileStyle: profileStyle.value })
}
</script>

<style scoped>
/* ─── Page Header ─── */
.profile-page-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.page-title { font-size: 28px; font-weight: 900; letter-spacing: -0.04em; color: #0f172a; margin-bottom: 4px; }
.page-subtitle { font-size: 14px; color: #64748b; margin: 0; }

/* ─── Bento Cards ─── */
.bento-card { background: white; border: 1px solid #F1F5F9 !important; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); overflow: hidden; position: relative; }

/* ─── Icon Boxes ─── */
.icon-box { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
.icon-box.primary { background: #EEF2FF; color: #4F46E5; }
.icon-box.purple { background: #F5F3FF; color: #8B5CF6; }
.icon-box.orange { background: #FFF7ED; color: #F97316; }

/* ─── Sticky Preview ─── */
.sticky-preview { position: sticky; top: 120px; display: flex; justify-content: center; }
.device-preview-container { position: relative; padding: 20px; background: #F8FAFC; border-radius: 40px; border: 1px solid #F1F5F9; }
.preview-badge { position: absolute; top: 20px; right: 20px; background: #0F172A; color: white; padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 900; letter-spacing: 0.1em; }

/* ─── Helpers ─── */
.card-title { font-size: 18px; font-weight: 900; color: #0F172A; letter-spacing: -0.03em; margin-bottom: 2px; }
.card-subtitle { font-size: 13px; color: #94A3B8; font-weight: 500; }
.text-slate-700 { color: #334155; }
.gap-3 { gap: 12px; }
.gap-6 { gap: 24px; }
.shadow-sm { box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important; }
</style>
