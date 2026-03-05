---
description: 構建並部署正式環境
---

# 部署流程

## 步驟

1. 執行正式構建，確認無語法錯誤：
```bash
npm run build
```

2. 本地預覽正式版本（可選）：
```bash
npm run preview
```

3. 部署至 Vercel / Netlify：
   - 設定正式環境的 `SUPABASE_URL` 和 `SUPABASE_KEY`
   - 設定 Build command: `npm run build`
   - 設定 Output directory: `.output`

## 正式環境檢查清單

- [ ] 環境變數已設定正式的 Supabase 專案
- [ ] SMTP 服務已串接（不使用 Supabase 預設郵件）
- [ ] Rate Limit 已調整（參考 `docs/production_guide.md`）
- [ ] OAuth Redirect URL 已更新為正式網域
- [ ] Captcha 已啟用
