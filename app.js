const express = require('express');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');  
const i18n = require('i18n');

const MongoStore = require('connect-mongo')(session);

const app = express();
const server = http.createServer(app);

i18n.configure({
  locales:['tr', 'en', 'de', 'es', 'fr'],
  directory: __dirname + '/translations',
  queryParameter: 'lang',
  defaultLocale: 'en'
});

dotenv.config({ path: path.join(__dirname, ".env") });

const PORT = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/usersmagic";

const indexRouteController = require('./routes/indexRoute');
const adminRouteController = require('./routes/adminRoute');
const authRouteController = require('./routes/authRoute');
const campaignsRouteController = require('./routes/campaignsRoute');
const profileRouteController = require('./routes/profileRoute');
const testRouteController = require('./routes/testRoute');
const historyRouteController = require('./routes/historyRoute');
const brandRouteController = require('./routes/brandRoute');
const agreementRouteController = require('./routes/agreementRoute');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

mongoose.connect(mongoUri, { useNewUrlParser: true, auto_reconnect: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

app.use(express.static(path.join(__dirname, "public")));

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const sessionOptions = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
    maxAge: 60000
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
});

app.use(sessionOptions);
app.use(cookieParser());

app.use(i18n.init);

app.use('/', indexRouteController);
app.use('/admin', adminRouteController);
app.use('/auth', authRouteController);
app.use('/campaigns', campaignsRouteController);
app.use('/profile', profileRouteController);
app.use('/test', testRouteController);
app.use('/history', historyRouteController);
// app.use('/brand', brandRouteController);
app.use('/agreement', agreementRouteController);

server.listen(PORT, () => {
  console.log(`Server is on port ${PORT}`);
});

