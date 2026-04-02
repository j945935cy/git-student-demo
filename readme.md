# Git 學生專案

## 1200 常用英文單字組字 APP

這個專案提供一個純前端 APP：

- 以 1200 筆英文單字資料庫為基礎（由常見字首、字根、字尾規則生成並拆解）。
- 可選擇 `Prefix + Root + Suffix` 組字。
- 顯示是否命中資料庫與符合條件的單字清單。
- 支援瀏覽器語音合成（`speechSynthesis`）朗讀單字。

## 用 VS Code 開啟專案

### 1) 進入專案資料夾
```bash
cd /workspace/git-student-demo
```

### 2) 用 VS Code 開啟
```bash
code .
```

> 如果 `code` 指令不能用，請在 VS Code 內按 `Ctrl+Shift+P`，執行 **Shell Command: Install 'code' command in PATH**。

### 3) 執行方式（擇一）

- **方式 A：Live Server**
  1. 安裝推薦擴充套件（會自動出現在 `Extensions` 推薦）。
  2. 右鍵 `index.html` → `Open with Live Server`。

- **方式 B：VS Code Task + Debug**
  1. `Terminal` → `Run Task...` → `Start static server`。
  2. 按 `F5`，選 `Open app in Chrome`。

## 備用：手動啟動本機伺服器
```bash
cd /workspace/git-student-demo
python3 -m http.server 8080
```

打開瀏覽器進入：
- <http://localhost:8080>

## 小提醒
- 建議使用 Chrome / Edge 最新版。
- 若按下「🔊 唸出單字」沒有聲音，請確認瀏覽器分頁沒有被靜音，且系統音量正常。
