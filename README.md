
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

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](http://www.linkedin.com/in/ayush-kumar-849a1324b)  
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/9A-Ayush)  
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/ayush_ix_xi)  
[![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://canary.discord.com/channels/@me)
[![X](https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/ayush_bhai4590?t=HEv_7HYwU_uCIO_8POGwZg&s=09)  
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:wemayush@gmail.com)  


---

## ☕ Support My Work  

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/9a.ayush)
 

_"Code. Secure. Innovate."_  

✨ _This email service is designed to be secure, scalable, and production-ready for NattyGas Lab._  
