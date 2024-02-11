const nodeMailer = require("nodemailer");
const pug = require("pug");

class Email {
  constructor(user, message) {
    this.to = user.email;
    this.from = `Masjidy APP<${process.env.EMAIL_FROM}>`;
    this.firstName = user.firstName;
    this.message = message;
  }

  transport() {
    const transporter = nodeMailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    return transporter;
  }

  async send(subject, template) {
    // 1) Render html template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      code: this.message.code,
      url: `${process.env.BASE_URL}:${process.env.PORT}`,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };

    // 3) Create transporter and send message
    await this.transport().sendMail(mailOptions);
  }

  async sendResetPassword() {
    await this.send("Masjidy APP - Reset Password", "resetPassword");
  }
}

module.exports = Email;
