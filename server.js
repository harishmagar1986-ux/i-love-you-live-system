const fetch = require("node-fetch");

app.get('/api/current-matches', async (req, res) => {
  try {
    const response = await fetch("https://api.cricketdata.org/v1/matches?apikey=275608b3-211a-43c8");
    const json = await response.json();

    const matches = json.data.map(m => ({
      name: `${m.teamInfo?.[0]?.name || ''} vs ${m.teamInfo?.[1]?.name || ''}`,
      status: m.status || "Live",
      score: m.score
        ? m.score.map(s => `${s.r}/${s.w} (${s.o} ov)`).join(" | ")
        : "N/A"
    }));

    res.json({ data: matches });

  } catch (err) {
    res.json({ data: [], error: "API error" });
  }
});
