// server.js
// Minimal Node.js backend using Express to support keep-alive and purchase simulation.

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static front-end files
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// Keep-alive / health endpoint
// Returns { ok: true, ts, latencyMs } and simulates a very small processing delay.
app.get('/api/keep-alive', async (req, res) => {
  const start = Date.now();
  // Simulate light work (0–150ms)
  const delay = Math.floor(Math.random() * 150);
  await new Promise((r) => setTimeout(r, delay));
  res.json({
    ok: true,
    ts: new Date().toISOString(),
    latencyMs: Date.now() - start
  });
});

// Purchase endpoint (no payment). It marks how long it takes to receive and return success.
// Returns { success: true, receivedInMs, requestId }
app.post('/api/purchase', async (req, res) => {
  const receivedStart = Date.now();
  // Simulate short processing (150–500ms)
  const delay = 150 + Math.floor(Math.random() * 350);
  await new Promise((r) => setTimeout(r, delay));
  const receivedInMs = Date.now() - receivedStart;

  //purchaseID
  const generatePurchaseId = () => {
    return 'purch_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
  };
  const purchaseId = generatePurchaseId();

  // Echo back simple details (no sensitive info)
  const { items = [], currency = 'USD', total = 0 } = req.body || {};
  res.json({
    success: true,
    receivedInMs,
    currency,
    total,
    itemsCount: Array.isArray(items) ? items.length : 0,
    requestId: `${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
    purchaseId: purchaseId
  });
});

// Exchange rates endpoint (mocked but could be swapped to real provider).
// Base is USD. Rates: USD, EUR, HKD, RMB.
app.get('/api/rates', (req, res) => {
  // In real use, fetch from a provider like ECB, exchangerate.host, etc.
  // Here we provide a stable mock set. You can update as needed.
  res.json({
    base: 'USD',
    ts: new Date().toISOString(),
    rates: {
      USD: 1,
      EUR: 0.92,
      HKD: 7.80,
      RMB: 7.10
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Shopping app server running on http://localhost:${PORT}`);
});

app.get('/api/rates', (req, res) => {
  // Return mock exchange rates (same as your default in frontend)
  res.json({
    base: 'USD',
    rates: {
      USD: 1,
      EUR: 0.92,
      HKD: 7.8,
      RMB: 7.1
    },
    ts: Date.now()
  });
});

