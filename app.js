const cluster = require('cluster');
const express = require('express');
const favicon = require('serve-favicon');
const http = require('http');
const i18n = require('i18n');
const path = require('path');
const os = require('os');

const numCPUs = process.env.WEB_CONCURRENCY || os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++)
    cluster.fork();

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const app = express();
  const server = http.createServer(app);
  
  i18n.configure({
    locales:['en', 'tr'],
    directory: __dirname + '/translations',
    queryParameter: 'lang',
    defaultLocale: 'en'
  });

  const PORT = process.env.PORT || 3000;
  
  const indexRouteController = require('./routes/indexRoute');
  
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(i18n.init);

  app.use((req, res, next) => {
    req.query = (req.query && typeof req.query == 'object' ? req.query : {});
    next();
  });
  
  app.use('/', indexRouteController);
  
  server.listen(PORT, () => {    
    console.log(`Server is on port ${PORT} as Worker ${cluster.worker.id} running @ process ${cluster.worker.process.pid}`);
  });
}
