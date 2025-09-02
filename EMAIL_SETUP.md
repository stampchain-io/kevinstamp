# Kevin Stamp Website - Email Configuration Guide

## Email Setup for Contact Form Inquiries

All Kevin stamp inquiries from the website are now sent to **enquiries@stampchain.io**.

## SMTP Configuration

The email service uses Nodemailer with SMTP. You need to configure the following environment variables:

### For Gmail (Recommended for Development)
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SERVICE=gmail
```

### For Other Providers

#### Outlook/Hotmail
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

#### Custom SMTP Server
```bash
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
```

## Gmail Setup Instructions

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this 16-character password as `SMTP_PASS`

## Testing Email Configuration

### Test Endpoint (Development Only)
```bash
curl -X POST http://localhost:5000/api/test-email
```

### Production Testing
Submit a test inquiry through the contact form on your website.

## Email Template Features

- **HTML & Text versions** for better compatibility
- **Cyberpunk theme** matching your website design
- **Priority handling** for high-value inquiries (10+ BTC)
- **Reply-to** set to the inquirer's email for easy response
- **Custom headers** for tracking and categorization

## Email Content

The emails include:
- Inquiry details (name, email, budget range)
- Full motivation message
- Timestamp and inquiry ID
- Professional formatting with Kevin-themed styling

## Error Handling

- Email failures don't break form submission
- Success/failure status returned to user
- Detailed logging for troubleshooting
- Graceful fallback when email service is unavailable

## Security Notes

- Never commit SMTP credentials to version control
- Use environment variables in production
- Consider using services like SendGrid or Mailgun for production
- The test endpoint is disabled in production for security

## Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Check SMTP credentials
   - For Gmail, ensure you're using an App Password, not your regular password

2. **"Connection timeout"**
   - Verify SMTP host and port
   - Check firewall settings

3. **Emails not arriving**
   - Check spam folder
   - Verify the recipient email address
   - Check SMTP server logs

### Logs
Check your server console for email sending logs:
```
✅ Email sent successfully: { messageId, inquiryId, recipient, budgetRange }
❌ Failed to send inquiry email: { error, inquiryId, recipient }
```

## Production Deployment

For Replit deployment, set the environment variables in your Replit secrets or environment configuration.

---

**Note**: This email system is designed to work with your existing Replit-compatible setup without requiring any backend changes that would conflict with your deployment.
