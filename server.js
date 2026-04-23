const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static('public'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK 🚀' });
});

app.get('/api/current-matches', async (req, res) => {
  try {
    const API_KEY = "275608b3-211a-43c8-a57a-b7e30473d84c";

    const response = await fetch(
      `https://api.cricapi.com/v1/currentMatches?apikey=${API_KEY}&offset=0`
    );

    const data = await response.json();

    const matches = data.data?.map(m => ({
      name: m.name || "Live Match",
      status: m.status || "Status unavailable",
      score: m.score?.map(s => `${s.r}/${s.w} (${s.o} overs)`).join(" | ") || "Score unavailable"
    })) || [];

    if (matches.length === 0) throw new Error("No matches");

    res.json({ data: matches });

  } catch (err) {
    res.json({
      data: [
        {
          name: "API Backup Mode",
          status: "Live API not responding",
          score: "Try again after some time"
        }
      ]
    });
  }
});

app.listen(PORT, () => {
  console.log('Server running...');
});
