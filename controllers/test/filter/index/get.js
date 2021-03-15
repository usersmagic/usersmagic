// Get /test/filter

const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  User.getSubmitionCampaignAndQuestions(req.query.id, req.session.user._id, (err, data) => {
    if (err) return res.redirect('/history');

    return res.render('test/filter', {
      page: 'test/filter',
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
  })
}
