const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-flutter-app-domain.com']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Create Nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Verify email configuration on startup
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email server is ready to send messages');
  } catch (error) {
    console.error('❌ Email configuration error:', error.message);
    console.log('Please check your .env file and email credentials');
  }
};

// Email templates
const generateWelcomeEmailHtml = (userName, email, password, role) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to NattyGas Lab</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0072BC, #005a9e); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .credentials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0072BC; }
            .security-notice { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .steps { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
            .emoji { font-size: 18px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🧪 Welcome to NattyGas Lab</h1>
                <p>Laboratory Information Management System</p>
            </div>
            <div class="content">
                <h2>Hello ${userName}! 👋</h2>
                <p>Your account has been successfully created. Welcome to our laboratory management system!</p>
                
                <div class="credentials">
                    <h3><span class="emoji">🔑</span> Your Login Credentials</h3>
                    <p><strong>📧 Email:</strong> ${email}</p>
                    <p><strong>🔐 Temporary Password:</strong> <code style="background: #f1f1f1; padding: 4px 8px; border-radius: 4px;">${password}</code></p>
                    <p><strong>👤 Role:</strong> ${role.toUpperCase()}</p>
                </div>

                <div class="security-notice">
                    <h3><span class="emoji">⚠️</span> Important Security Notice</h3>
                    <p><strong>For your security, please log in and change your password immediately after your first login.</strong></p>
                </div>

                <div class="steps">
                    <h3><span class="emoji">🚀</span> Getting Started</h3>
                    <ol>
                        <li>Visit the NattyGas Lab application</li>
                        <li>Log in using the credentials above</li>
                        <li>Change your password in your profile settings</li>
                        <li>Explore the features available for your role</li>
                    </ol>
                </div>

                <p>If you have any questions or need assistance, please contact your system administrator.</p>
                
                <p>Best regards,<br>
                <strong>NattyGas Lab Team</strong></p>
            </div>
            <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>&copy; ${new Date().getFullYear()} NattyGas Lab. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'NattyGas Lab Email Service is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, text, html, type, userData } = req.body;

    // Validate required fields
    if (!to || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: to, subject'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }

    const transporter = createTransporter();

    let emailHtml = html;
    let emailText = text;

    // Generate specific templates based on type
    if (type === 'welcome' && userData) {
      emailHtml = generateWelcomeEmailHtml(
        userData.userName,
        userData.email,
        userData.password,
        userData.role
      );
      emailText = `Welcome to NattyGas Lab!\n\nYour login credentials:\nEmail: ${userData.email}\nPassword: ${userData.password}\nRole: ${userData.role}\n\nPlease change your password after first login.`;
    }

    const mailOptions = {
      from: {
        name: process.env.COMPANY_NAME || 'NattyGas Lab',
        address: process.env.EMAIL_USER
      },
      to: to,
      subject: subject,
      text: emailText,
      html: emailHtml,
      headers: {
        'X-Mailer': 'NattyGas Lab Email Service',
        'X-Priority': '3'
      }
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent successfully to ${to}:`, info.messageId);

    res.json({
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error sending email:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 NattyGas Lab Email Service running on port ${PORT}`);
  console.log(`📧 Environment: ${process.env.NODE_ENV || 'development'}`);
  await verifyEmailConfig();
});

module.exports = app;