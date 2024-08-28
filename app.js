// app.js
const express = require("express");
const bookData = require("./book-data");
const path = require("path");

const app = express();
const port = 3000;

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to get all books
app.get("/books", (req, res) => {
  console.log(bookData);
  res.json(bookData);
});

// Route to get a single book by id and display the title and author
app.get("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = bookData.books.find((b) => +b.isbn === bookId);
  console.log(book);
  if (book) {
    res.json({ title: book.title, author: book.author });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Route to delete a book by id
app.delete("/books/delete/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = bookData.books.findIndex((b) => +b.isbn === bookId);

  if (bookIndex !== -1) {
    bookData.splice(bookIndex, 1);
    res.json({ message: "Book was deleted successfully" });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Route to Update a Book by id
app.post("/books/updated/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = bookData.books.findIndex((b) => +b.isbn === bookId);
  console.log(req.body);
  if (book >= 0 && book < bookData.books.length) {
    bookData.books[book] = req.body;
  }
  res.render("index", { book: bookData.books[book] });
});

app.get("/books/edit/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = bookData.books.find((b) => +b.isbn === bookId);

  if (book) {
    res.render("index", { book });
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
