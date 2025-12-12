import nodemailer from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';

const testAccount = await nodemailer.createTestAccount();

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName || '';
    this.url = url;
    this.from = 'ChattyCat <no-reply@chattycat.dev>';
  }

  newTransport() {
    if (process.env.NODE_ENV === 'development') {
      const mailgunOptions = {
        auth: {
          api_key: process.env.MAILGUN_API_KEY,
          domain: process.env.MAILGUN_DOMAIN,
        },
      };
      return nodemailer.createTransport(mg(mailgunOptions));
    }

    // Development
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  async send(subject, message) {
    const transporter = await this.newTransport();

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Message sent: %s', info.messageId);
    console.log('🕵️‍♀️ Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }

  async sendPasswordReset() {
    await this.send(
      'Your password reset token (valid for 10 minutes)',
      `Forgot your password? Navigate to ${this.url}`,
    );
  }
}

export default Email;
