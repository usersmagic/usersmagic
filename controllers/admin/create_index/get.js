const cron = require('cron');

const Submition = require('../../../models/submition/Submition');

const sendMail = require('../../../')

const CronJob = cron.CronJob;

module.exports = (req, res) => {
  const job = new CronJob('* * 1 * * *', () => {
    Submition.collection.createIndex({
      user_id: 1,
      created_at: 1
    }, (err, result) => {
      if (err) return res.redirect('/');
  
      Submition.collection.createIndex({
        campaign_id: 1,
        status: 1,
        created_at: 1
      }, (err, result) => {
        if (err) return res.redirect('/');
    
  
        return res.redirect('/admin');
      });
    });
  });
  
}
