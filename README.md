
# 📧 NattyGas Lab Email Service  

A secure, production-ready email microservice built with **Node.js**, **Express**, and **Nodemailer**.

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![Nodemailer](https://img.shields.io/badge/Nodemailer-Email%20Service-orange?logo=maildotru)
![License](https://img.shields.io/badge/License-MIT-blue)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)

---

## 🚀 Quick Start

### 1️⃣ Install Dependencies
```bash
cd backend
npm install
```

### 2️⃣ Environment Setup
```bash
cp .env.example .env
nano .env   # Edit with your credentials
```

### 3️⃣ Configure Email Provider
- Gmail, Outlook/Hotmail, Custom SMTP supported

### 4️⃣ Start the Server
```bash
npm run dev   # Development mode (auto-restart)
npm start     # Production mode
```

---

## 📡 API Endpoints

### ✅ Health Check
```http
GET /api/health
```

### ✉️ Send Email
```http
POST /api/send-email
Content-Type: application/json

{
  "to": "user@example.com",
  "subject": "Welcome to NattyGas Lab",
  "type": "welcome",
  "userData": {
    "userName": "John Doe",
    "email": "user@example.com",
    "password": "tempPassword123",
    "role": "clerk"
  }
}
```

---

## 🔧 Configuration

### Environment Variables
| Variable      | Description             | Example                  |
|---------------|-------------------------|--------------------------|
| `EMAIL_HOST`  | SMTP server hostname    | `smtp.gmail.com`         |
| `EMAIL_PORT`  | SMTP server port        | `587`                    |
| `EMAIL_SECURE`| Use SSL/TLS             | `false`                  |
| `EMAIL_USER`  | Email username          | `your-email@gmail.com`   |
| `EMAIL_PASS`  | Email password/app pass | `your-app-password`      |
| `PORT`        | Server port             | `3000`                   |
| `NODE_ENV`    | Environment             | `development`            |

---

## 📱 Flutter Integration

- Development → `http://localhost:3000`
- Production → Update `EmailConfig.backendUrl` in Flutter app

---

## 🎨 Email Templates

✔ Responsive HTML  
✔ Branding & Security Notices  
✔ Mobile Friendly  

---

## 🚀 Deployment Options

- **PM2**  
- **Docker**  
- **Heroku / Railway / DigitalOcean / AWS**  

---

## 🔍 Troubleshooting

- **Auth Failed** → Use Gmail App Password  
- **Timeout** → Check Firewall / SMTP Port  
- **Flutter 404** → Update Backend URL + CORS  

---

## 🧪 Testing
```bash
curl http://localhost:3000/api/health

curl -X POST http://localhost:3000/api/send-email   -H "Content-Type: application/json"   -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "text": "This is a test email from NattyGas Lab"
  }'
```

---

## 📊 Monitoring

- Logs → email status, errors, message IDs  
- Health Check → `curl http://localhost:3000/api/health`  

---

## 🔐 Security Best Practices

1. ❌ Never commit `.env`  
2. 🔑 Use App Passwords  
3. ⏱ Enable Rate Limiting  
4. 🌍 Restrict CORS  
5. 🔒 Use HTTPS in production  

---

## 👨‍💻 Author  

- ![GitHub](https://img.icons8.com/ios-glyphs/20/000000/github.png) [GitHub](https://github.com/9A-Ayush)  
- ![LinkedIn](https://img.icons8.com/ios-filled/20/0A66C2/linkedin.png) [LinkedIn](http://www.linkedin.com/in/ayush-kumar-849a1324b)  
- ![Instagram](https://img.icons8.com/ios-filled/20/E4405F/instagram-new.png) [Instagram](https://www.instagram.com/ayush_ix_xi)  
- ![Email](https://img.icons8.com/ios-glyphs/20/000000/new-post.png) wemayush@gmail.com  

---

✨ _This email service is designed to be secure, scalable, and production-ready for NattyGas Lab._  
