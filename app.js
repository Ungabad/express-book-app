const express = require("express");
const path = require("path");
let books = require("./book-data").books;
const methodOverride = require("method-override");
const Book = require("./models/Books");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_DB_API_KEY}@cluster0.zt5pw.mongodb.net/`
);
// Set the view engine to pug
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Define routes here
// This section handles the main pages
app.get("/", async function (req, res) {
  const books = await Book.find();
  res.render("books", { books });
});

// This section handles the Add Book button
app.post("/", async function (req, res) {
  await Book.create(req.body);
  res.redirect("/");
});

// This section handles the Delete button
app.delete("/:id", async function (req, res) {
  await Book.deleteOne({ isbn: req.params.id });
  res.redirect("/");
});

// This Section handles the New Book
app.get("/new", function (req, res) {
  res.render("new-book");
});

// This section handles the Book Details
app.get("/book-details/:id", async function (req, res) {
  const isbn = req.params.id;
  const book = await Book.findOne({ isbn: isbn }); // Assuming isbn is unique, use findOne instead of find
  if (book) {
    res.render("book-details", { book });
  } else {
    res.status(404).send("Book not found");
  }
});

// This section handles the Update Book button
app.put("/:id", async function (req, res) {
  const isbn = req.params.id;
  await Book.findOneAndUpdate({ isbn: isbn }, req.body);
  res.redirect("/");
});

// This section handles book editing
app.get("/edit/:id", async function (req, res) {
  try {
    const isbn = req.params.id;
    const book = await Book.findOne({ isbn: isbn });

    if (book) {
      res.render("edit-book", { book });
    } else {
      res.status(404).send("Book not found");
    }
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send("Server error");
  }
});

// Start the server
app.listen(3000, () => console.log("Server running on port 3000"));
