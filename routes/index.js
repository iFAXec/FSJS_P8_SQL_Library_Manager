var express = require('express');
var router = express.Router();
const { Book } = require("../models");


/* handler function to wrap each route */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);

    } catch (err) {
      res.render("error", { error: err })
    }
  }
}



/* GET home page. */
router.get('/', asyncHandler(async function (req, res, next) {
  const books = await Book.findAll();
  // res.json(books);
  res.render("index", { books: books, title: "Books" })
}));


/* GET  - Shows the full list of books */
router.get("/books", asyncHandler(async (req, res) => {
  const books = await Book.findAll({ order: [["id", "DESC"]] })
  res.render("index", { books: books, title: "Books" });
}))



/* GET - Show the create new book form  */
router.get("/books/new", asyncHandler(async (req, res) => {
  const book = await Book.create(req.body)
  res.render();

}))

/* POST- New book to the database */
router.post("/books/new", asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);
  // console.log(req.body);
  res.redirect("/new-book/")
}))

/*GET - Shows book detail form */
router.get("/books/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.parms.id)
  res.render("books/show", { book: book, title: "New Book" })

}))

/*POST - Update book info in the database */
router.post("/books/:id", asyncHandler(async (req, res) => {

}))

/*POST - Deletes a book */
router.post("/books/:id/delete", asyncHandler(async (req, res) => {

}))

module.exports = router;
