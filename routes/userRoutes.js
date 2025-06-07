const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const bookController = require('../controllers/bookController');

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management
 *   - name: Books
 *     description: Book management
 *
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - author
 *         - category
 *         - publishedYear
 *         - condition
 *         - price
 *         - sellerId
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         author:
 *           type: string
 *         isbn:
 *           type: string
 *           example: "9781234567890"
 *         category:
 *           type: string
 *         publishedYear:
 *           type: integer
 *         condition:
 *           type: array
 *           items:
 *             type: string
 *         coverImage:
 *           type: string
 *         price:
 *           type: number
 *         sellerId:
 *           type: string
 *         isVerified:
 *           type: boolean
 *         isIsbnProvided:
 *           type: boolean
 *         schoolLevel:
 *           type: string
 *         officialListReference:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - address
 *         - phoneNumber
 *         - nif
 *         - role
 *         - createdAt
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         address:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         nif:
 *           type: string
 *         role:
 *           type: array
 *           items:
 *             type: string
 *         website:
 *           type: string
 *         schoolType:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', userController.registerUser);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.post('/login', userController.loginUser);

/**
 * @swagger
 * /api/update/{id}:
 *   put:
 *     summary: Update user information
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put('/update/:id', userController.updateUser);

/**
 * @swagger
 * /api/delete/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete('/delete/:id', userController.deleteUser);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Register a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: Book registered successfully
 */
router.post('/books', bookController.createBook);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Book updated successfully
 */
router.put('/books/:id', bookController.updateBook);

/**
 * @swagger
 * /api/delete/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 */
router.delete('/delete/:id', bookController.deleteBook);

/**
 * @swagger
 * /api/books/{isbn}:
 *   get:
 *     summary: Get book by ISBN
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book retrieved successfully
 */
router.get('/books/:isbn', bookController.getBookByIsbn);

/**
 * @swagger
 * /api/books/search:
 *   get:
 *     summary: Search for books
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: condition
 *         schema:
 *           type: string
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *       - in: query
 *         name: publishedYear
 *         schema:
 *           type: number
 *       - in: query
 *         name: schoolLevel
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Books retrieved successfully
 */
router.get('/books/search', bookController.searchBooks);

/**
 * @swagger
 * /api/books/title/{title}:
 *   get:
 *     summary: Get book by title
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book retrieved successfully
 */
router.get('/books/title/:title', bookController.getBookByTitle);

module.exports = router;
