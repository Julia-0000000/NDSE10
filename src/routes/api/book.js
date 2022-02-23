const express = require('express');
const router = express.Router();

const Book = require('../../models/Book');
const fileMiddleware = require('../../middleware/file');

router.get('/', async (req, res) => {
  try {
    const books = await Book.find();

    res.json(books);
  } catch (e) {
    console.error(e);
    res.status(404);
    res.json({ message: 'Book is not found' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  let book;

  try {
    book = await Book.findById(id);

    res.json(book);
  } catch (e) {
    console.error(e);
    res.status(404).json({ message: 'Book is not found' });
  }
});

router.post('/', fileMiddleware.single('fileBook'), async (req, res) => {
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

  try {
    await book.save();
    res.status(201).json(book);
  } catch (e) {
    console.error(e);
    res.status(502).json({ message: 'Book is not created' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, authors, favorite, fileCover, fileName } = req.body;

  try {
    const book = await Book.findByIdAndUpdate(id, { title, description, authors, favorite, fileCover, fileName});
    res.json(book);
  } catch (e) {
    console.error(e);
    res.status(502).json({ message: 'Book is not updated' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Book.deleteOne({ _id: id });
    res.json(true);
  } catch (e) {
    console.error(e);
    res.status(502).json({ message: 'Book is not deleted' });
  }
});

router.get('/:id/download', async (req, res) => {
  const { id } = req.params;
  let book;

  try {
    book = await Book.findById(id);
    if (book.fileBook) {
      const filename = book.fileName.split('.');
      const fileExt = filename[filename.length - 1];
      res.download(`${__dirname}/../../${book.fileBook}`, `${book.title || 'book'}.${fileExt}`, err => {
        if (err) {
          res.status(404).json();
        }
      });
    } else {
      res.status(404).json({ message: 'Book file is not exist' });
    }
  } catch (e) {
    console.error(e);
    res.status(404).json({ message: 'Book is not found' });
  }
});

module.exports = router;