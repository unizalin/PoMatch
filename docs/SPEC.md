# PoMatch 專案規格文件 (SPEC)

> **用途**：供 AI 助手快速了解專案現狀。每次功能完成後更新。
> **最後更新**：2026-03-04

---

## 技術棧

| 層級 | 技術 | 版本 |
|---|---|---|
| 框架 | Nuxt | 4.3.1 |
| UI 庫 | Vuetify | 3.7.11 |
| 狀態管理 | Pinia | 3.0.4 |
| 後端/Auth | Supabase (via @nuxtjs/supabase) | 2.0.4 |
| 圖表 | Chart.js + vue-chartjs | 4.5.1 |
| 圖示 | @mdi/font + lucide-vue-next | — |
| CSS | Vanilla CSS (`assets/css/main.css`) | — |
| 字型 | Inter + Noto Sans TC (Google Fonts) | — |

## 路由與頁面

### 公開頁面

| 路由 | 檔案 | 用途 | SSR |
|---|---|---|---|
| `/` | `pages/index.vue` | 首頁/Landing Page | ✅ |
| `/:id` | `pages/[id].vue` | 公開個人名片頁 | ✅ |
| `/explore` | `pages/explore.vue` | 探索/瀏覽所有名片 | ✅ |
| `/login` | `pages/login.vue` | 登入頁 | ❌ |
| `/register` | `pages/register.vue` | 註冊頁 | ❌ |
| `/confirm` | `pages/confirm.vue` | OAuth 回調確認頁 | ❌ |

### Admin 頁面（需登入）

| 路由 | 檔案 | 用途 |
|---|---|---|
| `/admin` | `pages/admin/index.vue` | 創作者工作室（主控台）|
| `/admin/analytics` | `pages/admin/analytics.vue` | 數據分析儀表板 |
| `/admin/match-analytics` | `pages/admin/match-analytics.vue` | 配對分析 |
| `/admin/traffic` | `pages/admin/traffic.vue` | 流量分析 |
| `/admin/orders` | `pages/admin/orders.vue` | 訂單管理 |

## 元件架構

### 公用元件

| 元件 | 用途 |
|---|---|
| `ProfileCard.vue` | 名片卡片（用於 explore 頁面列表） |

### Admin Studio 元件（工作室）

| 元件 | 用途 |
|---|---|
| `StudioPreview.vue` | 即時預覽（WYSIWYG，與 `[id].vue` 同步）+ RWD 裝置切換 (iPhone SE/14/iPad) |
| `ContentProfile.vue` | 編輯個人資料（名稱、描述、頭像、Persona） |
| `ContentLinks.vue` | 管理行動連結（新增/刪除/排序/樣式）+ URL 自動偵測 Icon |
| `AppearanceBackground.vue` | 背景設定（Aurora、玻璃質感、顆粒） |
| `AppearanceLinks.vue` | 連結外觀設定（間距、圓角、動畫） |
| `AppearanceProfile.vue` | 個人資料外觀（頭像邊框、發光效果） |
| `AppearanceTemplates.vue` | 主題模板選擇 |
| `LinkStyleDialog.vue` | 單一連結的進階樣式彈窗 |
| `LinkLayoutPicker.vue` | 連結佈局選擇器（List/Grid/Carousel） |

## 狀態管理 (Pinia Store)

### `stores/profile.ts` — useProfileStore

**State 重點欄位**：
- `profile` — 當前載入的使用者資料
- `isDirty` — 是否有未儲存的變更
- `history[]` / `historyIndex` — Undo/Redo 歷史快照

**Actions 清單**：
| Action | 用途 |
|---|---|
| `fetchProfile(username)` | 從 Supabase 讀取個人資料 |
| `saveChanges()` | 手動儲存至 Supabase |
| `updateProfile(newData)` | 更新本地資料（觸發 isDirty） |
| `addLink(link)` | 新增行動連結 |
| `deleteLink(linkId)` | 刪除行動連結 |
| `updateLinkMetadata(linkId, metadata)` | 更新連結的進階樣式 |
| `takeSnapshot()` | 建立歷史快照（用於 Undo） |
| `undo()` / `redo()` | 撤銷/重做 |
| `handleRegister(id)` | 註冊新使用者 |
| `hasProfile(userId)` | 檢查是否已建立 Profile |
| `fetchAllProfiles()` | 讀取所有 Profile（探索頁用） |
| `calculateMatch(otherPersona)` | 計算配對分數 |
| `recordClick(linkId)` | 記錄連結點擊 |
| `incrementLike()` | 按讚 |

## Utils

| 檔案 | 用途 |
|---|---|
| `matchEngine.ts` | 配對演算法（MBTI、星座、地點、標籤） |
| `vcard.ts` | vCard 產生器（下載名片） |

## Middleware

### `auth.global.ts`（全域路由守衛）

- 已登入 + 有 Profile → 訪問 `/login` 或 `/register` 時重導至 `/admin`
- 已登入 + 無 Profile → 訪問 `/login` 時重導至 `/register`
- 訪問 `/admin/**` 未登入 → 重導至 `/login`
- 訪問 `/admin/**` 無 Profile → 重導至 `/register`

## 設計系統關鍵詞

- **Glassmorphism**：玻璃質感卡片 (`backdrop-filter: blur`)
- **Aurora Background**：漸層動態背景
- **Bento Grid**：網格佈局（連結卡片）
- **Premium Link Items**：連結按鈕的高級視覺效果
- **Grain Overlay**：顆粒紋理覆蓋層

## 關鍵模板結構：`[id].vue`

```
<template>
  <div.profile-container>
    <div.aurora-bg />
    <div.grain-overlay />
    <v-fade-transition>
      <div.glass-card-premium>          ← 主卡片容器
        <div.wallet-header />           ← (可選) 錢包模式頭部
        <div.status-indicator />
        <div.avatar-container />
        <h1 /> <p />                    ← 名稱、描述
        <div.bento-stats />             ← 數據統計
        <div.links-container-premium>   ← 連結容器
          <v-btn v-for>                 ← 每個連結
            <template v-if="list">      ← List 佈局
            <template v-else>           ← Grid/Carousel 佈局
          </v-btn>
        </div>
        <div.branding-pill />           ← 品牌 Footer
      </div>
    </v-fade-transition>
  </div>
</template>
```

## 環境變數

| 變數 | 用途 |
|---|---|
| `SUPABASE_URL` | Supabase 專案 URL |
| `SUPABASE_KEY` | Supabase anon key |

## URL 自動偵測支援平台

| 平台 | 匹配規則 | Icon |
|---|---|---|
| Instagram | `instagram.com` | `mdi-instagram` |
| Facebook | `facebook.com`, `fb.com` | `mdi-facebook` |
| YouTube | `youtube.com`, `youtu.be` | `mdi-youtube` |
| TikTok | `tiktok.com` | `mdi-music-note` |
| X (Twitter) | `twitter.com`, `x.com` | `mdi-twitter` |
| GitHub | `github.com` | `mdi-github` |
| Threads | `threads.net` | `mdi-at` |
| LINE | `line.me` | `mdi-chat` |
| LinkedIn | `linkedin.com` | `mdi-linkedin` |
| Spotify | `spotify.com` | `mdi-spotify` |
| SoundCloud | `soundcloud.com` | `mdi-soundcloud` |
