const compression = require('compression');
const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');

dotenv.config();
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('A connection was established');
  socket.on('disconnect', () => {
    console.log('A connection was disconnected');
  });
  socket.on('client-buzz', (data) => {
    io.emit('server-buzz', data);
  });
  socket.on('client-score', (data) => {
    io.emit('server-score', data);
  });
});

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

app.use(express.static(`${__dirname}/public`));
app.use(compression());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.render('index');
});

app.get('/admin', (_req, res) => {
  res.render('admin');
});

server.listen(process.env.PORT, () => {
  console.log(`Running on port ${process.env.PORT}`);
});
