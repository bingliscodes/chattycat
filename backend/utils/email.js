import nodemailer from 'nodemailer';

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName || '';
    this.url = url;
    this.from = 'ChattyCat <no-reply@chattycat.dev>';
  }

  newTransport() {
    if (process.env.NODE_ENV === 'development') {
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
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
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
