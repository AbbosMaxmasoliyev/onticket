const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "send.api.mailtrap.io",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "api",
    pass: "4f0458485d962d97c31f06e1885ad126",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'otajonmaxmasoliyev775@gmail.com', // sender address
    to: "otajonmakxmasoliyev3112@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}


module.exports =  main
