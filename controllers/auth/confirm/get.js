// Get /confirm page. If there is a code on query, confirm the account. Otherwise send a register mail to user mail and serve the /confirm pug file

const User = require('../../../models/user/User');

const sendMail = require('../../../utils/sendMail');

module.exports = (req, res) => {
  User.confirmUser(req.query.code, err => {
    if (!err) // The user is succesfully confirmed
      return res.redirect('/campaigns');

    const user = req.session.user;

    if (user.confirmed)
      return res.redirect('/campaigns');

    User.getConfirmCodeOfUser(user._id, (err, code) => {
      if (err) return res.redirect('/');

      sendMail({
        email_list: [user.email],
        subject: res.__('Welcome to Usersmagic!'),
        title: res.__('Welcome to Usersmagic!'),
        text: res.__('We\'re excited to have you get started. Please confirm your email address before you start earning with Usersmagic!'),
        button: res.__('CONFIRM EMAIL'),
        url: `https://usersmagic.com/auth/confirm?code=${code}`
      }, 'title_text_button_template', err => {
        if (err) return res.redirect('/');

        return res.render('auth/confirm', {
          page: 'auth/confirm',
          title: res.__('Confirm Your Email'),
          includes: {
            external: {
              css: ['page', 'general', 'inputs', 'buttons', 'auth', 'fontawesome'],
              js: ['page']
            }
          },
          user: req.session.user,
          language_key: req.query.lang ? req.query.lang : null
        });
      });
    });
  });
}
