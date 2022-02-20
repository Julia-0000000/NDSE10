# NDSE10

```db.books.insertMany([
  {
    title: "book 1",
    description: "book description 1",
    authors: "book authors 1"
  },
  {
    title: "book 2",
    description: "book description 2",
    authors: "book authors 2"
  }
])

db.books.find({
  title: {
    $regex: ".*<Текст поиска>.*",
    $options: "i"
  }
})

db.books.updateOne(
  { _id: "<ID книги>" },
  { $set: { description: "<Текст описания>", authors: "<Текст авторов>" } }
)
```