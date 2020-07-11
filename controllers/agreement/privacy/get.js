module.exports = (req, res) => {
  return res.render('agreement/privacy', {
    page: 'agreement/privacy',
    title: res.__('Gizlilik Sözleşmesi'),
    includes: {
      external: ['css']
    }
  });
}
