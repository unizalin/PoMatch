<template>
  <v-card
    :to="`/${profile.username}`"
    class="profile-card elevation-2 rounded-xl border-all overflow-hidden mb-4"
    :class="profile.theme || 'glassmorphism'"
    v-ripple
  >
    <div class="card-content pa-4">
      <div class="d-flex align-center mb-4">
        <v-avatar size="64" class="avatar-shadow mr-4">
          <v-img :src="profile.avatar || 'https://api.dicebear.com/7.x/avataaars/svg'"></v-img>
        </v-avatar>
        <div class="flex-grow-1">
          <h3 class="text-h6 font-weight-bold mb-0 text-truncate">{{ profile.name }}</h3>
          <p class="text-caption text-grey-darken-1 mb-0">{{ profile.persona.location }}</p>
        </div>
        <div class="match-badge text-center">
            <div class="match-percent font-weight-black text-primary">{{ profile.interactiveStats?.matchScore || '??' }}%</div>
            <div class="text-overline line-height-1">MATCH</div>
        </div>
      </div>

      <p class="text-body-2 text-grey-darken-2 mb-4 line-clamp-2 px-1">
        {{ profile.description }}
      </p>

      <div class="d-flex flex-wrap gap-1 mb-2">
        <v-chip size="x-small" variant="tonal" color="primary" class="font-weight-bold">{{ profile.persona.mbti }}</v-chip>
        <v-chip size="x-small" variant="tonal" color="secondary" class="font-weight-bold">{{ profile.persona.zodiac }}</v-chip>
      </div>
      
      <div class="d-flex flex-wrap gap-1">
        <v-chip v-for="tag in (profile.persona.tags || []).slice(0, 3)" :key="tag" size="x-small" variant="outlined" color="grey" class="text-caption">
          #{{ tag }}
        </v-chip>
      </div>
    </div>
  </v-card>
</template>

<script setup>
defineProps({
  profile: {
    type: Object,
    required: true
  }
})
</script>

<style scoped lang="scss">
.profile-card {
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
    border-color: var(--v-primary-base) !important;
  }
}

.avatar-shadow {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid white;
}

.match-badge {
    background: rgba(var(--v-theme-primary), 0.1);
    padding: 6px 10px;
    border-radius: 12px;
}

.match-percent {
    font-size: 1.1rem;
    line-height: 1;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gap-1 {
  gap: 4px;
}

.line-height-1 {
    line-height: 1;
}

.border-all {
    border: 1px solid rgba(0, 0, 0, 0.05) !important;
}
</style>
