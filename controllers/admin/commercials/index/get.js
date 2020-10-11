const Commercial = require('../../../../models/commercial/Commercial');

module.exports = (req, res) => {
  Commercial.find({}, (err, commercials) => {
    if (err) return res.redirect('/admin');

    return res.render('admin/commercials', {
      page: 'admin/commercials',
      title: 'Reklamlar',
      includes: {
        external: ['css', 'js', 'admin_general_css', 'fontawesome']
      },
      commercials
    });
  });
}
