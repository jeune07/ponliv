// bookController.js
const { bookSchema } = require('../shemas/bookSchema');
const bookModel = require('../models/bookModel');

exports.createBook = async (req, res) => {
  try {
    const validBook = bookSchema.parse(req.body);
    const newBook = await bookModel.createBook(validBook);
    return res.status(201).json({ success: true, book: newBook });
  } catch (err) {
    console.error("Error in createBook:", err);
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors });
    }
    return res.status(500).json({ error: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const validBook = bookSchema.partial().parse(req.body);
    const updatedBook = await bookModel.updateBook(bookId, validBook);
    if (!updatedBook) {
      return res.status(404).json({ error: "Book not found" });
    }
    return res.status(200).json({ success: true, book: updatedBook });
  } catch (err) {
    console.error('Error in updateBook:', err);
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors });
    }
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const deletedBook = await bookModel.softDeleteBook(bookId);
    if (!deletedBook) {
      return res.status(404).json({ error: "Book not found" });
    }
    return res.status(200).json({ success: true, message: "Book deleted" });
  } catch (err) {
    console.error('Error in deleteBook:', err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getBookByIsbn = async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = await bookModel.getBookByIsbn(isbn);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    return res.status(200).json({ success: true, book });
  } catch (err) {
    console.error('Error in getBookByIsbn:', err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getBookByTitle = async (req, res) => {
  try {
    const title = req.params.title;
    const book = await bookModel.getBookByTitle(title);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    return res.status(200).json({ success: true, book });
  } catch (err) {
    console.error('Error in getBookByTitle:', err);
    return res.status(500).json({ error: err.message });
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const { q, category, condition, priceMin, priceMax, publishedYear, schoolLevel } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const filters = {
      category,
      condition,
      priceMin,
      priceMax,
      publishedYear,
      schoolLevel
    };

    const results = await bookModel.searchBooks(q.trim(), filters);
    return res.status(200).json({ success: true, books: results });

  } catch (err) {
    console.error('Error in searchBooks:', err);
    return res.status(500).json({ error: err.message });
  }
};
