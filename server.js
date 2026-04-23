const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

// ✅ VERY IMPORTANT (serves your website)
app.use(express.static('public'));

// ✅ Health check
app.get('/api/health', (req, res) => {
res.json({ status: 'OK 🚀' });
});

// ✅ Demo API (temporary working)
app.get('/api/current-matches', (req, res) => {
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
console.log('Server running...');
});
