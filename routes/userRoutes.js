const express= require('express');
const router=  express.Router();
const userController =require('../controllers/userController');
const bookController =require('../controllers/bookController');

// Define the user routes
router.post('/register', userController.registerUser);
router.get('/login', userController.loginUser);
router.put('/update/:id',userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);

//define the book routes
router.post('/books', bookController.createBook);
router.put('/books/:id', bookController.updateBook);
router.delete('/books/:id', bookController.deleteBook);
router.get('/books/:isbn', bookController.getBookByIsbn);
//example of search route localhost:3000/books/search?title=bookTitle&author=authorName
router.get('/books/:title', bookController.getBookByTitle);

router.get('/books/search', bookController.searchBooks);

module.exports  =router;