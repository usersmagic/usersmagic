module.exports = (req, res) => {
  const current_language = req.query.lang ? req.query.lang.toUpperCase() : req.headers["accept-language"].split('-')[0].toUpperCase();

  return res.render('index/index', {
    page: 'index/index',
    title: 'Test et ve Para Kazan',
    includes: {
      external: ['css', 'fontawesome']
    },
    current_language,
    language_key: req.query.lang ? req.query.lang : null
  });
}
