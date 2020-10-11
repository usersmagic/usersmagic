const Mail = require('../../../../models/mail/Mail');

module.exports = (req, res) => {
  Mail.find({}, (err, mails) => {
    if (err) return res.redirect('/admin');

    return res.render('admin/mails', {
      page: 'admin/mails',
      title: 'E-Postalar',
      includes: {
        external: ['css', 'js', 'admin_general_css', 'fontawesome']
      },
      mails
    });
  });
}
