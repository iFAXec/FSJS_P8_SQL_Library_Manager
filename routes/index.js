var express = require('express');
var router = express.Router();
const { Book } = require("../models");
const { Op } = require("sequelize");
const paginate = require("express-paginate");


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


// /* GET home page. */
// router.get("/", asyncHandler(async (req, res, next) => {
//   const { q } = req.query;
//   let search = {};
//   if (q) {
//     search = {
//       [Op.or]: [
//         { title: { [Op.like]: `%${q}%` } },
//         { author: { [Op.like]: `%${q}%` } },
//         { genre: { [Op.like]: `%${q}%` } },
//         { year: { [Op.like]: `%${q}%` } },
//       ],
//     };
//     const books = await Book.findAll({ where: search });
//     res.render("search-book", { books, search: q });
//   } else {
//     const books = await Book.findAll();
//     res.render("index", { title: "Books", books: books })
//   }
// })),


/* GET home page. */
router.get("/", asyncHandler(async (req, res, next) => {
  const { q, page = 1, limit = 10 } = req.query;


  let search = {};
  if (q) {
    search = {
      [Op.or]: [
        { title: { [Op.like]: `%${q}%` } },
        { author: { [Op.like]: `%${q}%` } },
        { genre: { [Op.like]: `%${q}%` } },
        { year: { [Op.like]: `%${q}%` } },
      ],
    };

    try {

      const offset = (page - 1) * limit;
      const books = await Book.findAll({
        where: search,
        limit,
        offset,
      })


      const count = await Book.count({
        where: search
      })

      res.render("search-book", {
        books,
        search: q,
        title: "Search List",
        currentPage: page,
        totalPages: Math.ceil(count / limit)
      });

    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving books");

    }

  } else {

    try {

      const books = await Book.findAll();
      res.render("index", { title: "Books", books: books })

    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving books")
    }
  }
})),



  /*Get - Shows the full list of books */
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
      res.render("form-error", { book: book, errors: error.errors, title: "New Book" })

    } else {
      throw error
    }
  }

}))


/*GET - Shows book detail form */
router.get("/books/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  // console.log('book :', book);
  if (book) {
    res.render("update-book", { book: book, title: "Update Book" });
  } else {
    res.sendStatus(404);
  }
}))



/*POST - Update book info in the database */
router.post("/books/:id", asyncHandler(async (req, res) => {
  let book;

  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect("/books");
    } else {
      res.sendStatus(404);
    }

  } catch (error) {

    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("form-error", { book: book, error: error.errors, title: "New Book" })
    } else {
      throw error;
    }
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