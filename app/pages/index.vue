<template>
  <div class="landing-container d-flex flex-column align-center justify-center fill-height">
    <div class="glass-card pa-8 text-center max-width-mobile">
      <v-icon size="64" color="primary" class="mb-4">mdi-cards-heart</v-icon>
      <h1 class="text-h4 font-weight-bold mb-2">PoMatch</h1>
      <p class="text-body-1 text-grey-darken-1 mb-8">專屬你的數位名片，整合所有連結與社交媒體。</p>
      
      <v-btn
        to="/register"
        color="primary"
        size="large"
        block
        class="rounded-xl mb-4"
        elevation="0"
      >
        立即建立名片
      </v-btn>
      
      <v-btn
        variant="text"
        color="grey"
        class="text-caption"
      >
        瞭解更多
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.landing-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.max-width-mobile {
  max-width: 400px;
}
.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
</style>
