module.exports = (req, res) => {
  return res.render('test/company/index', {
    page: 'test/company/index',
    title: res.__('Yeni Kampanya Yarat'),
    includes: {
      external: ['css', 'js', 'fontawesome']
    },
    current_page: "test"
  });
}
