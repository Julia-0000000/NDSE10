const express = require('express');
const router = express.Router();

const { Book } = require('../models');
const fileMiddleware = require('../middleware/file');

const store = {
  books: [],
};
const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'text/plain'].join(', ');

router.get('/', (req, res) => {
  const { books } = store;

  res.render('book/index', {
    title: 'Books',
    books,
  });
});

router.get('/create', (req, res) => {
  res.render('book/create', {
      title: 'Book | create',
      book: {},
      allowedTypes,
  });
});

router.post('/create', fileMiddleware.single('fileBook'), (req, res) => {
  const { books } = store;
  const { title, description, authors, favorite, fileCover } = req.body;
  const book = new Book({
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName: req.file ? req.file.filename : '',
    fileBook: req.file ? req.file.path : '',
  });

  books.push(book);

  res.redirect('/books');
});

router.get('/update/:id', (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const book = books.find(b => b.id === id);

  if (book) {
    res.render('book/update', {
      title: 'Book | update',
      book,
      allowedTypes,
    });
  } else {
    res.status(404);
    res.redirect('/404');
  }
});

router.post('/update/:id', fileMiddleware.single('fileBook'), (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const { title, description, authors, favorite, fileCover } = req.body;
  const bookIndex = books.findIndex(b => b.id === id);

  if (bookIndex > -1) {
    books[bookIndex] = {
      ...books[bookIndex],
      title: title === undefined ? books[bookIndex].title : title,
      description: description === undefined ? books[bookIndex].description : description,
      authors: authors === undefined ? books[bookIndex].authors : authors,
      favorite: favorite === undefined ? books[bookIndex].favorite : favorite,
      fileCover: fileCover === undefined ? books[bookIndex].fileCover : fileCover,
      fileName: req.file ? req.filename : books[bookIndex].fileName,
      fileBook: req.file ? req.file.path : books[bookIndex].fileBook,
    };
    res.redirect('/books');
  } else {
    res.status(404);
    res.redirect('/404');
  }
});

router.post('/delete/:id', (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const bookIndex = books.findIndex(b => b.id === id);

  if (bookIndex > -1) {
    books.splice(bookIndex, 1);
    res.redirect('/books');
  } else {
    res.status(404);
    res.redirect('/404');
  }
});

router.get('/:id', (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const book = books.find(b => b.id === id);

  if (book) {
    res.render('book/view', {
      title: 'book | view',
      book,
    });
  } else {
    res.status(404);
    res.redirect('/404');
  }
});

router.get('/:id/download', (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const book = books.find(b => b.id === id);

  if (book) {
    if (book.fileBook) {
      const filename = book.fileName.split('.');
      const fileExt = filename[filename.length - 1];
      res.download(`${__dirname}/../../${book.fileBook}`, `${book.title || 'book'}.${fileExt}`, err => {
        if (err) {
          res.status(404).json();
        }
      });
    } else {
      res.status(404);
      res.redirect('/404');
    }
  } else {
    res.status(404);
    res.redirect('/404');
  }
});

module.exports = router;