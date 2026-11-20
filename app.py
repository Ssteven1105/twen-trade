from __future__ import annotations

import hashlib
import hmac
import json
import os
import re
import secrets
import sqlite3
import time
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import httpx
from fastapi import Depends, FastAPI, File, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from starlette.middleware.sessions import SessionMiddleware

BASE_DIR = Path(__file__).resolve().parent


def load_env_file(path: Path) -> None:
    """Load simple KEY=VALUE settings without requiring an extra package."""
    if not path.is_file():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key:
            os.environ.setdefault(key, value)


load_env_file(BASE_DIR / ".env")

STATIC_DIR = BASE_DIR / "static"
TEMPLATE_DIR = BASE_DIR / "templates"
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

DEMO_QUOTES = [
    {"symbol": "2330", "name": "台積電", "market": "上市", "price": 1465.0, "change": 10.0, "change_pct": 0.69, "volume": 28450, "category": "股票"},
    {"symbol": "2317", "name": "鴻海", "market": "上市", "price": 228.5, "change": -1.5, "change_pct": -0.65, "volume": 38210, "category": "股票"},
    {"symbol": "2454", "name": "聯發科", "market": "上市", "price": 1330.0, "change": 15.0, "change_pct": 1.14, "volume": 7210, "category": "股票"},
    {"symbol": "2308", "name": "台達電", "market": "上市", "price": 1045.0, "change": 5.0, "change_pct": 0.48, "volume": 5230, "category": "股票"},
    {"symbol": "2881", "name": "富邦金", "market": "上市", "price": 91.8, "change": -0.4, "change_pct": -0.43, "volume": 18900, "category": "股票"},
    {"symbol": "0050", "name": "元大台灣50", "market": "上市", "price": 72.35, "change": 0.65, "change_pct": 0.91, "volume": 65000, "category": "ETF"},
    {"symbol": "0056", "name": "元大高股息", "market": "上市", "price": 38.72, "change": 0.18, "change_pct": 0.47, "volume": 44200, "category": "ETF"},
    {"symbol": "00878", "name": "國泰永續高股息", "market": "上市", "price": 22.84, "change": -0.06, "change_pct": -0.26, "volume": 92100, "category": "ETF"},
    {"symbol": "00919", "name": "群益台灣精選高息", "market": "上市", "price": 23.16, "change": 0.11, "change_pct": 0.48, "volume": 73800, "category": "ETF"},
    {"symbol": "2603", "name": "長榮", "market": "上市", "price": 188.0, "change": -2.0, "change_pct": -1.05, "volume": 14200, "category": "股票"},
    {"symbol": "6488", "name": "環球晶", "market": "上櫃", "price": 412.0, "change": 4.0, "change_pct": 0.98, "volume": 1650, "category": "股票"},
    {"symbol": "3707", "name": "漢磊", "market": "上櫃", "price": 64.2, "change": -0.8, "change_pct": -1.23, "volume": 3480, "category": "股票"},
]

LESSON_SEEDS = [
    ("股票是什麼？", "基礎觀念", 1, """股票代表對一家公司的部分所有權。股票價格會受到公司營運、產業環境、整體經濟與市場情緒影響，因此可能上漲或下跌。持有股票不保證獲利，也可能承受本金損失。初學者可以先了解公司業務、收入成本，以及價格與成交量的意義。""", "5 分鐘", "Fundamentals", "What Is a Stock?", "A stock represents partial ownership in a company. Prices can rise or fall based on company performance, industry conditions, the economy and market sentiment. Owning a stock does not guarantee profit and may result in losses. Beginners can start by learning what a company does and what price and volume mean.", "5 min"),
    ("ETF 是什麼？", "基礎觀念", 2, """ETF 是在證券交易所掛牌交易的基金，部分 ETF 追蹤特定指數、產業或投資策略，可能同時持有多個成分標的。分散持有有機會降低單一公司風險，但不能消除市場風險。研究 ETF 時，可查看追蹤標的、成分持股、費用、規模、折溢價、流動性及配息政策。""", "7 分鐘", "Fundamentals", "What Is an ETF?", "An ETF is a fund traded on an exchange. It may track an index, industry or strategy and hold multiple assets. Diversification may reduce single-company concentration but cannot eliminate market risk. Review its benchmark, holdings, fees, size, premium or discount, liquidity and distribution policy.", "7 min"),
    ("認識價格、漲跌幅與成交量", "市場資料", 3, """收盤價是交易日結束時的最後成交價格。漲跌通常是拿當日價格與前一交易日收盤價比較；漲跌幅則是價差相對於前一日收盤價的百分比。成交量代表一定期間內成交的股數。成交量增加不代表價格一定上漲，閱讀行情時也要確認資料日期與來源。""", "6 分鐘", "Market data", "Price, Change and Volume", "The closing price is the final matched price of a trading day. Change compares it with the previous close; percentage change expresses that difference as a percentage. Volume is the number of shares traded. Higher volume does not guarantee a rising price. Check the data date and source.", "6 min"),
    ("模擬下單與投資組合", "模擬操作", 4, """模擬市價單會依本平台可取得的參考價格成交；限價單則會等待價格符合設定條件。平台使用虛擬資金，不會將委託送往真實券商。模擬成交無法完整重現真實市場的滑價、流動性、交易規則與費用。""", "8 分鐘", "Paper trading", "Paper Orders and Your Portfolio", "A simulated market order uses the reference price available to this practice system. A limit order waits until its price condition is met. This platform uses virtual funds and never sends orders to a real broker. Simulated fills cannot fully reproduce real-market slippage, liquidity, rules or fees.", "8 min"),
    ("風險、分散與長期思考", "風險管理", 5, """投資風險包括市場、產業、流動性與集中度風險。持有不同資產可能降低單一公司的影響，但無法消除整體市場下跌的風險。不要只根據短期價格波動倉促決定；先理解商品特性、可能損失與自己的風險承受能力。""", "8 分鐘", "Risk management", "Risk, Diversification and Long-Term Thinking", "Investment risks include market, sector, liquidity and concentration risk. Holding different assets may reduce the impact of one company but cannot eliminate broad market risk. Avoid rushed decisions based only on short-term price moves. Understand the product and potential losses first.", "8 min"),
]

