# NattyGas Lab Email API Documentation

## Base URL
- **Development**: `http://localhost:3001`
- **Production**: `https://nattygaslab-email-api.onrender.com`

## Endpoints

### 1. Health Check
**GET** `/api/health`

Returns the health status of the email service.

**Response:**
```json
{
  "success": true,
  "message": "NattyGas Lab Email Service is running",
  "timestamp": "2024-09-20T00:00:00.000Z",
  "version": "1.0.0"
}
```

### 2. Send Email
**POST** `/api/send-email`

Sends emails using the configured SMTP service.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "to": "user@example.com",
  "subject": "Email Subject",
  "type": "welcome",
  "userData": {
    "userName": "John Doe",
    "email": "user@example.com",
    "password": "tempPassword123",
    "role": "user"
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "<message-id@smtp.server>",
  "timestamp": "2024-09-20T00:00:00.000Z"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Failed to send email",
  "error": "Error details"
}
```

## Email Types

### Welcome Email (`type: "welcome"`)
Sends a professionally formatted welcome email with:
- Company logo
- User credentials
- Security notice
- Getting started steps
- Professional styling

**Required userData fields:**
- `userName`: User's full name
- `email`: User's email address
- `password`: Temporary password
- `role`: User's role in the system

## Environment Variables

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# App Configuration
PORT=3001
NODE_ENV=development
BASE_URL=http://localhost:3001

# Company Information
COMPANY_NAME=NattyGas Lab
COMPANY_EMAIL=noreply@nattygaslab.com
COMPANY_WEBSITE=https://nattygaslab.com
```

## Rate Limiting
- 100 requests per 15 minutes per IP address
- Applies to all `/api/*` endpoints

## CORS Configuration
- **Development**: Allows `localhost:3000` and `127.0.0.1:3000`
- **Production**: Allows all origins for APK compatibility

## Static Assets
Logo and other images are served from `/public/images/` directory.

Example: `https://nattygaslab-email-api.onrender.com/public/images/logo.png`