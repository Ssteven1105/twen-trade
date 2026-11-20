import io

import pytest
from fastapi.testclient import TestClient

from app import DEMO_QUOTES, create_app


@pytest.fixture()
def client(tmp_path):
    app = create_app(tmp_path / "test.db", bootstrap_admin_password="AdminTestPass!234")

    async def fake_quotes(force=False):
        meta = {
            "source": "測試行情", "market_date": "2026-11-19", "is_demo": True,
            "is_realtime": False, "note": "Fixture quote", "error": None,
        }
        return [dict(x) for x in DEMO_QUOTES], meta

    app.state.market.get_quotes = fake_quotes
    with TestClient(app) as test_client:
        yield test_client


def register(client, username="tester", password="TestPass!234"):
    response = client.post("/api/register", json={"username": username, "email": "", "password": password})
    assert response.status_code == 200, response.text
    return response.json()["csrf"]


def post_headers(csrf):
    return {"x-csrf-token": csrf}


def test_seed_lessons_have_traditional_chinese_and_english_content(tmp_path):
    app = create_app(tmp_path / "fresh-seed.db", bootstrap_admin_password="AdminTestPass!234")
    with TestClient(app) as fresh:
        register(fresh, username="lessoncheck")
        lessons = fresh.get("/api/lessons").json()["lessons"]
        assert len(lessons) >= 5
        assert all(item["body"].strip() for item in lessons)
        assert all(item["body_en"].strip() for item in lessons)
        assert "股票" in lessons[0]["body"]


def test_health_and_bootstrap(client):
    assert client.get("/api/health").json()["status"] == "ok"
    data = client.get("/api/bootstrap").json()
    assert data["csrf"]
    assert data["market"]["is_realtime"] is False


def test_register_duplicate_and_initial_capital(client):
    csrf = register(client)
    me = client.get("/api/me").json()
    assert me["user"]["username"] == "tester"
    assert me["portfolio"]["cash"] == 1_000_000
    assert me["portfolio"]["equity"] == 1_000_000
    assert me["portfolio"]["holdings"] == []
    duplicate = client.post("/api/register", json={"username": "tester", "password": "TestPass!234"})
    assert duplicate.status_code == 409
    assert csrf


def test_login_valid_and_invalid(tmp_path):
    app = create_app(tmp_path / "login.db", bootstrap_admin_password="AdminTestPass!234")
    c1 = TestClient(app)
    register(c1)
    c2 = TestClient(app)
    bad = c2.post("/api/login", json={"username": "tester", "password": "wrong-password"})
    assert bad.status_code == 401
    ok = c2.post("/api/login", json={"username": "tester", "password": "TestPass!234"})
    assert ok.status_code == 200
    assert c2.get("/api/me").status_code == 200
    c1.close(); c2.close()


def test_buy_sell_cash_holdings_and_fees(client):
    csrf = register(client)
    missing_disclaimer = client.post("/api/orders", headers=post_headers(csrf), json={"symbol":"2330","side":"buy","quantity":10,"disclaimer_accepted":False})
    assert missing_disclaimer.status_code == 400
    buy = client.post("/api/orders", headers=post_headers(csrf), json={"symbol":"2330","side":"buy","quantity":10,"disclaimer_accepted":True})
    assert buy.status_code == 200, buy.text
    assert buy.json()["status"] == "FILLED"
    assert buy.json()["fee"] > 0
    me = client.get("/api/me").json()
    assert me["portfolio"]["holdings"][0]["quantity"] == 10
    assert me["portfolio"]["cash"] < 1_000_000
    sell = client.post("/api/orders", headers=post_headers(csrf), json={"symbol":"2330","side":"sell","quantity":4,"disclaimer_accepted":True})
    assert sell.status_code == 200, sell.text
    me = client.get("/api/me").json()
    assert me["portfolio"]["holdings"][0]["quantity"] == 6
    assert me["portfolio"]["realized_pnl"] != 0



def test_realized_pnl_remains_after_fully_closing_position(client):
    csrf = register(client)
    buy = client.post("/api/orders", headers=post_headers(csrf), json={"symbol":"2330","side":"buy","quantity":2,"disclaimer_accepted":True})
    assert buy.status_code == 200
    sell = client.post("/api/orders", headers=post_headers(csrf), json={"symbol":"2330","side":"sell","quantity":2,"disclaimer_accepted":True})
    assert sell.status_code == 200
    portfolio = client.get("/api/me").json()["portfolio"]
    assert portfolio["holdings"] == []
    assert portfolio["realized_pnl"] != 0

def test_reject_insufficient_cash_and_shares(client):
    csrf = register(client)
    expensive = client.post("/api/orders", headers=post_headers(csrf), json={"symbol":"2330","side":"buy","quantity":100000,"disclaimer_accepted":True})
    assert expensive.status_code == 400
    no_shares = client.post("/api/orders", headers=post_headers(csrf), json={"symbol":"2330","side":"sell","quantity":1,"disclaimer_accepted":True})
    assert no_shares.status_code == 400


def test_limit_order_pending_and_cancel(client):
    csrf = register(client)
    pending = client.post("/api/orders", headers=post_headers(csrf), json={"symbol":"2330","side":"buy","quantity":1,"order_type":"limit","limit_price":100,"disclaimer_accepted":True})
    assert pending.status_code == 200, pending.text
    assert pending.json()["status"] == "PENDING"
    rows = client.get("/api/orders").json()["orders"]
    assert rows[0]["status"] == "PENDING"
    cancel = client.post(f"/api/orders/{pending.json()['order_id']}/cancel", headers=post_headers(csrf))
    assert cancel.status_code == 200
    rows = client.get("/api/orders").json()["orders"]
    assert rows[0]["status"] == "CANCELLED"



