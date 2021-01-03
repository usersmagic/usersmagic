// Get campaign object for client side

module.exports = (campaign, callback) => {
  if (!campaign || !campaign._id)
    return callback('document_not_found');

  return callback(null, {
    _id: campaign._id.toString(),
    name: campaign.name,
    image: campaign.image,
    description: campaign.description,
    welcome_screen: campaign.welcome_screen ? {
      opening: campaign.welcome_screen.opening,
      details: campaign.welcome_screen.details,
      image: campaign.welcome_screen.image
    } : {},
    price: campaign.price,
    is_free: campaign.is_free,
    questions: campaign.questions
  });
}
