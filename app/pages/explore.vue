<template>
  <div class="explore-container pa-4">
    <div class="max-width-container mx-auto">
      <!-- Header Section -->
      <header class="mb-8 text-center pt-8">
        <v-icon size="48" color="primary" class="mb-4">mdi-compass-outline</v-icon>
        <h1 class="text-h4 font-weight-bold mb-2">尋找你的契合夥伴</h1>
        <p class="text-body-1 text-grey-darken-1">探索 PoMatch 社群，發現與你最契合的靈魂。</p>
      </header>

      <!-- Search & Filters -->
      <v-row class="mb-8">
        <v-col cols="12">
          <v-text-field
            v-model="search"
            placeholder="搜尋名稱、地點或興趣標籤..."
            prepend-inner-icon="mdi-magnify"
            variant="solo"
            flat
            class="rounded-pill search-bar elevation-2"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- Profiles Grid -->
      <v-row v-if="store.loading" class="justify-center py-12">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </v-row>
      
      <v-row v-else-if="filteredProfiles.length > 0">
        <v-col
          v-for="profile in filteredProfiles"
          :key="profile.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <ProfileCard :profile="profile" />
        </v-col>
      </v-row>

      <v-row v-else class="justify-center py-12 text-center">
        <v-col cols="12">
          <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-filter-off-outline</v-icon>
          <h3 class="text-h6 text-grey">找不到符合條件的個人檔案</h3>
          <v-btn variant="text" color="primary" @click="search = ''">清除搜尋條件</v-btn>
        </v-col>
      </v-row>
      
      <!-- Footer Info -->
      <footer class="mt-12 mb-8 text-center">
        <v-chip variant="outlined" color="grey-lighten-1" size="small" class="px-5 letter-spacing-wide">
          POMATCH DISCOVERY
        </v-chip>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { useProfileStore } from '~/stores/profile'

const store = useProfileStore()
const search = ref('')

onMounted(async () => {
    await store.fetchAllProfiles()
})

const filteredProfiles = computed(() => {
    if (!search.value) return store.allProfiles
    
    const query = search.value.toLowerCase()
    return store.allProfiles.filter(p => {
        return (
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.persona.location.toLowerCase().includes(query) ||
            p.persona.tags.some(tag => tag.toLowerCase().includes(query)) ||
            p.persona.mbti.toLowerCase().includes(query)
        )
    })
})
</script>

<style scoped lang="scss">
.explore-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #F9FAFB 0%, #F3F4F6 100%);
  overflow-x: hidden;
}

.max-width-container {
  max-width: 1200px;
}

.search-bar {
  :deep(.v-field) {
    border-radius: 99px !important;
    background: white !important;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }
}

.letter-spacing-wide {
  letter-spacing: 2px !important;
  font-size: 10px !important;
  font-weight: 700;
}
</style>