def test_pending_limit_order_executes_when_reference_price_reaches_limit(tmp_path):
    app = create_app(tmp_path / "limit-fill.db", bootstrap_admin_password="AdminTestPass!234")
    quotes = [dict(x) for x in DEMO_QUOTES]
    async def fake_quotes(force=False):
        return [dict(x) for x in quotes], {"source":"test","market_date":"2026-11-19","is_demo":True,"is_realtime":False,"note":"test","error":None}
    app.state.market.get_quotes = fake_quotes
    client = TestClient(app)
    csrf = register(client)
    pending = client.post("/api/orders", headers=post_headers(csrf), json={"symbol":"2330","side":"buy","quantity":2,"order_type":"limit","limit_price":100,"disclaimer_accepted":True})
    assert pending.status_code == 200 and pending.json()["status"] == "PENDING"
    quotes[0]["price"] = 90.0
    me = client.get("/api/me").json()
    assert me["orders"][0]["status"] == "FILLED"
    assert me["orders"][0]["price"] == 90.0
    assert me["portfolio"]["holdings"][0]["quantity"] == 2
    assert me["portfolio"]["cash"] < 1_000_000
    client.close()

def test_watchlist_add_remove(client):
    csrf = register(client)
    add = client.post("/api/watchlist", headers=post_headers(csrf), json={"symbol":"0050"})
    assert add.status_code == 200
    assert client.get("/api/watchlist").json()["quotes"][0]["symbol"] == "0050"
    remove = client.delete("/api/watchlist/0050", headers=post_headers(csrf))
    assert remove.status_code == 200
    assert client.get("/api/watchlist").json()["quotes"] == []


def test_market_filters_and_search(client):
    all_data = client.get("/api/market").json()
    assert any(q["symbol"] == "2330" for q in all_data["quotes"])
    etfs = client.get("/api/market?market_filter=etf").json()["quotes"]
    assert etfs and all(q["category"] == "ETF" for q in etfs)
    search = client.get("/api/market?q=台積電").json()["quotes"]
    assert search[0]["symbol"] == "2330"


def test_lesson_progress_and_disclaimer(client):
    csrf = register(client)
    lessons = client.get("/api/lessons").json()["lessons"]
    assert len(lessons) >= 5
    assert lessons[0]["title_en"] == "What Is a Stock?"
    assert "A stock represents" in lessons[0]["body_en"]
    assert lessons[0]["category_en"] == "Fundamentals"
    lesson_id = lessons[0]["id"]
    result = client.post(f"/api/lessons/{lesson_id}/complete", headers=post_headers(csrf))
    assert result.status_code == 200
    me = client.get("/api/me").json()
    assert lesson_id in me["completed_lessons"]


def test_admin_permissions_announcements_and_lesson_image(tmp_path):
    app = create_app(tmp_path / "admin.db", bootstrap_admin_password="AdminTestPass!234")
    async def fake_quotes(force=False):
        return [dict(x) for x in DEMO_QUOTES], {"source":"test","market_date":"test","is_demo":True,"is_realtime":False,"note":"test","error":None}
    app.state.market.get_quotes = fake_quotes
    user = TestClient(app)
    register(user)
    nonadmin = user.post("/api/admin/announcements", headers=post_headers(user.get('/api/bootstrap').json()['csrf']), json={"title":"x","body":"y"})
    assert nonadmin.status_code == 403
    user.close()

    admin = TestClient(app)
    login = admin.post("/api/login", json={"username":"admin","password":"AdminTestPass!234"})
    assert login.status_code == 200, login.text
    csrf = login.json()["csrf"]
    created = admin.post("/api/admin/announcements", headers=post_headers(csrf), json={"title":"Test notice","title_en":"Test notice EN","body":"Hello","body_en":"Hello in English","level":"info","is_published":True})
    assert created.status_code == 200, created.text
    public_notice = admin.get("/api/announcements").json()["announcements"][0]
    assert public_notice["title"] == "Test notice"
    assert public_notice["title_en"] == "Test notice EN"
    assert public_notice["body_en"] == "Hello in English"
    lesson = admin.post("/api/admin/lessons", headers=post_headers(csrf), json={"title":"Image lesson","title_en":"Image lesson EN","category":"Test","category_en":"Testing","level":1,"body":"Text","body_en":"English text","duration":"3 分鐘","duration_en":"3 min"})
    assert lesson.status_code == 200
    new_lesson_id = lesson.json()["id"]
    admin_lessons = admin.get("/api/admin/lessons").json()["lessons"]
    created_lesson = next(x for x in admin_lessons if x["id"] == new_lesson_id)
    assert created_lesson["title_en"] == "Image lesson EN"
    # Minimal PNG signature fixture is enough for the endpoint's file-signature validation.
    image_bytes = b"\x89PNG\r\n\x1a\n" + b"\x00" * 16
    uploaded = admin.post(f"/api/admin/lessons/{lesson.json()['id']}/image", headers=post_headers(csrf), files={"image":("tiny.png",io.BytesIO(image_bytes),"image/png")})
    assert uploaded.status_code == 200, uploaded.text
    assert uploaded.json()["image_path"].startswith("/uploads/")
    admin.close()


def test_csrf_protection(client):
    register(client)
    bad = client.post("/api/watchlist", json={"symbol":"0050"})
    assert bad.status_code == 403


def test_leaderboard(client):
    register(client)
    data = client.get("/api/leaderboard").json()
    assert data["leaderboard"][0]["username"] == "tester"

