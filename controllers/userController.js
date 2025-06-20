const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const connectToDb = require('../db');
const { roleSchemas } = require('../schemas/userSchemas');

exports.registerUser = async (req, res) => {
  try {
    const db = await connectToDb();
    const users = db.collection('users');

    const role = req.body.role;
    if (!role || !roleSchemas[role]) {
      return res.status(400).json({ error: 'Invalid or missing role' });
    }

    const parsed = roleSchemas[role].parse(req.body);

    const existing = await users.findOne({ email: parsed.email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(parsed.password, 10);
    parsed.password = hashed;
    parsed.status = 'active';
    parsed.createdAt = new Date();

    const result = await users.insertOne(parsed);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.insertedId,
        name: parsed.name,
        email: parsed.email,
        role: parsed.role
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const db = await connectToDb();
    const users = db.collection('users');

    const { email, password } = req.body;
    const user = await users.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      {
        id: user._id.toString(), // ✅ make sure it's a string
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 🔐 Safe to log before sending response
    console.log('🔐 Logged in user ID →', user._id.toString());

    return res.status(200).json({ token });

  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ error: 'Login failed' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const db = await connectToDb();
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.user.id) },
      { projection: { password: 0 } }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const db = await connectToDb();
    const users = db.collection('users');
    const id = new ObjectId(req.params.id);

    const user = await users.findOne({ _id: id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user._id.toString() !== req.user.id && !req.user.role.includes('admin')) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const update = { ...req.body };
    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }

    const result = await users.findOneAndUpdate(
      { _id: id },
      { $set: update },
      { returnDocument: 'after' }
    );
   
    res.status(200).json(result._id);
    
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const db = await connectToDb();
    const users = db.collection('users');
    const id = new ObjectId(req.params.id);

    const user = await users.findOne({ _id: id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user._id.toString() !== req.user.id && !req.user.role.includes('admin')) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await users.deleteOne({ _id: id });

    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    const db = await connectToDb();
    const blacklisted = db.collection('blacklistedTokens');

    const token = req.token;
    const decoded = jwt.decode(token);

    await blacklisted.insertOne({
      token,
      expiresAt: new Date(decoded.exp * 1000)
    });

    res.status(200).json({ message: 'User logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Logout failed' });
  }
};
