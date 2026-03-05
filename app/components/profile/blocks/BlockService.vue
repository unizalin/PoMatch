<template>
  <div class="block-service px-1">
    <div class="block-label d-flex align-center mb-3">
      <v-icon size="14" class="mr-1" color="primary">mdi-briefcase-variant-outline</v-icon>
      <span class="text-tiny font-weight-black opacity-60 uppercase">{{ title }}</span>
    </div>

    <div class="service-card-glass pa-4 text-left">
      <div v-if="details" class="service-details font-weight-medium mb-3">
        {{ details }}
      </div>
      <v-chip v-if="tag" size="x-small" color="primary" variant="flat" class="font-weight-black uppercase">
        {{ tag }}
      </v-chip>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  details?: string
  tag?: string
}>()
</script>

<style scoped>
.service-card-glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.service-details {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

.text-tiny { font-size: 10px; }
.uppercase { text-transform: uppercase; }
</style>
