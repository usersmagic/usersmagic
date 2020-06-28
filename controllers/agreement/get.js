module.exports = (req, res) => {
  return res.render('agreement/index', {
    page: 'agreement/index',
    title: res.__('Gizlilik Sözleşmesi'),
    includes: {
      external: ['css']
    },
    current_language: req.query.lang ? req.query.lang.toUpperCase() : req.headers["accept-language"].split('-')[0].toUpperCase(),
    language_key: req.query.lang ? req.query.lang : null
  });
}
