const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const db = require('./config/db');


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/stores', require('./routes/stores'));
app.use('/api/ratings', require('./routes/ratings'));
app.use('/api/owner', require('./routes/owner'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/stores', require('./routes/storeRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));