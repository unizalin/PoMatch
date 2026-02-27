<template>
  <NuxtLayout name="admin">
    <div class="d-flex align-center justify-space-between mb-6">
      <h2 class="text-h5 font-weight-bold">連結管理</h2>
      <v-btn color="primary" prepend-icon="mdi-plus" rounded="lg">新增第一個連結</v-btn>
    </div>

    <v-card class="glass-card pa-12 text-center d-flex flex-column align-center">
      <v-img
        src="https://cdn.vuetifyjs.com/images/cards/foster.jpg" 
        width="200"
        class="mb-4 rounded-circle"
      ></v-img>
      <div class="text-h6 font-weight-bold mb-2">踏出全球曝光的第一步</div>
      <div class="text-body-2 text-grey mb-6">從上方新增你的第一個連結</div>
      
      <v-btn variant="outlined" color="primary" prepend-icon="mdi-import" class="mb-4">
        快速匯入 Linktree / Linkby 資料
      </v-btn>
    </v-card>

    <div class="mt-8">
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="搜尋連結名稱"
        variant="outlined"
        density="compact"
        hide-details
        class="mb-4 glass-card"
      ></v-text-field>

      <v-table class="glass-card overflow-hidden">
        <thead class="bg-blue-lighten-4">
          <tr>
            <th class="text-left font-weight-bold">No.</th>
            <th class="text-left font-weight-bold">連結名稱</th>
            <th class="text-left font-weight-bold">點擊數</th>
            <th class="text-left font-weight-bold">瀏覽數</th>
            <th class="text-left font-weight-bold">點擊率</th>
            <th class="text-left font-weight-bold">近7天成長率</th>
            <th class="text-left font-weight-bold">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="7" class="text-center pa-8 text-grey">目前尚無連結數據</td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </NuxtLayout>
</template>

<script setup>
const search = ref('')
</script>
