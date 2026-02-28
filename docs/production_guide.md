# PoMatch Production Readiness Guide

當應用程式準備上線（正式環境）時，我們需要針對效能、安全性與限制進行一系列調整。以下是針對您提到的 Rate Limit（頻率限制）以及其他生產環境關鍵設定的建議：

## 1. 調整驗證限制 (Auth Rate Limits)
在正式環境中，預設的限制可能太過嚴格。
- **路徑**：`Authentication > Settings > Rate Limits`
- **建議**：
    - 將 **Signup** 與 **Magic Link** 的限制調高（例如每小時 10-20 次）。
    - 確保這是為了真實用戶體驗與防範攻擊之間的平衡。

## 2. 使用專業 SMTP 服務 (重要 ⚠️)
Supabase 預設的郵件伺服器每天僅限發送 **3 封驗證信**。這在正式環境是絕對不敷使用的。
- **建議**：串接如 **Postmark**, **SendGrid**, 或 **Resend** 的 SMTP 服務。
- **好處**：提升郵件到達率，避免註冊驗證信被歸類為垃圾郵件，且沒有極低的發送限制。

## 3. 啟用 Captcha (防止暴力攻擊)
為了防止機器人惡意耗盡您的 Rate Limit 額度：
- **路徑**：`Authentication > Settings > Security`
- **操作**：啟用 **Turnstile (Cloudflare)** 或 **hCaptcha**。
- **效果**：註冊按鈕前會多一道安全驗證，這能有效區分真實用戶與攻擊者。

## 4. 社交登入 (OAuth)
提供 Google 或 LINE 登入。
- **優點**：用戶不需要輸入密碼與收驗證信，且 OAuth 提供商通常有更高的處理能力，不會輕易觸發 Rate Limit。

## 5. 環境隔離
- **建議**：建立一個全新的 Supabase 專案作為 **Production 環境**，不要與開發環境共用同一個資料庫。
- **環境變數**：在 Vercel/Netlify 等服務上設定不同的 `SUPABASE_URL` 與 `SUPABASE_KEY`。

## 6. 資料庫效能
- 為關鍵欄位（如 `username`）建立 **Indexes (索引)**，我們目前的 `schema.sql` 已經透過 `UNIQUE` 約束隱含建立了索引，這能確保查詢 ID 可用性時非常快速。

---

## 7. 第三方登入設定 (Social Auth Setup)
要啟用 Google 或 LINE 登入，請按照以下步驟操作：

### Google 設定步驟：
1.  前往 [Google Cloud Console](https://console.cloud.google.com/)。
2.  建立新專案或選擇現有專案。
3.  進入 **APIs & Services > OAuth consent screen**，完成基本資訊填寫。
4.  進入 **Credentials > Create Credentials > OAuth client ID**：
    *   Application type: Web application
    *   **Authorized redirect URIs**: 填入從 Supabase Dashboard 複製的 Callback URL。
5.  將產生的 `Client ID` 與 `Client Secret` 填入 Supabase (**Authentication > Providers > Google**)。

### LINE 設定步驟：
1.  前往 [LINE Developers Console](https://developers.line.biz/)。
2.  建立一個 Provider 並建立一個 **LINE Login** channel。
3.  在 **App settings** 頁面找到 `Channel ID` 與 `Channel Secret`。
4.  在 **LINE Login settings** 頁面的 `Callback URL` 填入 Supabase 的地址。
5.  將資訊填入 Supabase (**Authentication > Providers > LINE**)。

### 回調地址 (Redirect URLs) 設定：
在 Supabase Dashboard ➔ **Authentication > URL Configuration**：
- **Site URL**: `http://localhost:3002` (開發) 或您的正式網址
- **Redirect URLs**: 加入 `http://localhost:3002/confirm`

---
