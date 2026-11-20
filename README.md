# TWEN Trade — 台股與 ETF 模擬交易平台

響應式繁體中文／英文網站，預設以新台幣（TWD）計價。使用虛擬本金，不連接券商、不會送出真實委託。

## 目前功能

- 會員註冊、登入、登出；密碼使用 scrypt 雜湊，不以明文保存。
- 每個新帳號 NT$1,000,000 虛擬本金。
- 台股上市／上櫃與 ETF 行情搜尋、分類、自選清單。
- 模擬買進、賣出、市價單、限價單、未成交委託取消。
- 現金、持倉均價、市值、未實現／已實現損益、資產配置。
- 交易紀錄、虛擬資產排行榜。
- 新手教學、課程完成進度、教學圖片上傳與教育用途免責聲明。
- 管理員公告系統、課程管理、會員與平台統計。
- 桌面、平板、手機響應式排版；繁中／英文切換。
- SQLite 持久化、Docker 部署設定、自動化 API 測試。

## 行情來源與重要限制

平台優先透過伺服器端讀取：

- TWSE 臺灣證券交易所 OpenAPI：`https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL`
- TPEx 證券櫃檯買賣中心 OpenAPI：`https://www.tpex.org.tw/openapi/v1/tpex_mainboard_quotes`

這些免費公開資料主要是收盤行情，不是盤中即時報價；日期及來源會在頁面顯示。若官方來源暫時無法連線，會切換為內建的「示範資料」，並明確標示非真實報價。示範資料只為測試 UI 與模擬交易流程，不得視為真實市場價格。

平台模擬交易費用採簡化估算：買賣手續費 0.1425%；賣出股票交易稅 0.3%，ETF 交易稅 0.1%。實際證券交易費率與稅務規則可能因商品與法規而異，本平台數值僅供模擬，不作為真實交易計算依據。

## 本機啟動

需要 Python 3.10+。

```bash
cd twen-trade
python -m venv .venv
# Windows PowerShell: .venv\\Scripts\\Activate.ps1
# macOS / Linux: source .venv/bin/activate
pip install -r requirements.txt
```

複製 `.env.example` 為 `.env`，設定長且隨機的 `SESSION_SECRET` 及管理員密碼 `ADMIN_PASSWORD`。程式啟動時會自動讀取專案根目錄的 `.env`，不需要額外安裝 dotenv 套件。本機 HTTP 測試請設 `COOKIE_SECURE=0`；正式 HTTPS 網站請設為 `COOKIE_SECURE=1`。

Windows PowerShell：

```powershell
Copy-Item .env.example .env
```

macOS / Linux：

```bash
cp .env.example .env
```

```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

開啟 `http://localhost:8000`。

若未設定 `ADMIN_PASSWORD`，第一次啟動會在伺服器終端機產生並顯示一次性的初始管理員密碼。正式部署請明確設定環境變數，不要使用測試密碼。

## Docker 部署

```bash
cp .env.example .env
# 編輯 .env：設定 SESSION_SECRET、ADMIN_PASSWORD、COOKIE_SECURE=1
# 網站需透過 HTTPS 反向代理（例如 Caddy / Nginx + TLS）公開

docker compose up -d --build
```

預設容器監聽 8000 port，資料庫與教學圖片分別保存在 `./data` 與 `./uploads`。不要直接把未加 HTTPS 的 8000 port 公開到網際網路。

## 測試

```bash
pip install -r requirements.txt
pip install pytest
pytest -q
```

## Render 臨時預覽部署

專案已附 `render.yaml`，預設使用 Render Free Web Service、Singapore 區域與健康檢查 `/api/health`。部署前須先將整個專案推送到 GitHub/GitLab/Bitbucket repository，再在 Render 建立 Blueprint 並選取該 repository。

Render Blueprint 初次建立時會要求你自行設定 `ADMIN_PASSWORD`；請使用唯一且夠長的密碼，不要把密碼提交到 Git。`SESSION_SECRET` 由 Render 自動產生。

**免費預覽限制：** 此設定把 SQLite 資料庫與上傳圖片放在 `/tmp`，只適合短期展示。免費服務重啟、重新部署或休眠後，測試帳號、交易紀錄、公告、教學圖片等資料可能遺失。若要長期保存資料，需要改用持久化儲存或資料庫；這可能產生費用，並非此免費預覽設定的一部分。

## 管理員功能

管理員帳號名稱預設為 `admin`（可用 `ADMIN_USERNAME` 修改），密碼由 `ADMIN_PASSWORD` 設定。管理後台可新增／刪除公告、建立／刪除教學內容，以及上傳教學圖片。

## 重要聲明

TWEN Trade 是教育與虛擬交易練習工具，不是券商、投資顧問或投資建議服務。模擬報價、委託成交、資產損益與排行榜不代表真實市場成交條件或未來績效。教學內容不保證完整、正確或即時更新。使用者不應僅依本平台內容作出真實投資決策。

此專案目前是可供測試的 MVP，不應在完成正式安全稽核、行情資料授權確認、備份與監控設定前，用於商業營運或宣稱提供即時行情。公開部署時請設定 HTTPS、強密碼、隨機 Session secret、備份策略與反向代理安全標頭。

## 暫時公開預覽（Render Free）

專案附有 `render.yaml`，可作為 Render Blueprint 設定。Render 免費 Web Service 適合短期展示與測試，但免費方案會在閒置 15 分鐘後休眠，下一位訪客開啟時需要等待喚醒；免費服務的本機檔案系統是暫存空間，重啟、重新部署或休眠時，SQLite 資料庫與上傳圖片可能遺失。因此此設定只供臨時體驗，不適合保存正式會員資料。請在 Render 建立 Blueprint 時自行填入 `ADMIN_PASSWORD`，並將其保密。詳見 Render 官方限制說明：https://render.com/docs/free
