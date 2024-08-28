const express = require("express");
const path = require("path");
let books = require("./book-data").books;
const methodOverride = require("method-override");
const Book = require("./models/Books");
const mongoose = require("mongoose");
require("dotenv").config;

const app = express();
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_DB_API_KEY}@cluster0.zt5pw.mongodb.net/`
);
// Set the view engine to pug
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// Define routes here
app.get("/", async function (req, res) {
  const books = await Book.find();
  res.render("books", { books });
});

app.post("/", async function (req, res) {
  await Book.create(req.body);
  res.redirect("/");
});

app.delete("/:id", async function (req, res) {
  await Book.deleteOne({ isbn: req.params.id });
  res.redirect("/");
});

app.get("/new", function (req, res) {
  res.render("new-book");
});

app.get("/:id", async function (req, res) {
  const isbn = req.params.id;
  const book = await Book.find({ isbn: isbn });
  res.render("book-details", { book });
});

app.put("/:id", async function (req, res) {
  const isbn = req.params.id;
  await Book.findOneAndUpdate({ isbn: isbn }, req.body);
  res.redirect("/");
});

app.get("/edit/:id", function (req, res) {
  const isbn = req.params.id;
  const book = books.find((book) => book.isbn === isbn);
  res.render("edit-book", { book });
});

// Start the server
app.listen(3000, () => console.log("Server running on port 3000"));
