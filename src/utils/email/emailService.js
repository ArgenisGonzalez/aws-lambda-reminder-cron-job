import ejs from "ejs";
import fs from "fs";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

class ReminderEmailService {
  constructor() {
    this.mailer = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: "Your own application password",
      },
    });
  }

  async compileTemplate(description, duration) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const templatePath = path.resolve(
      __dirname,
      "email/template/notification.ejs"
    );

    const template = fs.readFileSync(templatePath, "utf8");
    return ejs.render(template, { description, duration });
  }

  async sendReminder(email, description, duration) {
    try {
      const html = await this.compileTemplate(description, duration);
      const mail = await this.mailer.sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "⏰ You have a pending event!",
        html,
      });
      console.log("✅ Email sent:");
      return mail;
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      throw error;
    }
  }
}

const reminderEmailService = new ReminderEmailService();
export default reminderEmailService;
