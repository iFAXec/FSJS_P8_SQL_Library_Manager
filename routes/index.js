var express = require('express');
var router = express.Router();
const { Book } = require("../models")


/* GET home page. */
router.get('/', async function (req, res, next) {

  const books = await Book.findAll();
  // console.log('books :', books);
  res.json(books);

  // res.render('index', { title: 'Express' });
});


/* GET  - Shows the full list of books */
router.get("/books", async (req, res) => {

})

/* GET - Show the create new book form  */
router.get("/books/new", async (req, res) => {

})

/* POST- New book to the database */
router.post("/books/new", async (req, res) => {

})

/*GET - Shows book detail form */
router.get("books/:id", async (req, res) => {

})

/*POST - Update book info in the database */
router.post("books/:id", async (req, res) => {

})

/*POST - Deletes a book */
router.post("/books/:id/delete", async (req, res) => {

})

module.exports = router;