SCHEMA = """
PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS users (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 username TEXT NOT NULL UNIQUE COLLATE NOCASE,
 email TEXT UNIQUE COLLATE NOCASE,
 password_hash TEXT NOT NULL,
 role TEXT NOT NULL DEFAULT 'user',
 cash REAL NOT NULL DEFAULT 1000000,
 created_at TEXT NOT NULL,
 disclaimer_accepted INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS holdings (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 symbol TEXT NOT NULL,
 name TEXT NOT NULL,
 quantity INTEGER NOT NULL DEFAULT 0,
 avg_cost REAL NOT NULL DEFAULT 0,
 realized_pnl REAL NOT NULL DEFAULT 0,
 UNIQUE(user_id, symbol)
);
CREATE TABLE IF NOT EXISTS orders (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 symbol TEXT NOT NULL,
 name TEXT NOT NULL,
 side TEXT NOT NULL,
 order_type TEXT NOT NULL,
 quantity INTEGER NOT NULL,
 price REAL NOT NULL,
 gross REAL NOT NULL,
 fee REAL NOT NULL,
 tax REAL NOT NULL,
 status TEXT NOT NULL,
 created_at TEXT NOT NULL,
 filled_at TEXT
);
CREATE TABLE IF NOT EXISTS watchlist (
 user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 symbol TEXT NOT NULL,
 created_at TEXT NOT NULL,
 PRIMARY KEY(user_id, symbol)
);
CREATE TABLE IF NOT EXISTS announcements (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 title TEXT NOT NULL,
 title_en TEXT,
 body TEXT NOT NULL,
 body_en TEXT,
 level TEXT NOT NULL DEFAULT 'info',
 is_published INTEGER NOT NULL DEFAULT 1,
 created_at TEXT NOT NULL,
 created_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS lessons (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 title TEXT NOT NULL,
 title_en TEXT,
 category TEXT NOT NULL,
 category_en TEXT,
 level INTEGER NOT NULL DEFAULT 1,
 body TEXT NOT NULL,
 body_en TEXT,
 duration TEXT NOT NULL DEFAULT '5 分鐘',
 duration_en TEXT,
 image_path TEXT,
 is_published INTEGER NOT NULL DEFAULT 1,
 created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS lesson_progress (
 user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
 completed_at TEXT NOT NULL,
 PRIMARY KEY(user_id, lesson_id)
);
"""


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.scrypt(password.encode(), salt=salt, n=2**14, r=8, p=1)
    return f"scrypt${salt.hex()}${digest.hex()}"


def verify_password(password: str, encoded: str) -> bool:
    try:
        kind, salt_hex, expected = encoded.split("$")
        if kind != "scrypt":
            return False
        actual = hashlib.scrypt(password.encode(), salt=bytes.fromhex(salt_hex), n=2**14, r=8, p=1).hex()
        return hmac.compare_digest(actual, expected)
    except (ValueError, TypeError):
        return False


def rowdict(row: sqlite3.Row | None) -> dict[str, Any] | None:
    return dict(row) if row is not None else None


