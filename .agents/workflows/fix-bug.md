---
description: 系統化的除錯與修復流程
---

# 除錯流程 (Systematic Debugging)

使用 superpowers 的系統化除錯方法論。

## Phase 1: 觀察 (Observation)

1. 確認錯誤訊息的完整內容
2. 確認錯誤發生的位置（檔案、行號）
3. 確認錯誤是否可重現

## Phase 2: 假設 (Hypothesis)

1. 根據錯誤訊息推斷可能原因
2. 列出 2-3 個最可能的假設
3. 優先排序（從最可能到最不可能）

## Phase 3: 實驗 (Experiment)

1. 先讀 `docs/SPEC.md` 了解相關元件的現狀
2. 使用 `view_file` 確認問題區域的實際程式碼
3. 進行最小範圍的修改來驗證假設

## Phase 4: 修復與防禦 (Resolution & Defense)

1. 修復問題
2. **立即執行驗證**：
// turbo
```bash
npm run build
```
3. 如果 build 失敗，**禁止繼續其他修改**，必須先修復
4. 更新 `docs/SPEC.md`（如果結構有變更）
5. 考慮是否需要加入預防措施

## 常見問題速查

| 錯誤 | 原因 | 修復 |
|---|---|---|
| `Element is missing end tag` | `.vue` 模板標籤未閉合 | 檢查 `<template>`, `<div>`, `<v-btn>` 等標籤配對 |
| `Cannot read properties of undefined` | 資料尚未載入 | 加入 optional chaining (`?.`) |
| `Hydration mismatch` | SSR/CSR 不一致 | 考慮加入 `routeRules` 設為 CSR |
| `SUPABASE_URL is not defined` | 環境變數未設定 | 檢查 `.env` 檔案 |
