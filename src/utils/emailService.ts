
import transporter from "../config/emailConfig";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  static async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }

  static async sendVerificationEmail(
    email: string,
    username: string,
    otp: string
  ): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f4f4f4;
              padding: 20px;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px 20px;
              text-align: center;
              color: white;
            }
            .header h1 {
              font-size: 28px;
              margin-bottom: 10px;
            }
            .header p {
              font-size: 16px;
              opacity: 0.9;
            }
            .content {
              padding: 40px 30px;
              color: #333;
            }
            .greeting {
              font-size: 18px;
              margin-bottom: 20px;
              color: #333;
            }
            .message {
              font-size: 16px;
              line-height: 1.6;
              color: #555;
              margin-bottom: 30px;
            }
            .otp-container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 25px;
              border-radius: 10px;
              text-align: center;
              margin: 30px 0;
            }
            .otp-label {
              color: white;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 10px;
            }
            .otp-code {
              font-size: 36px;
              font-weight: bold;
              color: white;
              letter-spacing: 8px;
              font-family: 'Courier New', monospace;
            }
            .expiry-notice {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .expiry-notice p {
              margin: 0;
              color: #856404;
              font-size: 14px;
            }
            .footer {
              background-color: #f8f9fa;
              padding: 30px;
              text-align: center;
              border-top: 1px solid #e9ecef;
            }
            .footer p {
              font-size: 14px;
              color: #6c757d;
              margin-bottom: 10px;
            }
            .security-tip {
              background-color: #e7f3ff;
              border-left: 4px solid #2196F3;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .security-tip p {
              margin: 0;
              color: #0c5460;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1> Uber Clone</h1>
              <p>Verify Your Email Address</p>
            </div>

            <div class="content">
              <p class="greeting">Hello <strong>${username}</strong>,</p>
              
              <p class="message">
                Thank you for registering with Uber Clone! We're excited to have you on board.
                To complete your registration and start using our services, please verify your email address.
              </p>

              <div class="otp-container">
                <p class="otp-label">Your Verification Code</p>
                <div class="otp-code">${otp}</div>
              </div>

              <div class="expiry-notice">
                <p>⏰ <strong>This code will expire in 10 minutes.</strong></p>
              </div>

              <p class="message">
                Enter this code in the verification page to activate your account and start booking rides or driving with us.
              </p>

              <div class="security-tip">
                <p>
                  🔒 <strong>Security Tip:</strong> Never share this code with anyone. 
                  Our team will never ask you for this code via phone or email.
                </p>
              </div>
            </div>

            <div class="footer">
              <p>If you didn't create an account with Uber Clone, please ignore this email.</p>
              <p>Need help? Contact us at <a href="mailto:support@uberclone.com" style="color: #667eea;">support@uberclone.com</a></p>
              <p style="margin-top: 20px; font-size: 12px;">
                © ${new Date().getFullYear()} Uber Clone. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: "Verify Your Email - Uber Clone",
      html,
    });
  }

  static async sendWelcomeEmail(
    email: string,
    username: string
  ): Promise<void> {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Uber Clone</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
          }
          .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
          }
          .header p {
            font-size: 16px;
            opacity: 0.9;
          }
          .content {
            padding: 40px 30px;
            color: #333;
          }
          .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #333;
          }
          .message {
            font-size: 16px;
            line-height: 1.6;
            color: #555;
            margin-bottom: 25px;
          }
          .feature-box {
            background-color: #eef2ff;
            border-left: 4px solid #667eea;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 25px;
          }
          .feature-box p {
            margin: 0;
            font-size: 15px;
            color: #444;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
          }
          .footer p {
            font-size: 14px;
            color: #6c757d;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Welcome to Uber Clone!</h1>
            <p>Your journey starts now</p>
          </div>

          <div class="content">
            <p class="greeting">Hello <strong>${username}</strong>,</p>

            <p class="message">
              We're excited to officially welcome you to Uber Clone!  
              Your account has been successfully verified, and you’re now ready to explore our platform.
            </p>

            <div class="feature-box">
              <p>🚗 <strong>Book rides instantly</strong> — fast, simple and reliable.</p>
              <p>💳 <strong>Secure payments</strong> with multiple payment options.</p>
              <p>📍 <strong>Track drivers live</strong> with accurate real-time location updates.</p>
            </div>

            <p class="message">
              We’re thrilled to have you join our community.  
              If you ever need help, our support team is always ready to assist you.
            </p>
          </div>

          <div class="footer">
            <p>If you didn’t create an account with Uber Clone, please ignore this email.</p>
            <p>Need help? Contact us at 
              <a href="mailto:support@uberclone.com" style="color: #667eea;">support@uberclone.com</a>
            </p>
            <p style="margin-top: 20px; font-size: 12px;">
              © ${new Date().getFullYear()} Uber Clone. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

    await this.sendEmail({
      to: email,
      subject: "Welcome to Uber Clone!",
      html,
    });
  }

  
}