module.exports = (req, res) => {
  return res.render('tester/index', {
    page: 'tester/index',
    title: res.__('Para Kazanmanın En Kolay Yolu'),
    includes: {
      external: ['js', 'css', 'fontawesome']
    },
    current_language: req.query.lang ? req.query.lang.toUpperCase() : req.headers["accept-language"].split('-')[0].toUpperCase(),
    language_key: req.query.lang ? req.query.lang : null,
  });
}
