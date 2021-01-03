// Returns the mongodb search query version of the given array

const async = require('async');

const getFilter = filter => {
  // Takes an object, returns its mongodb search query version recursively
  const key = Object.keys(filter)[0];
  const value = Object.values(filter)[0];

  if (key == 'and' || key == 'or') {
    async.timesSeries(
      value.length,
      (time, next) => next(getFilter(value[time])),
      filters => {
        return {
          [`$${key}`]: filters
        }
      }
    );
  } else {
    if (key == 'eq' || key == 'gt' || key == 'gte' || key == 'in' || key == 'lt' || key == 'lte' || key == 'ne' || key == 'nin' || key == 'not')
      return {
        [`$${key}`]: value
      }
    return {
      [key]: value
    }
  }
}

module.exports = (filters, callback) => {
  if (!filters || !Array.isArray(filters))
    return callback('bad_request');

  return callback(null, getFilter({
    '$and': filters
  }));
}
