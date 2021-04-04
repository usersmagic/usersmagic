const nodemailer = require('nodemailer');

const htmlToText = require('nodemailer-html-to-text').htmlToText;

const key = require('../keys/gmailAPIKey.json');

const MAIL_USER_NAME = 'usersmagic@usersmagic.com';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: MAIL_USER_NAME,
    serviceClient: key.client_id,
    privateKey: key.private_key
  },
  pool: true
});
transporter.use('compile', htmlToText());

const templates = {
  title_text_button_template: data => ({
    /* 
      data = {
        email_list: [],
        subject: '',
        title: '',
        text: '',
        button: '',
        url: '',
      }
    */
    bcc: data.email_list,
    subject: data.subject,
    html: `
      <div style="
        width: 100%;
        height: fit-content;
        min-height: fit-content;
        background-color: rgb(254, 254, 254);
        overflow: scroll;
      " >
          <div style="
            width: 400px;
            min-width: 400px;
            height: fit-content;
            min-height: 100%;
            padding: 30px;
            background-color: rgb(254, 254, 254);
          ">
            <div style="
              width: 100%;
              display: inline-block;
              margin-bottom: 40px;
              vertical-align: center;
            ">
              <img src="https://usersmagic.com/res/images/logo.png" alt="Usersmagic" style="
                display: inline-block;
                width: 15px;
              " />
              <span src="https://usersmagic.com/res/images/logo_text.png" alt="Usersmagic" style="
                color: rgb(46, 197, 206);
                font-weight: 600;
                font-size: 20px;
                justify-self: center;
                display: inline-block;
                position: relative;
                top: 50%;
                transform: translateY(-25%);
                margin-left: 5px;
              ">usersmagic</span>
            </div>
            <div class="all-wrapper">
              <span style="
                color: rgb(28, 30, 35);
                font-size: 24px;
                display: block;
                font-family: Arial, Helvetica, sans-serif;
                font-weight: 600;
                width: 100%;
                text-align: center;
                letter-spacing: 0.75px;
                margin-bottom: 30px;
              ">${data.title}</span>
              <span style="
                color: rgb(143, 152, 177);
                font-size: 17px;
                display: block;
                font-family: Arial, Helvetica, sans-serif;
                font-weight: 300;
                width: 100%;
                text-align: center;
                letter-spacing: 1px;
                line-height: 24px;
                margin-bottom: 30px;
              ">${data.text}</span>
              <div style="
                width: 100%;
                text-align: center;
                display: block;
              " >
                <a href=${data.url} style="
                  border-radius: 40px;
                  background-color: rgb(46, 197, 206);
                  color: rgb(254, 254, 254);
                  padding: 15px 35px;
                  text-decoration: none;
                  font-size: 17px;
                  font-weight: 600;
                  display: inline-block;
                  font-family: Arial, Helvetica, sans-serif;
                  letter-spacing: 1.5px;
                  line-height: 24px;
                  cursor: pointer;
                ">${data.button}</a>
              </div>
            </div>
          </div>
      </div>
    `
  }),
};

module.exports = (data, template, callback) => {
  const mailOptions = {
    from: 'usersmagic',
    ...templates[template](data)
  };
  transporter.sendMail(mailOptions, callback);
};
