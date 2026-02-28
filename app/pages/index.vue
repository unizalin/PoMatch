<template>
  <div class="landing-shell aurora-container">
    <!-- Aurora Glows -->
    <div class="aurora-glow glow-1"></div>
    <div class="aurora-glow glow-2"></div>
    <div class="aurora-glow glow-3"></div>

    <!-- Sticky Navbar -->
    <v-app-bar flat class="glass-nav px-md-12" height="70">
      <div class="d-flex align-center w-100">
        <v-img src="/favicon.ico" width="32" height="32" class="mr-2"></v-img>
        <h2 class="text-h6 font-weight-black text-primary letter-spacing-1">PoMatch</h2>
        <v-spacer />
        <div class="hidden-sm-and-down">
          <v-btn to="/explore" variant="text" class="text-none font-weight-bold mx-2">探索</v-btn>
          <v-btn to="/login" variant="text" class="text-none font-weight-bold mx-2">登入</v-btn>
        </div>
        <v-btn to="/register" color="primary" class="rounded-pill-custom px-6 font-weight-bold text-none elevation-0 ml-4">
          免費建立
        </v-btn>
      </div>
    </v-app-bar>

    <v-main>
      <v-container class="py-16">
        <!-- Hero Section -->
        <v-row align="center" justify="center" class="hero-section text-center min-vh-70">
          <v-col cols="12" md="8" lg="7">
            <v-chip color="primary" variant="tonal" class="mb-4 font-weight-bold px-4">🚀 下一代數位名片系統</v-chip>
            <h1 class="text-h2 font-weight-black mb-6 line-height-tight">
              一個連結，
              <span class="text-primary">連結你的全世界</span>
            </h1>
            <p class="text-h6 text-grey-darken-1 mb-10 font-weight-medium">
              專為創作者與專業人士設計。整合社交媒體、作品集，
              並透過 AI 引擎尋找與你契合的夥伴。
            </p>

            <!-- Mock URL Input (LinkGoods style) -->
            <div class="mock-url-container mx-auto mb-10 elevated-card px-6 py-3 d-flex align-center">
              <span class="text-grey-lighten-1 font-weight-bold mr-2">po-match.vercel.app/</span>
              <input type="text" placeholder="yourname" class="url-input font-weight-bold flex-grow-1" />
              <v-btn color="primary" rounded="pill" class="px-8 font-weight-bold hidden-xs-only">立即領取</v-btn>
            </div>

            <div class="d-flex flex-wrap justify-center gap-4">
              <v-btn to="/register" size="x-large" color="primary" class="rounded-pill-custom px-10 elevation-8 font-weight-bold">
                開始使用 — 免費
              </v-btn>
              <v-btn to="/explore" size="x-large" variant="outlined" color="primary" class="rounded-pill-custom px-10 font-weight-bold border-2">
                瀏覽社群
              </v-btn>
            </div>
          </v-col>
          
          <v-col cols="12" md="10" class="mt-12">
            <div class="illustration-wrapper elevated-card mx-auto">
              <v-img src="/assets/hero_illustration.png" cover class="hero-img-rounded"></v-img>
            </div>
          </v-col>
        </v-row>

        <!-- Stats/Social Proof -->
        <v-row class="mt-16 text-center">
          <v-col cols="12">
            <p class="text-overline text-grey-lighten-1 font-weight-bold mb-8">TRUSTED BY 10,000+ CREATORS</p>
            <div class="d-flex flex-wrap justify-center align-center opacity-40 grayscale gap-12">
               <v-icon size="48">mdi-youtube</v-icon>
               <v-icon size="48">mdi-instagram</v-icon>
               <v-icon size="48">mdi-facebook</v-icon>
               <v-icon size="48">mdi-twitter</v-icon>
               <v-icon size="48">mdi-linkedin</v-icon>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Footer -->
    <footer class="py-8 border-t text-center bg-white">
      <p class="text-caption text-grey">© 2026 PoMatch. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.landing-shell {
  background: white;
  min-height: 100vh;
}

.glass-nav {
  background: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.hero-section {
  padding-top: 60px;
}

.line-height-tight {
  line-height: 1.1;
}

.min-vh-70 {
  min-height: 70vh;
}

.mock-url-container {
  max-width: 500px;
  background: white;
  border-radius: 99px;
  border: 4px solid #f0f4f8;
  transition: all 0.3s ease;
  
  &:focus-within {
    border-color: var(--v-primary-base);
    transform: scale(1.02);
  }
}

.url-input {
  border: none;
  outline: none;
  font-size: 1.1rem;
  color: #1a1a1a;
  width: 100px;
  
  &::placeholder {
    color: #cbd5e0;
  }
}

.illustration-wrapper {
  background: white;
  padding: 2px;
  border-radius: 40px;
  max-width: 900px;
}

.hero-img-rounded {
  border-radius: 38px;
}

.letter-spacing-1 {
  letter-spacing: 1px;
}

.gap-4 {
  gap: 16px;
}

.gap-12 {
  gap: 48px;
}

.opacity-40 { opacity: 0.4; }
.grayscale { filter: grayscale(1); }

.border-2 {
  border-width: 2px !important;
}

@media (max-width: 600px) {
  .text-h2 {
    font-size: 2.5rem !important;
  }
}
</style>
