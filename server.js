const fetch = require("node-fetch");

app.get('/api/current-matches', async (req, res) => {
  try {
    const response = await fetch("https://api.cricapi.com/v1/currentMatches?apikey=YOUR_API_KEY&offset=0");
    const data = await response.json();

    const matches = data.data.map(m => ({
      name: m.name,
      status: m.status,
      score: m.score?.map(s => `${s.r}/${s.w} (${s.o} ov)`).join(" | ") || "N/A"
    }));

    res.json({ data: matches });

  } catch (err) {
    res.json({ data: [], error: "API error" });
  }
});
