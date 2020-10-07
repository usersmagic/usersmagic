const cron = require('cron');

const CronJob = cron.CronJob;

module.exports = (req, res) => {
  // const current_language = req.query.lang ? req.query.lang.toUpperCase() : (req.headers["accept-language"] ? req.headers["accept-language"].split('-')[0].toUpperCase() : null);

  // const currDate = new Date();
  // currDate.setSeconds(currDate.getSeconds() + 70)

  // const job = new CronJob(currDate, () => {
  //   console.log("70 seconds later");
  // });

  // job.start();

  return res.render('index/index', {
    page: 'index/index',
    title: res.__('Test Etmenin En Karlı Yolu'),
    includes: {
      external: ['css', 'js', 'fontawesome']
    },
    // current_language,
    language_key: req.query.lang ? req.query.lang : null
  });
}
