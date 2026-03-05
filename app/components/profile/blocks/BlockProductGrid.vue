<template>
  <div class="block-product-grid px-1">
    <div class="block-label d-flex align-center mb-3">
      <v-icon size="14" class="mr-1" color="primary">mdi-view-grid-outline</v-icon>
      <span class="text-tiny font-weight-black opacity-60 uppercase">{{ title }}</span>
    </div>
    
    <v-row dense>
      <v-col v-for="(item, idx) in items" :key="idx" cols="6">
        <div class="product-item-glass h-100 overflow-hidden">
          <!-- Image Placeholder / Real Image -->
          <div class="product-image-container">
            <template v-if="item.img">
              <v-img :src="item.img" cover height="80" class="product-img"></v-img>
            </template>
            <div v-else class="product-img-placeholder d-flex align-center justify-center">
              <v-icon size="24" color="white" class="opacity-30">mdi-image-outline</v-icon>
            </div>
            <!-- Price Badge -->
            <div v-if="item.price" class="price-badge font-weight-black">
              ${{ item.price }}
            </div>
          </div>
          <div class="pa-2">
            <div class="product-name font-weight-black text-truncate">{{ item.name }}</div>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  title: string
  items?: any[]
}>()

const items = computed(() => {
  if (props.items && props.items.length > 0) return props.items
  // Default mock items if none provided
  return [
    { name: '樣品項目 A', price: '99', img: '' },
    { name: '樣品項目 B', price: '149', img: '' }
  ]
})
</script>

<style scoped>
.product-item-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  transition: transform 0.2s;
}

.product-image-container {
  position: relative;
  height: 80px;
}

.product-img-placeholder {
  height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 100%);
}

.price-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  color: white;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 10px;
}

.product-name {
  font-size: 11px;
  color: white;
}

.text-tiny { font-size: 10px; }
.uppercase { text-transform: uppercase; }
</style>
