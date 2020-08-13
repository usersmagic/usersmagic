module.exports = user => {
  return {
    _id: user._id,
    email: user.email,
    completed: user.completed,
    name: user.name,
    phone: user.phone,
    gender: user.gender,
    birth_year: user.birth_year,
    payment_number: user.payment_number,
    credit: user.credit,
    waiting_credit: user.waiting_credit,
    overall_credit: user.overall_credit
  }
}
