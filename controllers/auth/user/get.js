// Redirect to main auth route

module.exports = (req, res) => {
  return res.redirect('/auth/login');
}
