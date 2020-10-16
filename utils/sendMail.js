const nodemailer = require('nodemailer');
const path = require('path');
const dotenv = require('dotenv');

const htmlToText = require('nodemailer-html-to-text').htmlToText;

dotenv.config({ path: path.join(__dirname, ".env") });

const {
  MAIL_USER_NAME,
  MAIL_PASSWORD
} = process.env;

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: MAIL_USER_NAME, 
    pass: MAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});
transporter.use('compile', htmlToText());

const templates = {
  completeCampaign: (data) => ({
    bcc: data.emailList,
    subject: 'Seni Bekleyen Yeni Kampanyalar Var',
    html: `
    <div style="width: 100%;" >
      <div style="
        width: 100%;
        background-color: rgb(254, 254, 254);
        overflow-x: scroll;
      " >
        <div style="
          width: 400px;
          min-width: 400px;
          background-color: rgb(254, 254, 254);
          display: inline-block;
          text-align: center;
        " >
          <div style="
            height: fit-content;
            width: 100%;
            display: inline-block;
            text-align: center;
          " >
            <img src="https://usersmagic.com/res/images/mail_top_image.png" style="width: 400px; margin-bottom: 20px;">
            <span style="
              color: rgb(12, 16, 20);
              font-weight: 700;
              font-size: 225%;
              text-align: center;
              font-family: Arial;
              display: inline-block;
              margin: 0px 20px;
            " >
              Seni bekleyen yeni bir anket var!
            </span>
            <div style="margin: auto; margin-top: 20px; width: 120px; height: 30px; display: inline-block; text-align: center;" >
              <img  src="https://usersmagic.com/res/images/logo_black.png" style="height: 30px;">
            </div>
            <span style="font-family: Arial; color: rgb(30, 30, 30); font-weight: 600; font-size: 200%; width: 100%; display: inline-block; text-align: center; margin-top: 50px;" >Spor</span>
            <span style="margin: auto; width: 100%; display: inline-block; text-align: center; margin-top: 30px; margin-bottom: 30px;" >
              <img style="justify-self: center;" src="https://usersmagic.com/res/images/sport_balls.png">
            </span>
            <span style="margin: 0px 20px; font-family: Arial; color: rgb(81, 87, 89); font-weight: 300; font-size: 100%; display: inline-block; text-align: center; margin-bottom: 30px;" >Spor hakkında eklediğimiz iki soruluk anketi cevaplayarak ileride daha fazla ankete katılmaya hak kazanabilirsin!</span>
            <span style="margin: 0px 20px; font-family: Arial; color: rgb(81, 87, 89); font-weight: 300; font-size: 100%; display: inline-block; text-align: center;" >Sen de spor yapan arkadaşlarını Usersmagic’e davet et, anketi doldurt, herkes kazansın!</span>
            <a href="https://usersmagic.com/campaigns/user" style="
              background-color: rgb(80, 177, 238);
              width: 175px;
              padding: 20px 0px;
              margin: 40px 0px;
              border-radius: 15px;
              display: inline-block;
              text-align: center;
              cursor: pointer;
              text-decoration: none;
            ">
              <span style="color: rgb(254, 254, 254); font-weight: 600; font-size: 115%; font-family: Arial;" >Hemen Doldur!</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    `
  }),
  nike: (data) => ({
    bcc: data.emailList,
    subject: 'Usersmagic\'in Heyecan Verici Bir Haberi Var!',
    html: `
    <div style="width: 100%;" >
      <div style="
        width: 100%;
        background-color: rgb(254, 254, 254);
        overflow-x: scroll;
      " >
        <div style="
          width: 400px;
          min-width: 400px;
          background-color: rgb(254, 254, 254);
          display: inline-block;
          text-align: center;
        " >
          <div style="
            height: fit-content;
            width: 100%;
            display: inline-block;
            text-align: center;
          " >
            <img src="https://usersmagic.com/res/images/nike_mail.jpg" style="width: 400px; margin-bottom: 20px;">
            <span style="
              color: rgb(12, 16, 20);
              font-weight: 700;
              font-size: 100%;
              font-family: Arial;
              display: inline-block;
              margin: 0px 20px;
              margin-bottom: 30px;
              width: 100%;
              text-align: start;
            " >
              Merhaba Usersmagic ailesinin değerli üyesi,
            </span>
            <span style="
              color: rgb(12, 16, 20);
              font-weight: 700;
              font-size: 100%;
              font-family: Arial;
              display: inline-block;
              margin: 0px 20px;
              width: 100%;
              text-align: start;
              margin-bottom: 30px;
            " >
              Usersmagic'in sana heyecan verici bir haberi var.
            </span>
            <span style="
              color: rgb(12, 16, 20);
              font-weight: 700;
              font-size: 100%;
              font-family: Arial;
              display: inline-block;
              margin: 0px 20px;
              margin-bottom: 30px;
              line-height: 23px;
              width: 100%;
              text-align: start;
            " >
              Her kız çocuğunun spora ve eğitime eşit erişim hakkı olması gerektiğine inanan Nike, Çağdaş Yaşamı Destekleme Derneği ile birlikte 10 yıldır olduğu gibi, bu yıl da verdiği destekle kızların eğitimi önündeki engelleri kaldırmaya devam ediyor.
            </span>
            <span style="
              color: rgb(12, 16, 20);
              font-weight: 700;
              font-size: 100%;
              font-family: Arial;
              display: inline-block;
              margin: 0px 20px;
              width: 100%;
              text-align: start;
              margin-bottom: 30px;
            " >
              Sen de başvur, geleceği birlikte değiştirelim.
            </span>
            <span style="
              color: rgb(12, 16, 20);
              font-weight: 700;
              font-size: 100%;
              font-family: Arial;
              display: inline-block;
              margin: 0px 20px;
              width: 100%;
              text-align: start;
              margin-bottom: 20px;
            " >
              Burs kriterleri;
            </span>
            <span style="
              color: rgb(12, 16, 20);
              font-weight: 700;
              font-size: 100%;
              font-family: Arial;
              display: inline-block;
              margin: 0px 20px;
              width: 100%;
              text-align: start;
              margin-bottom: 20px;
            " >
              • Türkiye Cumhuriyeti Vatandaşı olmak.
            </span>
            <span style="
              color: rgb(12, 16, 20);
              font-weight: 700;
              font-size: 100%;
              font-family: Arial;
              display: inline-block;
              margin: 0px 20px;
              width: 100%;
              text-align: start;
              margin-bottom: 20px;
            " >
              • Lisanslı olarak en az bir spor dalıyla uğraşıyor olmak.
            </span>
            <span style="
              color: rgb(12, 16, 20);
              font-weight: 700;
              font-size: 100%;
              font-family: Arial;
              display: inline-block;
              margin: 0px 20px;
              width: 100%;
              text-align: start;
              margin-bottom: 20px;
            " >
              • Maddi desteğe ihtiyaç duymak.
            </span>
            <span style="
              color: rgb(12, 16, 20);
              font-weight: 700;
              font-size: 100%;
              font-family: Arial;
              display: inline-block;
              margin: 0px 20px;
              width: 100%;
              text-align: start;
              margin-bottom: 20px;
            " >
              • Başka bir kamu kuruluşu veya özel kuruluştan burs almamak.
            </span>
            <span style="
              color: rgb(12, 16, 20);
              font-weight: 700;
              font-size: 100%;
              font-family: Arial;
              display: inline-block;
              margin: 0px 20px;
              width: 100%;
              text-align: start;
              margin-bottom: 30px;
            " >
              • Açık lisede ya da özel okulda okumamak.
            </span>
            <span style="
              color: rgb(12, 16, 20);
              font-weight: 700;
              font-size: 100%;
              font-family: Arial;
              display: inline-block;
              margin: 0px 20px;
              width: 100%;
              line-height: 23px;
              text-align: start;
              margin-bottom: 30px;
            " >
              Aşağıdaki butona tıklayarak formu doldur ve Nike ile birlikte hayallerinin peşinden git.
            </span>
            <span style="
              color: rgb(12, 16, 20);
              font-weight: 700;
              font-size: 100%;
              font-family: Arial;
              display: inline-block;
              margin: 0px 20px;
              width: 100%;
              text-align: start;
            " >
              Usersmagic her zaman yanında!
            </span>
            <a href="https://www.cydd.org.tr/sayfa/burs-basvurusu-yapmak-istiyorum-150/" style="
              background-color: rgb(80, 177, 238);
              width: 175px;
              padding: 20px 0px;
              margin-top: 30px;
              margin-bottom: 10px;
              border-radius: 15px;
              display: inline-block;
              text-align: center;
              cursor: pointer;
              text-decoration: none;
            ">
              <span style="color: rgb(254, 254, 254); font-weight: 600; font-size: 115%; font-family: Arial;" >Hemen Başvur!</span>
            </a>
            <div style="margin: auto; margin-top: 20px; width: 100%; height: 30px; display: inline-block; text-align: center;" >
              <img  src="https://usersmagic.com/res/images/logo_black.png" style="height: 30px;">
            </div>
            <span style="
              color: rgb(12, 16, 20);
              font-weight: 700;
              font-size: 100%;
              text-align: center;
              font-family: Arial;
              display: inline-block;
              margin: 0px 20px;
            " >
              Usersmagic
            </span>
          </div>
        </div>
      </div>
    </div>
    `
  }),
  newCampaigns: (data) => ({
    bcc: data.emailList,
    subject: 'Seni Bekleyen Yeni Kampanyalar Var',
    html: `
    <div style="width: 100%;" >
    <div style="
      width: 100%;
      background-color: rgb(254, 254, 254);
      overflow-x: scroll;
    " >
      <div style="
        width: 400px;
        min-width: 400px;
        background-color: rgb(254, 254, 254);
        display: inline-block;
        text-align: center;
      " >
        <div style="
          height: fit-content;
          width: 100%;
          display: inline-block;
          text-align: center;
        " >
          <img src="https://usersmagic.com/res/images/mail_top_image.png" style="width: 400px; margin-bottom: 20px;">
          <span style="
            color: rgb(12, 16, 20);
            font-weight: 700;
            font-size: 225%;
            text-align: center;
            font-family: Arial;
            display: inline-block;
            margin: 0px 20px;
          " >
            Seni Bekleyen Yeni Kampanyalar Var!
          </span>
          <div style="margin: auto; margin-top: 20px; margin-bottom: 20px; width: 120px; height: 30px; display: inline-block; text-align: center;" >
            <img  src="https://usersmagic.com/res/images/logo_black.png" style="height: 30px;">
          </div>
          
          <span style="margin: 0px 20px; font-family: Arial; color: rgb(81, 87, 89); font-weight: 300; font-size: 100%; display: inline-block; text-align: center; margin-bottom: 30px;" >
            Usersmagic kazandırmaya devam ediyor!
          </span>
          <span style="margin: 0px 20px; font-family: Arial; color: rgb(81, 87, 89); font-weight: 300; font-size: 100%; display: inline-block; text-align: center;" >
            Eklediğimiz yeni anketleri görmek ve para kazanmaya devam etmek için hemen siteye giriş yap.
          </span>
          <a href="https://usersmagic.com/campaigns/user" style="
            background-color: rgb(80, 177, 238);
            width: 175px;
            padding: 20px 0px;
            margin: 40px 0px;
            border-radius: 15px;
            display: inline-block;
            text-align: center;
            cursor: pointer;
            text-decoration: none;
          ">
            <span style="color: rgb(254, 254, 254); font-weight: 600; font-size: 115%; font-family: Arial;" >Siteye Git</span>
          </a>
        </div>
      </div>
    </div>
  </div>
    `
  })
};

module.exports = (data, template, callback) => {
  const mailOptions = {
    from: "usersmagic",
    ...templates[template](data)
  };
  transporter.sendMail(mailOptions, callback);
};
