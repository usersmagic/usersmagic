// Get project object for client side with specified options

const moment = require('moment-timezone');

const Company = require('../../company/Company');

module.exports = (project, options, callback) => {
  if (!project || !project._id)
    return callback('document_not_found');

  let timezone;

  if (options && options.timezone) {
    if (!moment.tz.zone(options.timezone))
      return callback('bad_request');

    timezone = options.timezone;
  }

  if (options && options.get_company_details) {
    Company.findCompanyById(project.creator, (err, company) => {
      if (err || !company) return callback('company_not_found');

      return callback(null, {
        _id: project._id.toString(),
        type: project.type,
        status: project.status,
        country: project.country,
        created_at: timezone ? moment(project.created_at).tz(timezone).format('DD[.]MM[.]YYYY[, ]HH[:]mm') : project.created_at,
        name: project.name,
        description: project.description,
        image: project.image || '/res/images/default/project.png',
        questions: project.questions,
        welcome_screen: project.welcome_screen ? {
          opening: project.welcome_screen.opening,
          details: project.welcome_screen.details,
          image: project.welcome_screen.image
        } : {},
        company
      });
    });
  } else {
    return callback(null, {
      _id: project._id.toString(),
      type: project.type,
      status: project.status,
      country: project.country,
      created_at: timezone ? moment(project.created_at).tz(timezone).format('DD[.]MM[.]YYYY[, ]HH[:]mm') : project.created_at,
      name: project.name,
      description: project.description,
      image: project.image || '/res/images/default/project.png', 
      questions: project.questions,
      welcome_screen: project.welcome_screen ? {
        opening: project.welcome_screen.opening,
        details: project.welcome_screen.details,
        image: project.welcome_screen.image
      } : {}
    });
  }
}
