// Get towns of the country with given id and city on the query
// XMLHTTP Request

const Country = require('../../../models/country/Country');

module.exports = (req, res) => {
  Country.getTowns(req.query, (err, towns) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true, towns }));
    return res.end();
  })
}