class MarketData:
    """Official free daily-close feeds. If feeds fail, return clearly labelled demo fixtures."""
    def __init__(self):
        self.cache: list[dict[str, Any]] = []
        self.cached_at = 0.0
        self.source = "示範資料"
        self.market_date = "示範資料（非即時）"
        self.error: str | None = None

    @staticmethod
    def _num(value: Any) -> float | None:
        if value is None:
            return None
        raw = str(value).strip().replace(",", "").replace("+", "")
        if raw in {"", "-", "--", "X", "---"}:
            return None
        try:
            return float(raw)
        except ValueError:
            return None

    @staticmethod
    def _pick(row: dict[str, Any], *keys: str) -> Any:
        lower = {str(k).lower(): v for k, v in row.items()}
        for key in keys:
            if key.lower() in lower:
                return lower[key.lower()]
        return None

    async def _fetch_json(self, client: httpx.AsyncClient, url: str) -> list[dict[str, Any]]:
        response = await client.get(url, headers={"User-Agent": "TWEN-Trade/1.0 educational simulator"})
        response.raise_for_status()
        data = response.json()
        if isinstance(data, list):
            return [x for x in data if isinstance(x, dict)]
        if isinstance(data, dict):
            for val in data.values():
                if isinstance(val, list) and val and isinstance(val[0], dict):
                    return val
        return []

    async def get_quotes(self, force: bool = False) -> tuple[list[dict[str, Any]], dict[str, Any]]:
        if self.cache and not force and time.time() - self.cached_at < 300:
            return self.cache, self.metadata()
        listed: list[dict[str, Any]] = []
        otc: list[dict[str, Any]] = []
        errs: list[str] = []
        try:
            async with httpx.AsyncClient(timeout=8.0, follow_redirects=True) as client:
                try:
                    listed = await self._fetch_json(client, "https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL")
                except Exception as exc:
                    errs.append(f"TWSE: {type(exc).__name__}")
                try:
                    otc = await self._fetch_json(client, "https://www.tpex.org.tw/openapi/v1/tpex_mainboard_quotes")
                except Exception as exc:
                    errs.append(f"TPEx: {type(exc).__name__}")
        except Exception as exc:
            errs.append(type(exc).__name__)

        normalized: list[dict[str, Any]] = []
        dates: list[str] = []
        for row, market in [(r, "上市") for r in listed] + [(r, "上櫃") for r in otc]:
            symbol = str(self._pick(row, "Code", "SecuritiesCompanyCode", "StockCode", "證券代號", "代號") or "").strip()
            name = str(self._pick(row, "Name", "CompanyName", "證券名稱", "名稱") or "").strip()
            price = self._num(self._pick(row, "ClosingPrice", "Close", "ClosingPrice", "收盤", "收盤價", "成交價"))
            if not symbol or not name or price is None or price <= 0:
                continue
            change = self._num(self._pick(row, "Change", "漲跌", "漲跌價差")) or 0.0
            volume = self._num(self._pick(row, "TradeVolume", "TradingVolume", "成交股數", "成交量", "成交股數(股)")) or 0
            raw_date = str(self._pick(row, "Date", "資料日期", "交易日期") or "").strip()
            if raw_date:
                dates.append(raw_date)
            previous = price - change
            change_pct = (change / previous * 100) if previous > 0 else 0.0
            normalized.append({
                "symbol": symbol, "name": name, "market": market, "price": round(price, 4),
                "change": round(change, 4), "change_pct": round(change_pct, 3),
                "volume": int(volume), "category": "ETF" if symbol.startswith(("00", "01", "02")) else "股票",
            })

        if normalized:
            self.cache = sorted(normalized, key=lambda q: q["symbol"])
            self.source = "TWSE / TPEx 官方公開資料"
            raw_date = max(dates) if dates else ""
            if re.fullmatch(r"\d{7}", raw_date):
                self.market_date = f"{int(raw_date[:3]) + 1911}-{raw_date[3:5]}-{raw_date[5:7]}"
            else:
                self.market_date = raw_date or "最新可取得收盤資料"
            self.error = None
        else:
            self.cache = [dict(x) for x in DEMO_QUOTES]
            self.source = "示範資料（官方來源暫不可用）"
            self.market_date = "僅供功能測試，非真實報價"
            self.error = "; ".join(errs) if errs else "官方來源暫時沒有可用資料"
        self.cached_at = time.time()
        return self.cache, self.metadata()

    def metadata(self) -> dict[str, Any]:
        return {
            "source": self.source,
            "market_date": self.market_date,
            "is_demo": self.source.startswith("示範資料"),
            "is_realtime": False,
            "note": "此資料為最近可取得的官方收盤行情，非盤中即時報價。若顯示示範資料，請勿視為真實市場價格。",
            "error": self.error,
        }


class RegisterBody(BaseModel):
    username: str = Field(min_length=3, max_length=24)
    email: str = Field(default="", max_length=120)
    password: str = Field(min_length=8, max_length=128)


class LoginBody(BaseModel):
    username: str
    password: str


class OrderBody(BaseModel):
    symbol: str = Field(min_length=1, max_length=12)
    side: str
    quantity: int = Field(ge=1, le=100000)
    order_type: str = "market"
    limit_price: float | None = Field(default=None, gt=0)
    disclaimer_accepted: bool = False


class WatchBody(BaseModel):
    symbol: str = Field(min_length=1, max_length=12)


