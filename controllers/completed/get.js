// Get /completed

module.exports = (req, res) => {
  return res.render('completed/index', {
    page: 'completed/index',
    title: res.__('The Best Way of Testing'),
    includes: {
      external: {
        css: ['page', 'fontawesome', 'general', 'buttons']
      }
    }
  });
}
