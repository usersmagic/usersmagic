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
  newCampaigns: (data) => ({
    bcc: data.emailList,
    subject: 'Seni Bekleyen Yeni Kampanyalar Var',
    html: `
    <div style="width: 100%;" >
    <div style="
      width: 100%;
      background-color: rgb(254, 254, 254);
      overflow-x: scroll;2 zo
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
  }),
  marketyo: data => ({
    bcc: data.emailList,
    subject: 'Seni Bekleyen Yeni Bir Kampanya Var!',
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
              <span style="font-family: Arial; margin-bottom: 25px; color: rgb(30, 30, 30); font-weight: 600; font-size: 200%; width: 100%; display: inline-block; text-align: center; margin-top: 50px;" >
                Marketyo
              </span>
              <span style="margin: 0px 20px; font-family: Arial; color: rgb(81, 87, 89); font-weight: 300; font-size: 100%; display: inline-block; text-align: center; margin-bottom: 30px;" >
                Sana özel Marketyo anketine katılarak kredilerini arttır, Usersmagic ile kazanmaya devam et!
              </span>
              <span style="margin: 0px 20px; font-family: Arial; color: rgb(81, 87, 89); font-weight: 300; font-size: 100%; display: inline-block; text-align: center;" >
                Sen de uygulamayı değerlendir, yorumlarını ve fikirlerini paylaş, uygulamanın gelişmesine yardım et.
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
                <span style="color: rgb(254, 254, 254); font-weight: 600; font-size: 115%; font-family: Arial;" >Hemen Doldur!</span>
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

