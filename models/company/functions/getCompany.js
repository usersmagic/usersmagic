module.exports = company => {
  return {
    _id: company._id,
    email: company.email,
    profile_photo: company.profile_photo
  };
}
