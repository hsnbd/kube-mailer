# Kube-Mailer Microservice System

A microservice-based email system with a simple UI that demonstrates a multi-tier architecture:

- **Mail UI** (React) → **Primary Server** → **Decorator Server** → **Worker**

## Architecture

```
┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐
│   Mail UI   │───▶│ Primary Server  │───▶│ Decorator Server│───▶│   Worker    │
│  (React)    │    │   (Express)     │    │   (Express)     │    │ (Express +  │
│   :3000     │    │     :3001       │    │     :3002       │    │ Nodemailer) │
└─────────────┘    └─────────────────┘    └─────────────────┘    │    :3003    │
                                                                 └─────────────┘
```

## Services

### 1. Mail UI (Port 3000)
- Simple React interface
- Form with: recipient email, subject, message body
- Send button to submit emails
- Status feedback for users

### 2. Primary Server (Port 3001)
- Receives mail requests from UI
- Validates input data
- Forwards to decorator service
- Handles API responses

### 3. Decorator Server (Port 3002)
- Enriches email content
- Adds headers, footers, and metadata
- Generates unique mail IDs
- Forwards to worker service

### 4. Worker (Port 3003)
- Sends actual emails using Nodemailer
- Supports both real email sending and mock mode
- Returns delivery status

## Quick Start

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

2. **Start all services:**
   ```bash
   npm run dev
   ```

3. **Or start services individually:**
   ```bash
   # Terminal 1 - Primary Server
   npm run start:primary
   
   # Terminal 2 - Decorator Server
   npm run start:decorator
   
   # Terminal 3 - Worker
   npm run start:worker
   
   # Terminal 4 - UI
   npm run start:ui
   ```

4. **Access the application:**
   - Open browser to `http://localhost:3000`
   - Fill out the email form and click "Send Email"

## Configuration

### Email Setup (Optional)
To enable real email sending, configure the worker service:

1. Edit `services/worker/.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

2. For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833)

If not configured, the system runs in **mock mode** and logs emails to console.

## API Endpoints

### Primary Server (:3001)
- `GET /health` - Health check
- `POST /api/mail/send` - Send email

### Decorator Server (:3002)
- `GET /health` - Health check
- `POST /api/mail/decorate` - Decorate email

### Worker (:3003)
- `GET /health` - Health check
- `POST /api/mail/send` - Send email
- `GET /api/mail/status/:id` - Get email status

## Development

### Project Structure
```
kube-mailer/
├── package.json                    # Root package with scripts
├── common/                         # Shared utilities and types
│   ├── types.js
│   └── utils.js
└── services/
    ├── mail-ui/                   # React frontend
    │   ├── package.json
    │   ├── public/
    │   └── src/
    ├── primary-server/            # Express API server
    │   ├── package.json
    │   ├── index.js
    │   └── .env
    ├── decorator-server/          # Email decoration service
    │   ├── package.json
    │   ├── index.js
    │   └── .env
    └── worker/                    # Email sending service
        ├── package.json
        ├── index.js
        └── .env
```

### Health Checks
Each service provides a health check endpoint:
- Primary Server: `http://localhost:3001/health`
- Decorator Server: `http://localhost:3002/health`
- Worker: `http://localhost:3003/health`

### Testing the Flow
1. Open `http://localhost:3000`
2. Fill in email form:
   - **To:** any@example.com
   - **Subject:** Test Email
   - **Body:** Hello World!
3. Click "Send Email"
4. Check console logs to see the email flow through services

## Next Steps

- Add database for email tracking
- Implement proper logging
- Add Kubernetes deployment files
- Add authentication
- Add email templates
- Add retry mechanisms
- Add monitoring and metrics
