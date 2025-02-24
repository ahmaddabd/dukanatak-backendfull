# Dukanatak Backend
Backend for Dukanatak project using NestJS and DDD architecture.

## Environment Variables
The application requires several environment variables to be set up. Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection URL
- `REDIS_URL`: Redis connection URL (default: redis://localhost:6379)
- `JWT_SECRET`: Secret key for JWT token generation
- `TWILIO_ACCOUNT_SID`: Twilio account SID for SMS
- `TWILIO_AUTH_TOKEN`: Twilio auth token
- `TWILIO_PHONE_NUMBER`: Twilio phone number for sending SMS
- `PORT`: Server port (default: 3000)

## Getting Started
1. Install dependencies:
```bash
npm install
```

2. Set up environment variables as described above.

3. Start the development server:
```bash
npm run start:dev