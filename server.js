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

app.get('/', (req, res) => {
  res.render('index', { room: makeid(4) });
});

app.get('/:room', (req, res) => {
  res.render('client', { room: req.params.room });
});

app.post('/:room', (req, res) => {
  res.render('host', { room: req.params.room });
});

server.listen(process.env.PORT, () => {
  console.log(`Running on port ${process.env.PORT}`);
});

const makeid = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};