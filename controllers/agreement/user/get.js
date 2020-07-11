module.exports = (req, res) => {
  return res.render('agreement/user', {
    page: 'agreement/user',
    title: res.__('Gizlilik Sözleşmesi'),
    includes: {
      external: ['css']
    }
  });
}