class AnnouncementBody(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    title_en: str = Field(default="", max_length=100)
    body: str = Field(min_length=1, max_length=5000)
    body_en: str = Field(default="", max_length=5000)
    level: str = "info"
    is_published: bool = True


class LessonBody(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    title_en: str = Field(default="", max_length=120)
    category: str = Field(min_length=1, max_length=40)
    category_en: str = Field(default="", max_length=40)
    level: int = Field(default=1, ge=1, le=10)
    body: str = Field(min_length=1, max_length=12000)
    body_en: str = Field(default="", max_length=12000)
    duration: str = Field(default="5 分鐘", max_length=30)
    duration_en: str = Field(default="", max_length=30)
    is_published: bool = True


def create_app(db_path: str | Path | None = None, bootstrap_admin_password: str | None = None) -> FastAPI:
    database = Path(db_path or os.getenv("DATABASE_PATH", BASE_DIR / "data" / "twen_trade.db"))
    database.parent.mkdir(parents=True, exist_ok=True)
    market = MarketData()
    app = FastAPI(title="TWEN Trade API", version="1.0.0")
    app.state.database = database
    app.state.market = market
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
    app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

    def connect() -> sqlite3.Connection:
        conn = sqlite3.connect(database, timeout=10, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys=ON")
        conn.execute("PRAGMA journal_mode=WAL")
        return conn

    @contextmanager
    def db():
        conn = connect()
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()

    with db() as conn:
        conn.executescript(SCHEMA)
        # Add bilingual content columns for existing local databases without data loss.
        migrations = {
            "announcements": {"title_en": "TEXT", "body_en": "TEXT"},
            "lessons": {"title_en": "TEXT", "category_en": "TEXT", "body_en": "TEXT", "duration_en": "TEXT"},
        }
        for table, columns in migrations.items():
            present = {r[1] for r in conn.execute(f"PRAGMA table_info({table})").fetchall()}
            for col, definition in columns.items():
                if col not in present:
                    conn.execute(f"ALTER TABLE {table} ADD COLUMN {col} {definition}")
        if conn.execute("SELECT COUNT(*) FROM lessons").fetchone()[0] == 0:
            conn.executemany(
                "INSERT INTO lessons(title,category,level,body,duration,is_published,created_at,category_en,title_en,body_en,duration_en) VALUES(?,?,?,?,?,1,?,?,?,?,?)",
                [(title, category, level, body, duration, utc_now(), category_en, title_en, body_en, duration_en)
                 for title, category, level, body, duration, category_en, title_en, body_en, duration_en in LESSON_SEEDS],
            )
        admin_exists = conn.execute("SELECT 1 FROM users WHERE role='admin' LIMIT 1").fetchone()
        if not admin_exists and bootstrap_admin_password:
            conn.execute(
                "INSERT INTO users(username,email,password_hash,role,cash,created_at) VALUES(?,?,?,?,?,?)",
                (os.getenv("ADMIN_USERNAME", "admin"), None, hash_password(bootstrap_admin_password), "admin", 1000000, utc_now()),
            )

    def csrf_check(request: Request):
        if request.method in {"GET", "HEAD", "OPTIONS"}:
            return
        if request.url.path in {"/api/register", "/api/login"}:
            return
        user_id = request.session.get("uid")
        if user_id is None:
            return
        supplied = request.headers.get("x-csrf-token", "")
        expected = request.session.get("csrf", "")
        if not supplied or not expected or not hmac.compare_digest(supplied, expected):
            raise HTTPException(403, "安全驗證失敗，請重新整理頁面後再試。")

    async def current_user(request: Request) -> dict[str, Any]:
        uid = request.session.get("uid")
        if not uid:
            raise HTTPException(401, "請先登入。")
        with db() as conn:
            user = conn.execute("SELECT id,username,email,role,cash,created_at,disclaimer_accepted FROM users WHERE id=?", (uid,)).fetchone()
        if not user:
            request.session.clear()
            raise HTTPException(401, "登入狀態已失效，請重新登入。")
        return dict(user)

    async def admin_user(user=Depends(current_user)):
        if user["role"] != "admin":
            raise HTTPException(403, "此功能僅限管理員使用。")
        return user

    async def refresh_quotes():
        return await market.get_quotes()

    def quote_map(quotes: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
        return {q["symbol"]: q for q in quotes}

    def portfolio_for(conn: sqlite3.Connection, user_id: int, quotes: list[dict[str, Any]]) -> dict[str, Any]:
        qmap = quote_map(quotes)
        rows = conn.execute("SELECT symbol,name,quantity,avg_cost,realized_pnl FROM holdings WHERE user_id=? ORDER BY symbol", (user_id,)).fetchall()
        holdings = []
        market_value = 0.0
        cost_value = 0.0
        realized = 0.0
        for row in rows:
            item = dict(row)
            realized += item["realized_pnl"]
            if item["quantity"] <= 0:
                continue
            quote = qmap.get(item["symbol"])
            current = quote["price"] if quote else item["avg_cost"]
            value = current * item["quantity"]
            cost = item["avg_cost"] * item["quantity"]
            pnl = value - cost
            market_value += value
            cost_value += cost
            item.update({"current_price": current, "market_value": round(value, 2), "cost_value": round(cost, 2), "unrealized_pnl": round(pnl, 2), "unrealized_pct": round((pnl / cost * 100) if cost else 0, 2)})
            holdings.append(item)
        cash = conn.execute("SELECT cash FROM users WHERE id=?", (user_id,)).fetchone()[0]
        equity = cash + market_value
        return {
            "cash": round(cash, 2), "market_value": round(market_value, 2), "equity": round(equity, 2),
            "initial_capital": 1000000.0, "total_pnl": round(equity - 1000000.0, 2),
            "total_pnl_pct": round((equity / 1000000.0 - 1) * 100, 2),
            "unrealized_pnl": round(market_value - cost_value, 2), "realized_pnl": round(realized, 2),
            "holdings": holdings,
        }

    async def evaluate_pending(user_id: int):
        quotes, _ = await refresh_quotes()
        qmap = quote_map(quotes)
        with db() as conn:
            pending = conn.execute("SELECT * FROM orders WHERE user_id=? AND status='PENDING' ORDER BY id", (user_id,)).fetchall()
            for order in pending:
                q = qmap.get(order["symbol"])
                if not q:
                    continue
                current = q["price"]
                is_triggered = (order["side"] == "buy" and current <= order["price"]) or (order["side"] == "sell" and current >= order["price"])
                if not is_triggered:
                    continue
                quantity = order["quantity"]
                price = current
                gross = price * quantity
                fee = round(gross * 0.001425, 2)
                tax_rate = 0.001 if q.get("category") == "ETF" else 0.003
                tax = round(gross * tax_rate, 2) if order["side"] == "sell" else 0.0
                user = conn.execute("SELECT cash FROM users WHERE id=?", (user_id,)).fetchone()
                holding = conn.execute("SELECT * FROM holdings WHERE user_id=? AND symbol=?", (user_id, order["symbol"])).fetchone()
                if order["side"] == "buy":
                    total = gross + fee
                    if user["cash"] < total:
                        conn.execute("UPDATE orders SET status='CANCELLED' WHERE id=?", (order["id"],))
                        continue
                    old_qty = holding["quantity"] if holding else 0
                    old_cost = holding["avg_cost"] if holding else 0.0
                    avg = ((old_cost * old_qty + gross + fee) / (old_qty + quantity)) if old_qty + quantity else 0
                    if holding:
                        conn.execute("UPDATE holdings SET quantity=?,avg_cost=? WHERE id=?", (old_qty + quantity, avg, holding["id"]))
                    else:
                        conn.execute("INSERT INTO holdings(user_id,symbol,name,quantity,avg_cost) VALUES(?,?,?,?,?)", (user_id, order["symbol"], order["name"], quantity, avg))
                    conn.execute("UPDATE users SET cash=cash-? WHERE id=?", (total, user_id))
                else:
                    if not holding or holding["quantity"] < quantity:
                        conn.execute("UPDATE orders SET status='CANCELLED' WHERE id=?", (order["id"],))
                        continue
                    realized = (price - holding["avg_cost"]) * quantity - fee - tax
                    conn.execute("UPDATE holdings SET quantity=quantity-?,realized_pnl=realized_pnl+? WHERE id=?", (quantity, realized, holding["id"]))
                    conn.execute("UPDATE users SET cash=cash+? WHERE id=?", (gross - fee - tax, user_id))
                conn.execute("UPDATE orders SET status='FILLED',price=?,gross=?,fee=?,tax=?,filled_at=? WHERE id=?", (price, gross, fee, tax, utc_now(), order["id"]))

    @app.middleware("http")
    async def csrf_middleware(request: Request, call_next):
        try:
            csrf_check(request)
        except HTTPException as exc:
            from fastapi.responses import JSONResponse
            return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})
        return await call_next(request)

    # Install SessionMiddleware after the decorator middleware so signed sessions
    # are initialized before the CSRF layer reads request.session.
    session_secret = os.getenv("SESSION_SECRET") or secrets.token_urlsafe(48)
    if not os.getenv("SESSION_SECRET"):
        print("[TWEN Trade] SESSION_SECRET not set; generated a temporary key. Set a persistent secret before public deployment.")
    app.add_middleware(
        SessionMiddleware,
        secret_key=session_secret,
        session_cookie="twen_session",
        max_age=60 * 60 * 24 * 14,
        same_site="lax",
        https_only=os.getenv("COOKIE_SECURE", "0") == "1",
    )

    @app.get("/", response_class=HTMLResponse)
    async def home():
        return FileResponse(TEMPLATE_DIR / "index.html")

    @app.get("/api/health")
    async def health():
        return {"status": "ok", "service": "TWEN Trade", "time": utc_now()}

    @app.get("/api/bootstrap")
    async def bootstrap(request: Request):
        if "csrf" not in request.session:
            request.session["csrf"] = secrets.token_urlsafe(24)
        quotes, meta = await refresh_quotes()
        announcements = []
        with db() as conn:
            announcements = [dict(x) for x in conn.execute("SELECT id,title,title_en,body,body_en,level,created_at FROM announcements WHERE is_published=1 ORDER BY id DESC LIMIT 10").fetchall()]
        return {"csrf": request.session["csrf"], "market": meta, "announcements": announcements}

    @app.post("/api/register")
    async def register(body: RegisterBody, request: Request):
        username = body.username.strip()
        if not re.fullmatch(r"[A-Za-z0-9_\u4e00-\u9fff]{3,24}", username):
            raise HTTPException(400, "帳號需為 3–24 個英數字、底線或中文字。")
        email = body.email.strip().lower() or None
        with db() as conn:
            try:
                cur = conn.execute("INSERT INTO users(username,email,password_hash,role,cash,created_at) VALUES(?,?,?,?,?,?)", (username, email, hash_password(body.password), "user", 1000000.0, utc_now()))
            except sqlite3.IntegrityError:
                raise HTTPException(409, "帳號或 Email 已被使用。")
            uid = cur.lastrowid
        request.session.clear()
        request.session["uid"] = uid
        request.session["csrf"] = secrets.token_urlsafe(24)
        return {"ok": True, "csrf": request.session["csrf"]}

    @app.post("/api/login")
    async def login(body: LoginBody, request: Request):
        with db() as conn:
            user = conn.execute("SELECT * FROM users WHERE username=? COLLATE NOCASE", (body.username.strip(),)).fetchone()
        if not user or not verify_password(body.password, user["password_hash"]):
            raise HTTPException(401, "帳號或密碼錯誤。")
        request.session.clear()
        request.session["uid"] = user["id"]
        request.session["csrf"] = secrets.token_urlsafe(24)
        return {"ok": True, "csrf": request.session["csrf"]}

    @app.post("/api/logout")
    async def logout(request: Request, user=Depends(current_user)):
        request.session.clear()
        return {"ok": True}

    @app.get("/api/me")
    async def me(request: Request, user=Depends(current_user)):
        await evaluate_pending(user["id"])
        quotes, meta = await refresh_quotes()
        with db() as conn:
            portfolio = portfolio_for(conn, user["id"], quotes)
            orders = [dict(x) for x in conn.execute("SELECT id,symbol,name,side,order_type,quantity,price,gross,fee,tax,status,created_at,filled_at FROM orders WHERE user_id=? ORDER BY id DESC LIMIT 20", (user["id"],)).fetchall()]
            watch = [x[0] for x in conn.execute("SELECT symbol FROM watchlist WHERE user_id=? ORDER BY created_at DESC", (user["id"],)).fetchall()]
            done = [x[0] for x in conn.execute("SELECT lesson_id FROM lesson_progress WHERE user_id=?", (user["id"],)).fetchall()]
        public_user = {k: user[k] for k in ("id", "username", "email", "role", "created_at", "disclaimer_accepted")}
        return {"user": public_user, "portfolio": portfolio, "orders": orders, "watchlist": watch, "completed_lessons": done, "market": meta}

    @app.get("/api/market")
    async def get_market(q: str = "", market_filter: str = "all", force: bool = False):
        quotes, meta = await market.get_quotes(force)
        search = q.strip().lower()
        if search:
            quotes = [x for x in quotes if search in x["symbol"].lower() or search in x["name"].lower()]
        if market_filter == "stock":
            quotes = [x for x in quotes if x["category"] == "股票"]
        elif market_filter == "etf":
            quotes = [x for x in quotes if x["category"] == "ETF"]
        return {"quotes": quotes[:500], "meta": meta}

    @app.post("/api/orders")
    async def place_order(body: OrderBody, user=Depends(current_user)):
        if not body.disclaimer_accepted:
            raise HTTPException(400, "請先確認模擬交易與風險聲明。")
        if body.side not in {"buy", "sell"}:
            raise HTTPException(400, "不支援的交易方向。")
        if body.order_type not in {"market", "limit"}:
            raise HTTPException(400, "不支援的委託類型。")
        if body.order_type == "limit" and body.limit_price is None:
            raise HTTPException(400, "限價單必須設定委託價格。")
        quotes, meta = await refresh_quotes()
        quote = quote_map(quotes).get(body.symbol)
        if not quote:
            raise HTTPException(404, "找不到此商品的可用行情，請重新整理行情。")
        price = quote["price"]
        if body.order_type == "limit":
            trigger = (body.side == "buy" and price <= body.limit_price) or (body.side == "sell" and price >= body.limit_price)
            if not trigger:
                with db() as conn:
                    if body.side == "sell":
                        h = conn.execute("SELECT quantity FROM holdings WHERE user_id=? AND symbol=?", (user["id"], body.symbol)).fetchone()
                        reserved = conn.execute("SELECT COALESCE(SUM(quantity),0) FROM orders WHERE user_id=? AND symbol=? AND side='sell' AND status='PENDING'", (user["id"], body.symbol)).fetchone()[0]
                        if not h or h["quantity"] - reserved < body.quantity:
                            raise HTTPException(400, "持有股數不足（含尚未成交的賣出委託）。")
                    oid = conn.execute("INSERT INTO orders(user_id,symbol,name,side,order_type,quantity,price,gross,fee,tax,status,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)", (user["id"], body.symbol, quote["name"], body.side, body.order_type, body.quantity, body.limit_price, 0, 0, 0, "PENDING", utc_now())).lastrowid
                return {"ok": True, "order_id": oid, "status": "PENDING", "message": "限價條件尚未符合，委託已保留。"}
            # A limit order executes at the current market price when it is better than the limit.
            # Never charge the user the full limit price when the market offers a better price.
            price = quote["price"]
        gross = round(price * body.quantity, 2)
        fee = round(gross * 0.001425, 2)
        tax_rate = 0.001 if quote["category"] == "ETF" else 0.003
        tax = round(gross * tax_rate, 2) if body.side == "sell" else 0.0
        with db() as conn:
            conn.execute("BEGIN IMMEDIATE")
            current_user_row = conn.execute("SELECT cash FROM users WHERE id=?", (user["id"],)).fetchone()
            holding = conn.execute("SELECT * FROM holdings WHERE user_id=? AND symbol=?", (user["id"], body.symbol)).fetchone()
            if body.side == "buy":
                required = gross + fee
                if current_user_row["cash"] < required:
                    raise HTTPException(400, "虛擬現金不足，請調整股數。")
                old_qty = holding["quantity"] if holding else 0
                old_cost = holding["avg_cost"] if holding else 0.0
                avg = ((old_cost * old_qty + gross + fee) / (old_qty + body.quantity))
                if holding:
                    conn.execute("UPDATE holdings SET quantity=?,avg_cost=?,name=? WHERE id=?", (old_qty + body.quantity, avg, quote["name"], holding["id"]))
                else:
                    conn.execute("INSERT INTO holdings(user_id,symbol,name,quantity,avg_cost) VALUES(?,?,?,?,?)", (user["id"], body.symbol, quote["name"], body.quantity, avg))
                conn.execute("UPDATE users SET cash=cash-? WHERE id=?", (required, user["id"]))
            else:
                reserved = conn.execute("SELECT COALESCE(SUM(quantity),0) FROM orders WHERE user_id=? AND symbol=? AND side='sell' AND status='PENDING'", (user["id"], body.symbol)).fetchone()[0]
                if not holding or holding["quantity"] - reserved < body.quantity:
                    raise HTTPException(400, "持有股數不足，無法賣出。")
                realized = (price - holding["avg_cost"]) * body.quantity - fee - tax
                conn.execute("UPDATE holdings SET quantity=quantity-?,realized_pnl=realized_pnl+? WHERE id=?", (body.quantity, realized, holding["id"]))
                conn.execute("UPDATE users SET cash=cash+? WHERE id=?", (gross - fee - tax, user["id"]))
            oid = conn.execute("INSERT INTO orders(user_id,symbol,name,side,order_type,quantity,price,gross,fee,tax,status,created_at,filled_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)", (user["id"], body.symbol, quote["name"], body.side, body.order_type, body.quantity, price, gross, fee, tax, "FILLED", utc_now(), utc_now())).lastrowid
        return {"ok": True, "order_id": oid, "status": "FILLED", "price": price, "gross": gross, "fee": fee, "tax": tax, "market": meta}

    @app.get("/api/orders")
    async def list_orders(user=Depends(current_user)):
        with db() as conn:
            rows = [dict(x) for x in conn.execute("SELECT id,symbol,name,side,order_type,quantity,price,gross,fee,tax,status,created_at,filled_at FROM orders WHERE user_id=? ORDER BY id DESC LIMIT 100", (user["id"],)).fetchall()]
        return {"orders": rows}

    @app.post("/api/orders/{order_id}/cancel")
    async def cancel_order(order_id: int, user=Depends(current_user)):
        with db() as conn:
            cur = conn.execute("UPDATE orders SET status='CANCELLED' WHERE id=? AND user_id=? AND status='PENDING'", (order_id, user["id"]))
            if cur.rowcount == 0:
                raise HTTPException(404, "找不到可取消的委託。")
        return {"ok": True}

    @app.get("/api/watchlist")
    async def get_watchlist(user=Depends(current_user)):
        quotes, _ = await refresh_quotes()
        qmap = quote_map(quotes)
        with db() as conn:
            symbols = [x[0] for x in conn.execute("SELECT symbol FROM watchlist WHERE user_id=? ORDER BY created_at DESC", (user["id"],)).fetchall()]
        return {"quotes": [qmap[s] for s in symbols if s in qmap]}

    @app.post("/api/watchlist")
    async def add_watch(body: WatchBody, user=Depends(current_user)):
        quotes, _ = await refresh_quotes()
        q = quote_map(quotes).get(body.symbol)
        if not q:
            raise HTTPException(404, "找不到此商品。")
        with db() as conn:
            conn.execute("INSERT OR IGNORE INTO watchlist(user_id,symbol,created_at) VALUES(?,?,?)", (user["id"], body.symbol, utc_now()))
        return {"ok": True}

    @app.delete("/api/watchlist/{symbol}")
    async def remove_watch(symbol: str, user=Depends(current_user)):
        with db() as conn:
            conn.execute("DELETE FROM watchlist WHERE user_id=? AND symbol=?", (user["id"], symbol))
        return {"ok": True}

    @app.get("/api/announcements")
    async def get_announcements():
        with db() as conn:
            rows = [dict(x) for x in conn.execute("SELECT id,title,title_en,body,body_en,level,created_at FROM announcements WHERE is_published=1 ORDER BY id DESC LIMIT 50").fetchall()]
        return {"announcements": rows}

    @app.get("/api/lessons")
    async def get_lessons(user=Depends(current_user)):
        with db() as conn:
            rows = [dict(x) for x in conn.execute("SELECT id,title,title_en,category,category_en,level,body,body_en,duration,duration_en,image_path FROM lessons WHERE is_published=1 ORDER BY level,id").fetchall()]
            done = {x[0] for x in conn.execute("SELECT lesson_id FROM lesson_progress WHERE user_id=?", (user["id"],)).fetchall()}
        for row in rows:
            row["completed"] = row["id"] in done
        return {"lessons": rows, "completed_count": len(done)}

    @app.post("/api/lessons/{lesson_id}/complete")
    async def complete_lesson(lesson_id: int, user=Depends(current_user)):
        with db() as conn:
            exists = conn.execute("SELECT 1 FROM lessons WHERE id=? AND is_published=1", (lesson_id,)).fetchone()
            if not exists:
                raise HTTPException(404, "找不到此課程。")
            conn.execute("INSERT OR IGNORE INTO lesson_progress(user_id,lesson_id,completed_at) VALUES(?,?,?)", (user["id"], lesson_id, utc_now()))
        return {"ok": True}

    @app.get("/api/leaderboard")
    async def leaderboard():
        quotes, _ = await refresh_quotes()
        with db() as conn:
            users = conn.execute("SELECT id,username,cash FROM users WHERE role='user' ORDER BY id ASC LIMIT 500").fetchall()
            results = []
            for u in users:
                p = portfolio_for(conn, u["id"], quotes)
                results.append({"username": u["username"], "equity": p["equity"], "return_pct": p["total_pnl_pct"]})
        results.sort(key=lambda x: x["equity"], reverse=True)
        return {"leaderboard": results[:50]}

    @app.get("/api/admin/summary")
    async def admin_summary(admin=Depends(admin_user)):
        with db() as conn:
            return {
                "users": conn.execute("SELECT COUNT(*) FROM users WHERE role='user'").fetchone()[0],
                "announcements": conn.execute("SELECT COUNT(*) FROM announcements").fetchone()[0],
                "lessons": conn.execute("SELECT COUNT(*) FROM lessons").fetchone()[0],
                "orders": conn.execute("SELECT COUNT(*) FROM orders").fetchone()[0],
            }

    @app.get("/api/admin/users")
    async def admin_users(admin=Depends(admin_user)):
        with db() as conn:
            rows = [dict(x) for x in conn.execute("SELECT id,username,email,role,cash,created_at FROM users ORDER BY id DESC LIMIT 200").fetchall()]
        return {"users": rows}

    @app.post("/api/admin/announcements")
    async def admin_create_announcement(body: AnnouncementBody, admin=Depends(admin_user)):
        if body.level not in {"info", "success", "warning", "urgent"}:
            raise HTTPException(400, "公告類型無效。")
        with db() as conn:
            cur = conn.execute("INSERT INTO announcements(title,title_en,body,body_en,level,is_published,created_at,created_by) VALUES(?,?,?,?,?,?,?,?)", (body.title, body.title_en or None, body.body, body.body_en or None, body.level, int(body.is_published), utc_now(), admin["id"]))
        return {"ok": True, "id": cur.lastrowid}

    @app.delete("/api/admin/announcements/{announcement_id}")
    async def admin_delete_announcement(announcement_id: int, admin=Depends(admin_user)):
        with db() as conn:
            conn.execute("DELETE FROM announcements WHERE id=?", (announcement_id,))
        return {"ok": True}

    @app.post("/api/admin/lessons")
    async def admin_create_lesson(body: LessonBody, admin=Depends(admin_user)):
        with db() as conn:
            cur = conn.execute("INSERT INTO lessons(title,title_en,category,category_en,level,body,body_en,duration,duration_en,is_published,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)", (body.title, body.title_en or None, body.category, body.category_en or None, body.level, body.body, body.body_en or None, body.duration, body.duration_en or None, int(body.is_published), utc_now()))
        return {"ok": True, "id": cur.lastrowid}

    @app.post("/api/admin/lessons/{lesson_id}/image")
    async def admin_lesson_image(lesson_id: int, image: UploadFile = File(...), admin=Depends(admin_user)):
        allowed = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif"}
        if image.content_type not in allowed:
            raise HTTPException(400, "僅接受 JPG、PNG、WebP 或 GIF 圖片。")
        content = await image.read(3 * 1024 * 1024 + 1)
        if len(content) > 3 * 1024 * 1024:
            raise HTTPException(413, "圖片不可超過 3 MB。")
        if not content.startswith((b"\xff\xd8\xff", b"\x89PNG\r\n\x1a\n", b"RIFF", b"GIF87a", b"GIF89a")):
            raise HTTPException(400, "圖片檔案內容無效。")
        filename = f"lesson_{lesson_id}_{secrets.token_hex(8)}{allowed[image.content_type]}"
        (UPLOAD_DIR / filename).write_bytes(content)
        with db() as conn:
            cur = conn.execute("UPDATE lessons SET image_path=? WHERE id=?", (f"/uploads/{filename}", lesson_id))
            if cur.rowcount == 0:
                (UPLOAD_DIR / filename).unlink(missing_ok=True)
                raise HTTPException(404, "找不到此課程。")
        return {"ok": True, "image_path": f"/uploads/{filename}"}

    @app.delete("/api/admin/lessons/{lesson_id}")
    async def admin_delete_lesson(lesson_id: int, admin=Depends(admin_user)):
        with db() as conn:
            conn.execute("DELETE FROM lessons WHERE id=?", (lesson_id,))
        return {"ok": True}

    @app.get("/api/admin/announcements")
    async def admin_list_announcements(admin=Depends(admin_user)):
        with db() as conn:
            rows = [dict(x) for x in conn.execute("SELECT * FROM announcements ORDER BY id DESC LIMIT 100").fetchall()]
        return {"announcements": rows}

    @app.get("/api/admin/lessons")
    async def admin_list_lessons(admin=Depends(admin_user)):
        with db() as conn:
            rows = [dict(x) for x in conn.execute("SELECT * FROM lessons ORDER BY id DESC LIMIT 100").fetchall()]
        return {"lessons": rows}

    @app.exception_handler(HTTPException)
    async def http_error_handler(request: Request, exc: HTTPException):
        from fastapi.responses import JSONResponse
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail}, headers=exc.headers)

    return app


_default_admin = os.getenv("ADMIN_PASSWORD")
if not _default_admin:
    _default_admin = secrets.token_urlsafe(18)
    print(f"[TWEN Trade] Initial admin password (save it now): {_default_admin}")
app = create_app(bootstrap_admin_password=_default_admin)
