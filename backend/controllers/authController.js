const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password, address } = req.body;

  if (!name || !email || !password || !address)
    return res.status(400).json({ message: 'All fields required' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, email, hashedPassword, address, 'user'], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json({ message: 'User registered successfully' });
  });
};



exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Checking user...");
    
    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    console.log("DB result:", results);

    const user = results[0];
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Incorrect password' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log("Login success, sending token");

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: err.message });
  }
};


