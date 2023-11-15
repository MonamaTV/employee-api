const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  security: "STARTTLS",
  auth: {
    user: "unique.howell@ethereal.email",
    pass: "gwZZg82EpyNwUP4cWZ",
  },
});

const sendEmail = async (email) => {
  let mailOptions = {
    from: "unique.howell@ethereal.email",
    to: email,
    subject: "Subject for your welcome emails",
    text: "The content about successful registraion",
  };

  response = transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return false;
    } else {
      console.log("Email sent: " + info);
      return true;
    }
  });

  return response;
};

module.exports = {
  sendEmail,
};
