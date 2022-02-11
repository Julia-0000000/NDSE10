const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;
const API_ENDPOINT = process.env.API_ENDPOINT || '';

const loggerMiddleware = require('./middleware/logger');
const errorMiddleware = require('./middleware/error');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const bookRouter = require('./routes/book');

const app = express();

app.use(bodyParser());
app.use(loggerMiddleware);

app.use('/public', express.static(__dirname + '/public'));

app.use('/', indexRouter);
app.use(`${API_ENDPOINT}user`, userRouter);
app.use(`${API_ENDPOINT}books`, bookRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});