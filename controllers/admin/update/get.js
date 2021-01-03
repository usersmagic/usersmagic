const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../../models/campaign/Campaign');
const PrivateCampaign = require('../../../models/private_campaign/PrivateCampaign');
const Submition = require('../../../models/submition/Submition');
const Test = require('../../../models/test/Test');
const User = require('../../../models/user/User');
const Question = require('../../../models/question/Question');

const sendMail = require('../../../utils/sendMail');

module.exports = (req, res) => {
  // if (!req.query || !req.query.updates || req.query.updates != "save")
  //   return res.redirect('/admin');

  // Question.find({
  // }, (err, questions) => {
  //   if (err) return res.redirect('/admin');

  //   return res.status(200).json({questions});
  // });

  // let data = "";

  // data += 'Ad Soyad,' + 'Cinsiyet,' + 'Doğum Yılı,' + 'Şehir,' + 'İlçe,' +
  //   'Sosyal medyada günlük ortalama kaç saat geçiriyorsun?,' +
  //   'Onsuz yapamam dediğin 3 internet platformunu seç,' +
  //   'En çok hangi sosyal medya platformlarında zamanını geçiriyorsun?,' +
  //   'Sosyal medyada sık karşılaştığın markalardan alışveriş yapma ihtimalin artıyor mu?,' +
  //   'Aşağıdaki platformlardan hangilerini biliyorsun?,' +
  //   'Aşağıdaki platformlardan hangilerine abonesin?,' +
  //   'Yeni yılda aşağıdaki platformlardan hangilerine üye olmak istiyorsun?,' +
  //   '2020 boyunca aşağıdaki online market hizmetlerinden hangilerini kullandın?,' +
  //   'Aşağıdaki seçeneklerden online market hizmetlerini kullanma sebeplerini seç:,' +
  //   'Aşağıdaki faktörlerden hangileri seni bir markaya daha sadık yapıyor? (2 tanesini seç),' +
  //   'Bir ürünü satın almadan önce çeşitli platformlarda o ürün hakkında başkalarının görüşlerini araştırıyor musun?,' +
  //   'Markalar senin ilgini daha kolay çekebilmek için özellikle ne yapmalı? (3 tanesini seç),' + 
  //   'Alışverişlerini en çok etkileyen 3 reklam tipi hangisi? (3 tanesini seç),' +
  //   'Aşağıdaki kategorilerden hangilerinde kendi paranı harcıyorsun?,' +
  //   'Aşağıdaki kategorilerden hangilerinde ailenin harcamaları üzerinde önemli bir etkin var?,' +
  //   'Kendin için harcadığın parayı nasıl kazanıyorsun?,' +
  //   '2021 yılından beklentilerini 3 kelime ile anlat. \n';

    
  // Submition.find({
  //   "campaign_id": ["5fea006a7c4d8464ff527400", "5fea01f9a4dc2765861eae9d", "5fea032c1a4a9065da2ee8e1", "5fea034ba250db65e6538c52",
  //   "5fea0378ef543265f21ec87e" , "5fea037f41fe1665f8e96042" , "5fea03853611266606a771ac", "5fea038b0c1bef6614e87822"],
  //   "status": "approved"
  // }, (err, submitions) => {
  //   if (err) return res.json({ error: err });

  //   async.times(
  //     submitions.length,
  //     (time, next) => {
  //       let eachInfo = '';

  //       User.findById(mongoose.Types.ObjectId(submitions[time].user_id), (err, user) => {
  //         if (err || !user) return next(err || !user);

  //         eachInfo += (user.name + ',');
  //         eachInfo += (user.gender + ',');
  //         eachInfo += (user.birth_year + ',');
  //         eachInfo += (user.city + ',');
  //         eachInfo += (user.town + ',');

  //         Object.values(submitions[time].answers).forEach((each, i) => {
  //           if (i != 16)
  //             eachInfo += (Array.isArray(each) ? each.join(' / ') : each.split('\n').join(''));
  //           if (i != 16 && i != 17)
  //             eachInfo += ','
  //         });

  //         eachInfo += '\n';

  //         return next(null, eachInfo);
  //       });
  //     },
  //     (err, info) => {
  //       if (err) return res.json({ err });

  //       data += info;

  //       return res.status(200).csv([[data]]);
  //     }
  //   )
  // });
}
