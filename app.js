var express = require('express');
var path = require('path');
const Sequelize = require('./models/index.js').sequelize;

(async () => {
  try {
    await Sequelize.sync();
    await Sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();


var indexRouter = require('./routes/index');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// 404 error handler
app.use(function (req, res, next) {
  const err = new Error();
  err.status = 404;
  err.message = "Sorry! Page Not Found!";
  res.render("page-not-found", { err })
});


// Global error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  err.status = err.status || 500;
  err.message = err.message || "Sorry! Something went wrong. Please try again later!"

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { err });
});

module.exports = app;
