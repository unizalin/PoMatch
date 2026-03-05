<template>
  <div class="block-schedule px-1">
    <div class="block-label d-flex align-center mb-3">
      <v-icon size="14" class="mr-1" color="primary">mdi-calendar-clock</v-icon>
      <span class="text-tiny font-weight-black opacity-60 uppercase">{{ title }}</span>
    </div>

    <div class="schedule-container-glass pa-3">
      <div v-for="(day, idx) in days" :key="idx" class="schedule-row d-flex align-center justify-space-between py-2">
        <div class="day-label font-weight-black">{{ day.label }}</div>
        <div class="time-slot px-3 py-1 rounded-pill font-weight-bold">
          {{ day.time || '10:00 - 18:00' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  title: string
  days?: any[]
}>()

const days = computed(() => {
  if (props.days && props.days.length > 0) return props.days
  return [
    { label: '週一', time: '10:00 - 20:00' },
    { label: '週三', time: '10:00 - 20:00' },
    { label: '週五', time: '14:00 - 21:00' }
  ]
})
</script>

<style scoped>
.schedule-container-glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}

.schedule-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  &:last-child { border-bottom: none; }
}

.day-label {
  font-size: 13px;
  color: white;
}

.time-slot {
  font-size: 11px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.text-tiny { font-size: 10px; }
.uppercase { text-transform: uppercase; }
</style>
