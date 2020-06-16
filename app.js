const express = require('express');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const i18n = require('i18n');

const app = express();
const server = http.createServer(app);

i18n.configure({
  locales:['tr', 'en'],
  directory: __dirname + '/translations',
  queryParameter: 'lang',
  defaultLocale: 'en'
});

dotenv.config({ path: path.join(__dirname, ".env") });

const PORT = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/usersmagic";

const indexRouteController = require('./routes/indexRoute');

const {
  SESSION_SECRET
} = process.env;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

mongoose.connect(mongoUri, { useNewUrlParser: true, auto_reconnect: true, useUnifiedTopology: true, useCreateIndex: true });

app.use(express.static(path.join(__dirname, "public")));

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const session = expressSession({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
});

app.use(session);

app.use((req, res, next) => {
  next();
});

app.use(i18n.init);

app.use('/', indexRouteController);

server.listen(PORT, () => {
  console.log(`Server is on port ${PORT}`);
});
