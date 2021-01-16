const async = require('async');
const mongoose = require('mongoose');

const Submition = require('../../../../../models/submition/Submition');
const Project = require('../../../../../models/project/Project');

module.exports = (req, res) => {
  Submition.getSubmitionsByProjectId(req.query, (err, submitions) => {
    if (err) return res.redirect('/admin');

    Project.findOneByFields({ _id: req.query.id }, {}, (err, project) => {
      if (err) return res.redirect('/admin');

      return res.render('admin/projects/submitions', {
        page: 'admin/projects/submitions',
        title: project.name,
        includes: {
          external: ['css', 'admin_general_css', 'fontawesome']
        },
        campaign: project,
        questions: project.questions.map(question => question.text),
        submitions,
      });
    });
  });
}
