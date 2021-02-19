// Get /test/custom route. If there is no link_id on session showing the Submition it creates one

const Project = require('../../../../models/project/Project');
const Submition = require('../../../../models/submition/Submition');

module.exports = (req, res) => {
  if (req.session.custom_submition) {
    Project.getSubmitionByIdOfCustomURL(req.session.custom_submition, req.query.id, (err, data) => {
      if (err) { // If error with old saved data, delete the submition, destroy the saved data and redirect to same route
        Submition.deleteSubmitionById(req.session.custom_submition, () => {
          req.session.destroy();
          return res.redirect(`/test/custom?id=${req.query.id}`);
        });
      } else {
        return res.render('test/custom', {
          page: 'test/custom',
          title: data.campaign.name,
          includes: {
            external: {
              css: ['page', 'general', 'fontawesome', 'buttons', 'inputs', 'confirm'],
              js: ['page', 'serverRequest', 'confirm']
            }
          }, 
          campaign: data.campaign,
          questions: data.questions,
          submition: data.submition
        });
      }
    });
  } else {
    Project.joinProjectFromCustomURL(req.query.id, (err, id) => {
      if (err) return res.redirect('/');

      req.session.custom_submition = id;

      Project.getSubmitionByIdOfCustomURL(req.session.custom_submition, req.query.id, (err, data) => {
        if (err) { // If error with old saved data, delete the submition, destroy the saved data and redirect to same route
          Submition.deleteSubmitionById(req.session.custom_submition, () => {
            req.session.destroy();
            return res.redirect(`/test/custom?id=${req.query.id}`);
          });
        } else {
          return res.render('test/custom', {
            page: 'test/custom',
            title: data.campaign.name,
            includes: {
              external: {
                css: ['page', 'general', 'fontawesome', 'buttons', 'inputs', 'confirm'],
                js: ['page', 'serverRequest', 'confirm']
              }
            }, 
            campaign: data.campaign,
            questions: data.questions,
            submition: data.submition
          });
        }
      });
    })
  }
}
