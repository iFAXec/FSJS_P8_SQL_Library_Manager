var express = require('express');
var router = express.Router();
const { Book } = require("../models");
const { Op } = require("sequelize");


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
  // console.log('books :', books);
  // res.json(books);
  res.render("index", { title: "Books", books: books })
}));

router.get("/", asyncHandler(async (req, res, next) => {
  const { q } = req.query;
  let search = {};
  if (q) {
    search = {
      [Op.or]: [
        { title: { [Op.iLike]: `%${q}%` } },
        { author: { [Op.iLike]: `%${q}%` } },
        { genre: { [Op.iLike]: `%${q}%` } },
        { year: { [Op.iLike]: `%${q}%` } },
      ],
    };
    const books = await Book.findAll({ where: search });
    res.render("index", { books, search: q });
  }
})),



  router.get("/books", asyncHandler(async (req, res) => {
    const books = await Book.findAll({ order: [["id", "DESC"]] })
    res.render("index", { title: "Books", books: books, });
  }))


/* GET - Show the create new book form  */
router.get("/books/new", asyncHandler(async (req, res) => {
  res.render("new-book");
}))


/* POST- New book to the database */
router.post("/books/new", asyncHandler(async (req, res) => {
  let book;

  try {

    book = await Book.create(req.body);
    res.redirect("/");

  } catch (error) {

    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("form-error", { book: book, errors: error.error, title: "New Book" })

    } else {
      throw error
    }
  }

}))


/*GET - Shows book detail form */
router.get("/books/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  console.log('book :', book);

  if (book) {
    res.render("update-book", { book: book, title: "Update Book" });
  } else {
    res.sendStatus(404);
  }
}))



/*POST - Update book info in the database */
router.post("/books/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);

  if (book) {
    await book.update(req.body);
    res.render("update-book" + book.id);
  } else {
    res.sendStatus(404);
  }
}))


/*POST - Deletes a book */
router.post("/books/:id/delete", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);

  if (book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    res.sendStatus(404);
  }

}))

module.exports = router;