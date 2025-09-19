const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://nattygaslab-email-api.onrender.com', '*'] // Allow all origins for APK
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

// Serve static files (for email images)
app.use('/public', express.static('public'));

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
  // Convert logo to base64 for better email compatibility
  let logoBase64 = '';
  try {
    const logoPath = path.join(__dirname, 'public', 'images', 'logo.png');
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    }
  } catch (error) {
    console.warn('Could not load logo for email:', error.message);
  }
    
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to NattyGas Lab</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                margin: 0; 
                padding: 0; 
                background-color: #f4f4f4; 
            }
            .email-wrapper { 
                background-color: #f4f4f4; 
                padding: 20px; 
                min-height: 100vh; 
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background-color: white; 
                border-radius: 12px; 
                overflow: hidden; 
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); 
            }
            .header { 
                background: linear-gradient(135deg, #0072BC, #005a9e); 
                color: white; 
                padding: 40px 30px; 
                text-align: center; 
                position: relative;
            }
            .logo { 
                width: 80px; 
                height: 80px; 
                margin: 0 auto 20px; 
                background: white; 
                border-radius: 50%; 
                padding: 10px; 
                display: flex; 
                align-items: center; 
                justify-content: center;
            }
            .logo img { 
                width: 60px; 
                height: 60px; 
                object-fit: contain; 
            }
            .header h1 { 
                margin: 0; 
                font-size: 28px; 
                font-weight: 700; 
            }
            .header p { 
                margin: 10px 0 0; 
                font-size: 16px; 
                opacity: 0.9; 
            }
            .content { 
                padding: 40px 30px; 
                background: #ffffff; 
            }
            .welcome-message { 
                text-align: center; 
                margin-bottom: 30px; 
            }
            .welcome-message h2 { 
                color: #0072BC; 
                font-size: 24px; 
                margin: 0 0 10px; 
            }
            .credentials { 
                background: linear-gradient(135deg, #f8f9ff, #e8f4fd); 
                padding: 25px; 
                border-radius: 12px; 
                margin: 25px 0; 
                border: 2px solid #e3f2fd; 
                position: relative;
            }
            .credentials::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 4px;
                background: #0072BC;
                border-radius: 0 4px 4px 0;
            }
            .credentials h3 { 
                color: #0072BC; 
                margin: 0 0 15px; 
                font-size: 18px; 
            }
            .credential-item { 
                margin: 12px 0; 
                padding: 8px 0; 
            }
            .credential-label { 
                font-weight: 600; 
                color: #555; 
                display: inline-block; 
                min-width: 120px; 
            }
            .credential-value { 
                color: #333; 
            }
            .password-code { 
                background: #f1f8ff; 
                padding: 8px 12px; 
                border-radius: 6px; 
                font-family: 'Courier New', monospace; 
                font-weight: bold; 
                color: #0072BC; 
                border: 1px solid #d1ecf1; 
            }
            .security-notice { 
                background: linear-gradient(135deg, #fff8e1, #ffecb3); 
                border: 2px solid #ffc107; 
                padding: 20px; 
                border-radius: 12px; 
                margin: 25px 0; 
                position: relative;
            }
            .security-notice::before {
                content: '⚠️';
                position: absolute;
                top: -10px;
                left: 20px;
                background: #ffc107;
                padding: 5px 10px;
                border-radius: 20px;
                font-size: 16px;
            }
            .security-notice h3 { 
                color: #f57c00; 
                margin: 0 0 10px; 
                font-size: 16px; 
            }
            .security-notice p { 
                margin: 0; 
                font-weight: 600; 
                color: #e65100; 
            }
            .steps { 
                background: linear-gradient(135deg, #f1f8e9, #e8f5e8); 
                padding: 25px; 
                border-radius: 12px; 
                margin: 25px 0; 
                border: 2px solid #c8e6c9; 
            }
            .steps h3 { 
                color: #2e7d32; 
                margin: 0 0 15px; 
                font-size: 18px; 
            }
            .steps ol { 
                margin: 0; 
                padding-left: 20px; 
            }
            .steps li { 
                margin: 8px 0; 
                color: #1b5e20; 
            }
            .contact-info { 
                background: #f8f9fa; 
                padding: 20px; 
                border-radius: 8px; 
                margin: 25px 0; 
                text-align: center; 
            }
            .footer { 
                background: #f8f9fa; 
                text-align: center; 
                color: #666; 
                font-size: 12px; 
                padding: 30px; 
                border-top: 1px solid #e9ecef; 
            }
            .footer p { 
                margin: 5px 0; 
            }
            .emoji { 
                font-size: 18px; 
                margin-right: 8px; 
            }
            .brand-colors { 
                color: #0072BC; 
            }
        </style>
    </head>
    <body>
        <div class="email-wrapper">
            <div class="container">
                <div class="header">
                    <div class="logo">
                        ${logoBase64 ? `<img src="${logoBase64}" alt="NattyGas Lab Logo" />` : '<div style="font-size: 24px; font-weight: bold; color: #0072BC;">NGL</div>'}
                    </div>
                    <h1>Welcome to NattyGas Lab</h1>
                    <p>Laboratory Information Management System</p>
                </div>
                
                <div class="content">
                    <div class="welcome-message">
                        <h2>Hello ${userName}! 👋</h2>
                        <p>Your account has been successfully created. Welcome to our advanced laboratory management system!</p>
                    </div>
                    
                    <div class="credentials">
                        <h3><span class="emoji">🔑</span> Your Login Credentials</h3>
                        <div class="credential-item">
                            <span class="credential-label">📧 Email:</span>
                            <span class="credential-value">${email}</span>
                        </div>
                        <div class="credential-item">
                            <span class="credential-label">🔐 Temporary Password:</span>
                            <br>
                            <span class="password-code">${password}</span>
                        </div>
                        <div class="credential-item">
                            <span class="credential-label">👤 Role:</span>
                            <span class="credential-value brand-colors"><strong>${role.toUpperCase()}</strong></span>
                        </div>
                    </div>

                    <div class="security-notice">
                        <h3>Important Security Notice</h3>
                        <p>For your security, please log in and change your password immediately after your first login.</p>
                    </div>

                    <div class="steps">
                        <h3><span class="emoji">🚀</span> Getting Started</h3>
                        <ol>
                            <li><strong>Visit</strong> the NattyGas Lab application</li>
                            <li><strong>Log in</strong> using the credentials above</li>
                            <li><strong>Change your password</strong> in your profile settings</li>
                            <li><strong>Explore</strong> the features available for your role</li>
                        </ol>
                    </div>

                    <div class="contact-info">
                        <p><span class="emoji">📱</span> <strong>Need Help?</strong></p>
                        <p>If you have any questions or need assistance, please contact your system administrator.</p>
                    </div>
                    
                    <p style="text-align: center; margin-top: 30px;">
                        Best regards,<br>
                        <strong class="brand-colors">NattyGas Lab Team</strong>
                    </p>
                </div>
                
                <div class="footer">
                    <p>This is an automated message. Please do not reply to this email.</p>
                    <p>&copy; ${new Date().getFullYear()} NattyGas Lab. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

// API Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'NattyGas Lab Email Service API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      sendEmail: '/api/send-email (POST)'
    }
  });
});

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
