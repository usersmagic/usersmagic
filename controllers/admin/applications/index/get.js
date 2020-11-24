const Application = require('../../../../models/application/Application');

module.exports = (req, res) => {
  Application
    .find({})
    .limit(200)
    .then(applications => {
      return res.render('admin/applications', {
        page: 'admin/applications',
        title: 'Başvurular',
        includes: {
          external: ['css', 'admin_general_css', 'fontawesome']
        },
        applications
      });
    })
    .catch(err => {
      return res.redirect('/admin');
    })
}
