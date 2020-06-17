module.exports = (req, res) => {
  return res.render('index/index', {
    page: 'index/index',
    title: res.__('Hedef Kitlene Test Ettirmenin En Kolay Yolu'),
    includes: {
      external: ['js', 'css', 'fontawesome']
    },
    current_language: req.query.lang ? req.query.lang.toUpperCase() : 'EN'
  });
}
