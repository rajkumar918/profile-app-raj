// Simple example Express server with profile endpoints (for local testing)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
// Allow CORS from the frontend host; default to allow all for easy deploy.
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(bodyParser.json());

// In-memory store for demo purposes
const store = { profiles: {} };

app.get('/api/profile/:id', (req, res) => {
  const id = req.params.id;
  if (store.profiles[id]) return res.json(store.profiles[id]);
  return res.status(404).json({ error: 'Not found' });
});

app.post('/api/profile', (req, res) => {
  const profile = req.body;
  const id = profile.id || 'me';
  store.profiles[id] = profile;
  return res.json({ ok: true, id });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Example server running on http://localhost:${PORT}`));

module.exports = app;
