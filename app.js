import express from 'express';
import morgan from 'morgan'
import bodyParser from 'body-parser';
import DropRouter from './routes/drop';
import UserRouter from './routes/user';

const app = express();

// middleware para log.
app.use(morgan('dev'));

// middleware for data in post forms. 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// setup cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
  }
  next();
});

// Rotas da api.
app.use('/drop', DropRouter);
app.use('/usuario', UserRouter);

// middleware para erros.
app.use((req, res, next) => {
  const error = new Error('Not Found!');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: error.message
  })
});

export default app;