const express = require("express");
const path = require("path");
const app = express();
let books = require("./book-data").books;
const methodOverride = require("method-override");

// Set the view engine to pug
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// Define routes here
app.get("/", function (req, res) {
  res.render("books", { books });
});

app.post("/", function (req, res) {
  books.push(req.body);
  res.redirect("/");
});

app.delete("/:id", function (req, res) {
  const filteredList = books.filter((book) => book.isbn !== req.params.id);
  books = filteredList;
  res.redirect("/");
});

app.get("/new", function (req, res) {
  res.render("new-book");
});

app.get("/:id", function (req, res) {
  const isbn = req.params.id;
  const book = books.find((book) => book.isbn === isbn);
  res.render("book-details", { book });
});

app.put("/:id", function (req, res) {
  const isbn = req.params.id;
  const bookIndex = books.findIndex((book) => book.isbn === isbn);
  book = req.body;
  books[bookIndex] = req.body;
  res.redirect("/");
});

app.get("/edit/:id", function (req, res) {
  const isbn = req.params.id;
  const book = books.find((book) => book.isbn === isbn);
  res.render("edit-book", { book });
});

// Start the server
app.listen(3000, () => console.log("Server running on port 3000"));
