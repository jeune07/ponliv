const connectToDb = require('../db'); // your custom MongoDB connection
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const { roleSchemas } = require('../schemas/userSchema1'); // your zod schemas by role

// Insert new user
const createUser = async (userData) => {
  const db = await connectToDb();
  const users = db.collection('users');

  const { role } = userData;

  if (!roleSchemas[role]) {
    throw new Error('Invalid user role');
  }

  // Validate with Zod
  const validated = roleSchemas[role].parse(userData);

  // Check for existing email
  const existing = await users.findOne({ email: validated.email });
  if (existing) {
    throw new Error('Email already registered');
  }

  // Hash password
  validated.password = await bcrypt.hash(validated.password, 10);
  validated.status = 'active';
  validated.createdAt = new Date();

  const result = await users.insertOne(validated);
  return { _id: result.insertedId, ...validated, password: undefined };
};

// Find user by email (for login)
const findUserByEmail = async (email) => {
  const db = await connectToDb();
  return await db.collection('users').findOne({ email });
};

// Get user by ID (sanitize output)
const getUserById = async (id) => {
  const db = await connectToDb();
  return await db.collection('users').findOne(
    { _id: new ObjectId(id) },
    { projection: { password: 0 } }
  );
};

// Update user
const updateUser = async (id, updateData) => {
  const db = await connectToDb();

  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  const result = await db.collection('users').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: 'after' }
  );

  return result.value;
};

// Delete user
const deleteUser = async (id) => {
  const db = await connectToDb();
  await db.collection('users').deleteOne({ _id: new ObjectId(id) });
};

module.exports = {
  createUser,
  findUserByEmail,
  getUserById,
  updateUser,
  deleteUser,
};
