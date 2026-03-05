---
description: 標準化新增頁面的流程
---

# 新增頁面流程

## 公開頁面

1. 在 `app/pages/` 建立 `.vue` 檔案
2. 頁面命名規則：
   - 靜態路由：`about.vue` → `/about`
   - 動態路由：`[slug].vue` → `/:slug`
3. 如需 CSR（例如涉及 Auth），在 `nuxt.config.ts` 的 `routeRules` 加入：
```ts
routeRules: {
  '/new-page': { ssr: false }
}
```
4. 更新 `docs/SPEC.md` 的「路由與頁面」區塊

## Admin 頁面

1. 在 `app/pages/admin/` 建立 `.vue` 檔案
2. Admin 頁面自動受 `middleware/auth.global.ts` 保護
3. 所有 `/admin/**` 已設定為 CSR（`nuxt.config.ts`）
4. 更新 `docs/SPEC.md`

## 新增元件

1. 公用元件放在 `app/components/`
2. Admin 專屬元件放在 `app/components/admin/`
3. Studio 元件放在 `app/components/admin/studio/`
4. 更新 `docs/SPEC.md` 的「元件架構」區塊

## 驗證

// turbo
```bash
npm run build
```
確認構建成功後再 commit。
