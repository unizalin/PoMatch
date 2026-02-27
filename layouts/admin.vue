<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" permanent class="bg-grey-lighten-4">
      <div class="pa-4 d-flex align-center">
        <h2 class="text-primary font-weight-bold">POMATCH</h2>
      </div>
      
      <v-list density="compact" nav>
        <v-btn
          block
          color="orange-lighten-1"
          prepend-icon="mdi-flash"
          class="mb-4 text-white font-weight-bold elevation-2"
          rounded="lg"
        >
          升級 Plus
        </v-btn>

        <v-list-subheader class="text-uppercase text-caption font-weight-bold">我的內容</v-list-subheader>
        <v-list-item
          prepend-icon="mdi-link-variant"
          title="連結"
          value="links"
          to="/admin/links"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-outline"
          title="個人簡介"
          value="profile"
          to="/admin/profile"
        ></v-list-item>

        <v-list-subheader class="text-uppercase text-caption font-weight-bold mt-4">外觀風格</v-list-subheader>
        <v-list-item
          prepend-icon="mdi-palette-outline"
          title="模版"
          value="templates"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-image-outline"
          title="背景"
          value="background"
        ></v-list-item>

        <v-list-subheader class="text-uppercase text-caption font-weight-bold mt-4">數據分析</v-list-subheader>
        <v-list-item
          prepend-icon="mdi-chart-line"
          title="成效總覽"
          value="analytics"
          to="/admin/analytics"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-cursor-default-click-outline"
          title="連結成效"
          value="link-stats"
        ></v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-4">
          <v-card variant="tonal" density="compact" color="grey" class="pa-2 d-flex align-center">
            <v-avatar size="24" class="mr-2">
              <v-icon size="16">mdi-account</v-icon>
            </v-avatar>
            <span class="text-caption">User</span>
            <v-spacer></v-spacer>
            <v-chip size="x-small" color="success">Free</v-chip>
          </v-card>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-5">
      <v-container fluid class="pa-6">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
const drawer = ref(true)
</script>

<style scoped>
:deep(.v-list-item--active) {
  background-color: var(--v-primary-lighten-5);
  color: #1867C0 !important;
}
</style>
