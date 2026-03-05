---
description: 啟動開發環境並開始本地開發
---

# 開發流程

// turbo-all

## 步驟

1. 安裝依賴（如尚未安裝）：
```bash
npm install
```

2. 啟動開發伺服器：
```bash
npm run dev
```

3. 開發伺服器啟動後，預設於 `http://localhost:3000`

## 注意事項

- 所有 `/admin/**` 路由為 CSR（client-side only），不走 SSR
- `/login`、`/register`、`/confirm` 也是 CSR
- 環境變數需要 `.env` 檔（參考 `.env.example`）
- Supabase 連線資訊在 `.env` 中設定
