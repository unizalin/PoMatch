<template>
  <NuxtLayout name="admin">
    <div class="d-flex align-center justify-space-between mb-6">
      <h2 class="text-h5 font-weight-bold">連結管理</h2>
      <v-btn color="primary" prepend-icon="mdi-plus" rounded="lg" @click="openDialog">新增連結</v-btn>
    </div>

    <div v-if="links.length === 0" class="mt-8">
        <v-card class="glass-card pa-12 text-center d-flex flex-column align-center">
        <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-link-variant-off</v-icon>
        <div class="text-h6 font-weight-bold mb-2">尚無任何連結</div>
        <div class="text-body-2 text-grey mb-6">點擊上方按鈕開始建立你的第一個連結</div>
        </v-card>
    </div>

    <div v-else class="mt-8">
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
        <thead class="bg-grey-lighten-4">
          <tr>
            <th class="text-left font-weight-bold">連結名稱</th>
            <th class="text-left font-weight-bold">點擊數</th>
            <th class="text-left font-weight-bold">網址</th>
            <th class="text-right font-weight-bold">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="link in filteredLinks" :key="link.id">
            <td class="d-flex align-center py-3">
                <v-icon class="mr-3" color="primary">{{ link.icon || 'mdi-link-variant' }}</v-icon>
                <span class="font-weight-medium">{{ link.title }}</span>
            </td>
            <td>{{ link.clicks || 0 }}</td>
            <td class="text-caption text-grey text-truncate" style="max-width: 200px">{{ link.url }}</td>
            <td class="text-right">
                <v-btn icon variant="text" size="small" color="error" @click="confirmDelete(link)">
                    <v-icon>mdi-delete-outline</v-icon>
                </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>

    <!-- Add Link Dialog -->
    <v-dialog v-model="dialog" max-width="500">
        <v-card class="pa-4 rounded-xl">
            <v-card-title class="font-weight-bold">新增連結</v-card-title>
            <v-card-text>
                <v-text-field v-model="newLink.title" label="連結標題" variant="outlined" placeholder="例如: 我的 Instagram"></v-text-field>
                <v-text-field v-model="newLink.url" label="連結網址" variant="outlined" placeholder="https://..."></v-text-field>
                <v-select
                    v-model="newLink.icon"
                    :items="iconOptions"
                    label="圖示"
                    variant="outlined"
                    prepend-inner-icon="mdi-emoticon-outline"
                ></v-select>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="text" @click="dialog = false">取消</v-btn>
                <v-btn color="primary" variant="flat" :loading="isAdding" @click="handleAdd">建立</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor">{{ snackbarText }}</v-snackbar>
  </NuxtLayout>
</template>

<script setup>
import { useProfileStore } from '~/stores/profile'

const store = useProfileStore()
const links = computed(() => store.profile.actionLinks)
const search = ref('')

const dialog = ref(false)
const isAdding = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const newLink = ref({ title: '', url: '', icon: 'mdi-link-variant' })
const iconOptions = [
    { title: '連結', value: 'mdi-link-variant' },
    { title: 'Instagram', value: 'mdi-instagram' },
    { title: 'Facebook', value: 'mdi-facebook' },
    { title: 'YouTube', value: 'mdi-youtube' },
    { title: 'Twitter/X', value: 'mdi-twitter' },
    { title: 'Github', value: 'mdi-github' }
]

const filteredLinks = computed(() => {
    if (!search.value) return links.value
    return links.value.filter(l => l.title.toLowerCase().includes(search.value.toLowerCase()))
})

const openDialog = () => {
    newLink.value = { title: '', url: '', icon: 'mdi-link-variant' }
    dialog.value = true
}

const handleAdd = async () => {
    if (!newLink.value.title || !newLink.value.url) return
    isAdding.value = true
    const { error } = await store.addLink(newLink.value)
    isAdding.value = false
    if (!error) {
        dialog.value = false
        snackbarText.value = '連結已新增！'
        snackbarColor.value = 'success'
        snackbar.value = true
    } else {
        snackbarText.value = '新增失敗'
        snackbarColor.value = 'error'
        snackbar.value = true
    }
}

const confirmDelete = async (link) => {
    if (confirm(`確定要刪除「${link.title}」嗎？`)) {
        await store.deleteLink(link.id)
        snackbarText.value = '連結已刪除'
        snackbarColor.value = 'info'
        snackbar.value = true
    }
}
</script>
