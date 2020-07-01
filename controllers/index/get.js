const references = {
  en: [
    {
      explanation: "Clay is a design app that tests with potential users that are female college students across the world. They continue testing with potential users from the US, the UK,  Italy, and Ukraine.",
      quote: [
        "We are testing monthly with", " usersmagic ", "after every update we launch.", " Usersmagic ", "is the path from making assumptions to making evidence-based decisions."
      ],
      person: "Paul",
      product: "Clay"
    },
    {
      explanation: "Stumarkt is an early stage startup trying to find product market fit. They are testing their product monthly with 100 people between the ages 16 and 25.",
      quote: [
        "We are testing with", " Usersmagic ", "in order to shape our product according to our target customers’ needs and feedback. We want to be user-centered, and", " Usersmagic ", "makes it possible"
      ],
      person: "Jason",
      product: "Stumarkt"
    },
    {
      explanation: "Couch 2048 is a mobile game aiming to increase retention rates. The game company adds new features, where testers try them and give feedbacks weekly.",
      quote: [
        "We are testing new features weekly and see which features bring more retention to our game.", " Usersmagic ", "allowed us to increase our day 7 retention from 14% to 51%."
      ],
      person: "Barney",
      product: "Couch 2048"
    }
  ],
  tr: [
    {
      explanation: "Clay globalde 20 farklı ülkede faaliyet gösteren bir tasarım uygulaması. Ürünlerini hedef kitlesinde olan Türkiye, Amerika, İngiltere, İtalya ve Ukrayna’daki kadın üniversite öğrencilerine  düzenli bir şekilde test ettiriyorlar.",
      quote: [
        "Her ay düzenli bir şekilde", " Usersmagic ", "ile her güncellemeyi test ediyoruz.", " Usersmagic ", "varsayımlara göre hareket etmek yerine kanıt ve veri bazlı karar almamızı sağlıyor."
      ],
      person: "Alptekin",
      product: "Clay"
    },
    {
      explanation: "Stumarkt ürün-pazar uyumu yakalamaya çalışan bir startup. Ürünlerini her ay Türkiye çapında 16-30 yaş arasındaki 100 kişi ile test ediyorlar.",
      quote: [
        "Usersmagic ", "ile çalışarak erken aşamadaki ürünümüzü hedef kitlemize göre geliştiriyoruz. Kullanıcı odaklı ilerlemek ve istenilen, kullanılan bir ürün geliştirmek ve büyütmek için", " Usersmagic ", " üzerinden düzenli testler yapıyoruz."
      ],
      person: "Yunus",
      product: "Stumarkt"
    },
    {
      explanation: "Couch 2048 kullanıcıların haftalık geri dönüş oranını arttırmaya çalışan bir mobil oyun. Haftalık yeni özellikler ekleyerek bu özellikleri test ettiriyorlar ve haftalık olarak testerlardan geri bildirim alıyorlar.",
      quote: [
        "Haftalık olarak yeni özellikleri test ediyoruz ve işe yarayan özellikleri ön plana çıkartıyoruz.", " Usersmagic ", "sayesinde 1 haftalık retention oranımızı %14 den %51'e çıkarmayı başardık."
      ],
      person: "Bahri",
      product: "Couch 2048"
    }
  ]
}

module.exports = (req, res) => {
  const current_language = req.query.lang ? req.query.lang.toUpperCase() : req.headers["accept-language"].split('-')[0].toUpperCase();

  return res.render('index/index', {
    page: 'index/index',
    title: res.__('Hedef Kitlene Test Ettirmenin En Kolay Yolu'),
    includes: {
      external: ['js', 'css', 'fontawesome']
    },
    current_language,
    language_key: req.query.lang ? req.query.lang : null,
    references: current_language == "TR" ? references.tr : references.en
  });
}
