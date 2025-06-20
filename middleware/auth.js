const jwt = require('jsonwebtoken');
const connectToDb  = require('../db'); // assumes you're exporting a connected client or db

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  const db = await connectToDb (); // assumes connection already established
  const blacklisted = await db.collection('blacklist_tokens').findOne({ token });

  if (blacklisted) {
    return res.status(403).json({ error: 'Token has been revoked' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.token = token;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = auth;
