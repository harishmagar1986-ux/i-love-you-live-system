const express = require("express");
const app = express();
const PORT = process.env.PORT || 10000;

// ================= UI =================
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>I LOVE YOU PRO</title>

<style>
body{
  background:#07111f;
  color:white;
  font-family:Arial;
  text-align:center;
  padding:15px;
}
h1{font-size:32px}

button{
  padding:15px 25px;
  border:none;
  border-radius:20px;
  background:#4CAF50;
  color:white;
  font-size:18px;
  margin:15px;
}

.card{
  background:#111827;
  padding:18px;
  margin:15px 0;
  border-radius:20px;
  box-shadow:0 0 15px #000;
}

.good{color:#00ffcc;font-weight:bold}
.wait{color:yellow;font-weight:bold}
.bad{color:#ff5c5c;font-weight:bold}

.bar{
  background:#333;
  border-radius:20px;
  overflow:hidden;
  margin:10px 0;
}

.fill{
  height:12px;
  background:#00ffcc;
}
</style>

</head>

<body>

<h1>❤️ I LOVE YOU PRO</h1>
<p>Live Cricket AI System</p>

<button onclick="load()">Load Matches</button>

<div id="matches"></div>

<script>

async function load(){
  document.getElementById("matches").innerHTML="Loading...";

  let res = await fetch("/api/current-matches");
  let json = await res.json();

  let html = json.data.map(m=>{
    let a = analyze(m);

    return \`
      <div class="card">
        <h2>\${m.name}</h2>
        <p>\${m.status}</p>
        <b>\${m.score}</b>

        <p class="\${a.cls}">\${a.decision}</p>

        <p>Win: \${a.win}%</p>
        <div class="bar">
          <div class="fill" style="width:\${a.win}%"></div>
        </div>

        <p>Opportunity: \${a.opportunity}/100</p>
        <p>Momentum: \${a.momentum}</p>
        <p>Risk: \${a.risk}</p>
      </div>
    \`;
  }).join("");

  document.getElementById("matches").innerHTML = html;
}

// AI ENGINE
function analyze(m){
  let s = (m.status||"").toLowerCase();

  let win = 50;
  let decision = "⏳ WAIT";
  let cls = "wait";
  let opportunity = 50;
  let momentum = "Neutral";
  let risk = "Medium";

  if(s.includes("won")){
    win=100; decision="✅ FINISHED"; cls="good";
    opportunity=0; momentum="Completed"; risk="None";
  }
  else if(s.includes("need") || s.includes("target")){
    win=65; decision="🔥 CHASE OPPORTUNITY"; cls="good";
    opportunity=80; momentum="Chasing"; risk="Medium";
  }
  else if(s.includes("rain") || s.includes("delay")){
    win=30; decision="⚠️ BLOCK"; cls="bad";
    opportunity=20; momentum="Stopped"; risk="High";
  }
  else{
    win=55; decision="📊 WATCH"; cls="wait";
    opportunity=60; momentum="Live"; risk="Medium";
  }

  return {win,decision,cls,opportunity,momentum,risk};
}

// AUTO REFRESH
setInterval(load,15000);

</script>

</body>
</html>
  `);
});


// ================= SAFE API =================
app.get("/api/current-matches", (req, res) => {
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
      },
      {
        name: "India vs Australia",
        status: "Rain delay",
        score: "Match paused"
      }
    ]
  });
});


// ================= SERVER =================
app.listen(PORT, () => {
  console.log("🔥 I LOVE YOU PRO RUNNING on " + PORT);
});
