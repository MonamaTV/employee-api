const nodemailer = require("nodemailer");

// Create a Nodemailer transporter with SMTP details
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  security: "STARTTLS",
  auth: {
    user: "unique.howell@ethereal.email",
    pass: "gwZZg82EpyNwUP4cWZ",
  },
});

// Define the email options
let mailOptions = {
  from: "unique.howell@ethereal.email",
  to: "youremailhere@gmail.com",
  subject: "Testing Nodemailer with Gmail using host",
  text: "This is a test email sent using Nodemailer with Gmail via host settings.",
};

// Send the email
transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info);
  }
});
