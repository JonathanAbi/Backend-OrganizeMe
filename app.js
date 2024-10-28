const express = require('express');
const app = express();
const port = 3000;
const logger = require('morgan');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const db = require('./app/db')

const handleErrorMiddleware = require('./app/middleware/handleError')
const userRouter = require('./app/api/auth/router')

app.use(cors()) //pastiin diatas router

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/', userRouter)

app.use(handleErrorMiddleware) //error dithrow ke handlerError lalu dihandle oleh middleware ini

app.use('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});
