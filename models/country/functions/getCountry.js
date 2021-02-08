// Returns the country object without the towns field

module.exports = (country, callback) =>  {
  if (!country || typeof country != 'object')
    return callback('document_not_found');

  return callback(null, {
    _id: country._id.toString(),
    name: country.name,
    alpha2_code: country.alpha2_code,
    cities: country.cities,
    phone_code: country.phone_code,
    currency: country.currency || '€'
  });
}
