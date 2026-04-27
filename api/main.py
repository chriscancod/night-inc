"""
Night.inc Mock API — FastAPI
Run: uvicorn main:app --reload --port 8787
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random, time, math

app = FastAPI(title="Night.inc Mock API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

PRODUCTS = ["iPhone 16 Pro Case", "MagSafe Wallet", "Drop Shield", "Night Edition Bundle"]
REGIONS  = ["NYC", "LA", "CHI", "MIA", "ATL", "DEN", "SEA", "BOS"]

def drift(base, pct=0.08):
    return round(base * (1 + random.uniform(-pct, pct)), 2)

@app.get("/api/overview")
def overview():
    return {
        "revenue_today":    drift(1247.82, 0.15),
        "units_sold":       random.randint(240, 260),
        "active_operators": random.randint(85, 115),
        "lab_temp":         round(random.uniform(38, 56), 1),
        "uptime":           round(99.5 + random.random() * 0.49, 2),
        "timestamp":        int(time.time()),
    }

@app.get("/api/shopify")
def shopify():
    orders = []
    for _ in range(6):
        orders.append({
            "id":      hex(random.randint(0x1000, 0xFFFF))[2:].upper(),
            "product": random.choice(PRODUCTS),
            "amount":  round(random.randint(29, 89) + 0.99, 2),
            "region":  random.choice(REGIONS),
            "ts":      int(time.time()) - random.randint(0, 3600),
        })
    hourly = [round(20 + 80 * abs(math.sin(i * 0.4 + random.random())), 2) for i in range(24)]
    return {
        "revenue_today": drift(1247.82, 0.2),
        "units_today":   random.randint(8, 24),
        "top_product":   PRODUCTS[0],
        "orders":        sorted(orders, key=lambda x: x["ts"], reverse=True),
        "hourly_revenue": hourly,
    }

@app.get("/api/noctis")
def noctis():
    return {
        "cpu_temp":       round(random.uniform(38, 56), 1),
        "ambient_temp":   round(random.uniform(22, 28), 1),
        "sla_temp":       round(random.uniform(34, 44), 1),
        "uptime_pct":     round(99.5 + random.random() * 0.49, 2),
        "build_status":   random.choice(["NOMINAL", "NOMINAL", "NOMINAL", "ELEVATED"]),
        "batch": {
            "id":       "BATCH_01",
            "units":    4,
            "complete": 0,
            "pct":      18,
            "status":   "MFG_IN_PROGRESS",
            "est_ship": "Q3_2026",
        },
    }

@app.get("/api/apx")
def apx():
    operators = [
        {"name": "CHRIS",      "score": random.randint(90, 99), "streak": 12, "pro": True},
        {"name": "APEX_01",    "score": random.randint(75, 88), "streak": 7,  "pro": False},
        {"name": "NOCTIS_X",   "score": random.randint(68, 80), "streak": 5,  "pro": False},
        {"name": "OPERATOR_9", "score": random.randint(55, 72), "streak": 3,  "pro": False},
    ]
    return {
        "focus_score":    operators[0]["score"],
        "sessions_today": random.randint(2, 5),
        "streak_days":    12,
        "total_xp":       random.randint(2800, 3100),
        "active_users":   random.randint(85, 115),
        "pro_keys_active": 4,
        "operators":      operators,
    }

@app.get("/api/activity")
def activity():
    templates = [
        {"tag": "SHOPIFY", "text": f"Order #{hex(random.randint(0x1000,0x9999))[2:].upper()} — {random.choice(PRODUCTS)}", "color": "#00BFFF"},
        {"tag": "APX",     "text": f"Focus session complete — +{random.randint(50,200)} XP",       "color": "#8B5CF6"},
        {"tag": "NOCTIS",  "text": f"Lab thermal nominal — CPU {round(random.uniform(38,56),1)}°C", "color": "#FF8C00"},
        {"tag": "CLIKEY",  "text": f"Batch 01 cycle {random.randint(1,24)}/24 complete",            "color": "#A8A9AD"},
        {"tag": "SYS",     "text": "CEO dashboard accessed // CHRIS_MODE",                          "color": "#525252"},
    ]
    events = []
    for i in range(10):
        t = random.choice(templates)
        events.append({**t, "ts": int(time.time()) - i * random.randint(30, 300)})
    return {"events": sorted(events, key=lambda x: x["ts"], reverse=True)}

@app.get("/health")
def health():
    return {"status": "ok", "system": "NIGHT.INC", "mode": "CLASSIFIED"}
