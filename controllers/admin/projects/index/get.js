const async = require('async');
const mongoose = require('mongoose');

const Target = require('../../../../models/target/Target');

module.exports = (req, res) => {
  Target.findByFields({
    status: 'approved'
  }, { get_company_details: true }, (err, targets) => {
    if (err) return res.redirect('/admin');

    return res.render('admin/projects', {
      page: 'admin/projects',
      title: 'Özel Kampanyalar',
      includes: {
        external: ['css', 'admin_general_css', 'fontawesome']
      },
      campaigns: targets.map(target => {

        return {
          _id: target._id.toString(),
          name: 'Target Name',
          project_id: target.project_id
        }
      })
    });
  });
}
