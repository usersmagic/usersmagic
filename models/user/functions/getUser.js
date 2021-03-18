module.exports = (user, callback) => {
  if (!user || !user._id)
    return callback('document_not_found');


  return callback(null, {
    _id: user._id.toString(),
    agreement_approved: user.agreement_approved,
    email: user.email,
    completed: user.completed,
    confirmed: user.confirmed,
    name: user.name,
    phone: user.phone,
    gender: user.gender,
    birth_year: user.birth_year,
    city: user.city,
    town: user.town,
    payment_number: user.payment_number,
    credit: user.credit,
    waiting_credit: user.waiting_credit,
    overall_credit: user.overall_credit,
    country: user.country,
    on_waitlist: user.on_waitlist
  });
}
