module.exports = (req, res) => {
  // const current_language = req.query.lang ? req.query.lang.toUpperCase() : (req.headers["accept-language"] ? req.headers["accept-language"].split('-')[0].toUpperCase() : null);

  return res.render('index/index', {
    page: 'index/index',
    title: res.__('Test Etmenin En Karlı Yolu'),
    includes: {
      external: ['css', 'js', 'fontawesome']
    },
    current_language,
    language_key: req.query.lang ? req.query.lang : null
  });
}
