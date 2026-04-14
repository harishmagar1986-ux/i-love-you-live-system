const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK 🚀' });
});

app.listen(PORT, () => {
  console.log('Server running...');
});
