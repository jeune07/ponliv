const connectToDb = require('../db');
const { ObjectId } = require('mongodb');

exports.createBook = async (bookData) => {
  const db = await connectToDb();

  // Ensure ISBN uniqueness if provided
  if (bookData.isbn && bookData.isbn.trim() !== '') {
    const existingBook = await db.collection('books').findOne({ isbn: bookData.isbn });
    if (existingBook) {
      throw new Error('A book with this ISBN already exists.');
    }
  }

  // Insert book
  const result = await db.collection('books').insertOne({
    ...bookData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  if (!result.acknowledged) {
    throw new Error('Failed to create book');
  }

  return {
    _id: result.insertedId,
    ...bookData
  };
};


exports.updateBook = async (bookData) => {
  const db = await connectToDb();

  // Validate and convert ID
  if (!bookData._id) throw new Error('Missing book ID');
  const bookId = new ObjectId(bookData._id);
  delete bookData._id; // don't update _id

  // Add updatedAt timestamp
  bookData.updatedAt = new Date();

  const result = await db.collection('books').findOneAndUpdate(
    { _id: bookId },
    { $set: bookData },
    { returnDocument: 'after' }
  );

  if (!result.value) {
    throw new Error('Book not found');
  }

  return result.value;
};

exports.deleteBook = async (bookId) => {
  const db = await connectToDb();

  const objectId = new ObjectId(bookId);
  const result = await db.collection('books').updateOne(
    { _id: objectId },
    { $set: { isDeleted: true, updatedAt: new Date() } }
  );

  if (result.modifiedCount === 0) {
    throw new Error('Book not found or already deleted');
  }

  return { message: 'Book soft deleted successfully' };
};

exports.getBookByIsbn = async (isbn) => {
  const db = await connectToDb();
  const book = await db.collection('books').findOne({
    isbn: isbn,
    isDeleted: { $ne: true }  // Exclude soft-deleted books
  });

  return book;
};

exports.getBookByTitle = async (title) => {
  const db = await connectToDb();
  const book = await db.collection('books').findOne({
    title: title,
    isDeleted: { $ne: true }  // Exclude soft-deleted books
  });

  return book;
};

exports.searchBooks = async (query) => {
  const db = await connectToDb();

  const searchRegex = new RegExp(query, 'i'); // case-insensitive match

  const books = await db.collection('books').find({
    isDeleted: { $ne: true }, // exclude soft-deleted
    $or: [
      { title: { $regex: searchRegex } },
      { isbn: { $regex: searchRegex } },
      { description: { $regex: searchRegex } }
    ]
  }).toArray();

  return books;
};

exports.searchBooks = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const results = await bookModel.searchBooks(q.trim());
    return res.status(200).json({ success: true, books: results });

  } catch (error) {
    console.error('Error in searchBooks:', error);
    return res.status(500).json({ error: error.message });
  }
};