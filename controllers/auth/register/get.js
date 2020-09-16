module.exports = (req, res) => {
  return res.redirect('/auth/user/register' + (req.query.code ? '?code=' + req.query.code : '') + (req.query.lang ? '?lang=' + req.query.lang : ''));
}
