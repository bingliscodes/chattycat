import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const testAccount = await nodemailer.createTestAccount();

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName || '';
    this.url = url;
    this.from = 'ChattyCat <no-reply@chattycat.dev>';
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }
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
      `Forgot your password? Submit a PATCH request with your new password and passwordConfirm`,
    );
  }
}

export default Email;
