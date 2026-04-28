const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const dns = require('node:dns').promises;
const { Resolver } = require('node:dns').promises;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const itemRoutes = require('./routes/Items');
app.use('/api/items', itemRoutes);

// DNS Test Function
async function testDNS() {
  try {
    const resolver = new Resolver();
    resolver.setServers(['8.8.8.8']);

    const customResult = await resolver.resolve4('example.com');
    console.log('Custom DNS:', customResult);

    const defaultResult = await dns.resolve4('example.com');
    console.log('Default DNS:', defaultResult);

  } catch (err) {
    console.error('DNS Error:', err);
  }
}

// Start server + DB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("ERROR: MONGO_URI is not defined in .env file");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    await testDNS(); // optional: run DNS check at startup

    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch(err => {
    console.error('❌ Database connection error:', err.message);
  });
