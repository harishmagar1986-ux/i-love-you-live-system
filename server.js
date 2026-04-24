const express = require("express");
const app = express();
const PORT = process.env.PORT || 10000;

// Serve frontend
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>I LOVE YOU PRO</title>

<style>
body{background:#07111f;color:white;font-family:Arial;text-align:center;padding:15px}
h1{font-size:32px}
button{padding:15px 25px;margin:15px;border:none;border-radius:20px;background:#4CAF50;color:white;font-size:18px}
.card{background:#111827;padding:20px;margin:20px 0;border-radius:25px;box-shadow:0 0 20px #000}
.good{color:#00ffcc;font-weight:bold}
.wait{color:yellow;font-weight:bold}
.bad{color:#ff5c5c;font-weight:bold}
.bar{background:#333;border-radius:20px;overflow:hidden;margin:10px 0}
.fill{height:12px;background:#00ffcc}
</style>

</head>
<body>

<h1>❤️ I LOVE YOU PRO</h1>
<p>Live Cricket AI System</p>

<button onclick="load()">Load Matches</button>

<div id="matches"></div>

<script>

async function load(){
  document.getElementById("matches").innerHTML = "Loading...";

  let res = await fetch("/api/matches");
  let json = await res.json();

  document.getElementById("matches").innerHTML =
    json.data.map(m => {
      let a = analyze(m);

      return \`
      <div class="card">
        <h2>\${m.name}</h2>
        <p>\${m.status}</p>
        <h3>\${m.score}</h3>

        <p class="\${a.cls}">\${a.decision}</p>

        <p>Win: \${a.win}%</p>
        <div class="bar"><div class="fill" style="width:\${a.win}%"></div></div>

        <p>Opportunity: \${a.opportunity}/100</p>
        <p>Momentum: \${a.momentum}</p>
        <p>Risk: \${a.risk}</p>
      </div>
      \`;
    }).join("");
}

// 🔥 AI ENGINE
function analyze(m){
  let status = m.status.toLowerCase();
  let score = m.score;

  let win = 50;
  let opportunity = 50;
  let decision = "WAIT";
  let cls = "wait";
  let momentum = "Neutral";
  let risk = "Medium";

  // Detect chase
  let match = status.match(/need (\\d+) runs? in (\\d+)/);

  if(match){
    let runs = parseInt(match[1]);
    let balls = parseInt(match[2]);
    let rr = (runs / balls) * 6;

    if(rr <= 6){
      win = 75;
      opportunity = 85;
      decision = "🔥 STRONG YES";
      cls = "good";
      momentum = "Strong Chase";
      risk = "Low";
    }
    else if(rr <= 8){
      win = 60;
      opportunity = 70;
      decision = "⚡ YES";
      cls = "good";
      momentum = "Balanced";
      risk = "Medium";
    }
    else{
      win = 40;
      opportunity = 40;
      decision = "❌ NO";
      cls = "bad";
      momentum = "Pressure";
      risk = "High";
    }
  }

  // Wicket pressure
  let w = score.match(/\\/(\\d+)/);
  if(w && parseInt(w[1]) >= 6){
    win -= 20;
    opportunity -= 25;
    decision = "🚫 BLOCK";
    cls = "bad";
    risk = "High";
    momentum = "Collapse Risk";
  }

  return {
    win: Math.max(0, Math.min(100, win)),
    opportunity: Math.max(0, Math.min(100, opportunity)),
    decision,
    cls,
    momentum,
    risk
  };
}

setInterval(load,15000);

</script>

</body>
</html>
  `);
});

// 🔥 SAFE API (NO EXTERNAL = NO CRASH)
app.get("/api/matches", (req, res) => {
  res.json({
    data: [
      {
        name: "Mumbai vs Chennai",
        status: "Mumbai need 36 runs in 24 balls",
        score: "143/4 (16 overs)"
      },
      {
        name: "RCB vs Rajasthan",
        status: "RCB 106/1 (10 overs)",
        score: "106/1"
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log("SERVER RUNNING 🚀");
});
