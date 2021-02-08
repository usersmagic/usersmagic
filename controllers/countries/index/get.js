// Get list of all countries in the Country model
// XMLHTTP Request

const Country = require('../../../models/country/Country');

module.exports = (req, res) => {
  Country.getCountries((err, countries) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true, countries }));
    return res.end();
  });
}
