# Git 學生專案

## 1200 常用英文單字組字 APP

這個專案提供一個純前端 APP：

- 以 1200 筆英文單字資料庫為基礎（由常見字首、字根、字尾規則生成並拆解）。
- 可選擇 `Prefix + Root + Suffix` 組字。
- 顯示是否命中資料庫與符合條件的單字清單。
- 支援瀏覽器語音合成（`speechSynthesis`）朗讀單字。

## 如何執行程式

### 方法 1：直接開啟（最快）
1. 進入專案資料夾。
2. 以瀏覽器開啟 `index.html`。

### 方法 2：啟動本機伺服器（建議）
```bash
cd /workspace/git-student-demo
python3 -m http.server 8080
```

打開瀏覽器進入：

- <http://localhost:8080>

## 小提醒
- 建議使用 Chrome / Edge 最新版。
- 若按下「🔊 唸出單字」沒有聲音，請確認瀏覽器分頁沒有被靜音，且系統音量正常。
