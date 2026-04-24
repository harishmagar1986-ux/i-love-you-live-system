require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.CRICKET_API_KEY;
const BASE = "https://api.cricapi.com/v1";

app.use(cors({ origin: "*"}));
app.use(express.json());
app.use(rateLimit({ windowMs: 60 * 1000, max: 60 }));

function safeError(res, msg = "Server error") {
  return res.status(500).json({ ok: false, error: msg });
}

async function getJson(url) {
  const r = await fetch(url);
  return await r.json();
}

app.get("/", (req, res) => {
  res.send("I LOVE YOU Cricket AI Backend Running ✅");
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, app: "I LOVE YOU Cricket AI", time: new Date().toISOString() });
});

app.get("/api/matches", async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ ok: false, error: "API key missing on server" });
    const data = await getJson(`${BASE}/currentMatches?apikey=${API_KEY}&offset=0`);
    res.json({ ok: true, data: data.data || [], info: data.info || {} });
  } catch {
    safeError(res, "Could not load matches");
  }
});

app.get("/api/scorecard/:id", async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ ok: false, error: "API key missing on server" });
    const id = encodeURIComponent(req.params.id);
    const data = await getJson(`${BASE}/match_scorecard?apikey=${API_KEY}&id=${id}`);
    res.json({ ok: true, data: data.data || null, info: data.info || {} });
  } catch {
    safeError(res, "Could not load scorecard");
  }
});

app.get("/api/ballbyball/:id", async (req, res) => {
  res.json({
    ok: true,
    note: "Ball-by-ball endpoint depends on provider plan/coverage. Current protected package uses live scorecard safely."
  });
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
