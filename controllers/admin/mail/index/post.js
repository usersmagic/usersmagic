const Mail = require('../../../../models/mail/Mail');

module.exports = (req, res) => {
  if (!req.body || !req.body.option_name || !req.body.limit || !req.body.filter_string)
    return res.redirect('/admin');

  const newMailData = {
    option_name: req.body.option_name,
    limit: req.body.limit,
    filter_string: req.body.filter_string
  };

  newMail = new Mail(newMailData);

  newMail.save(err => {
    if (err) return res.redirect('/admin');

    return res.redirect('/admin/mails');
  })
}
