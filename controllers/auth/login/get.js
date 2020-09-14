module.exports = (req, res) => {
  return res.redirect('/auth/user/login' + (req.query.lang ? '?lang=' + req.query.lang : ''));
}
