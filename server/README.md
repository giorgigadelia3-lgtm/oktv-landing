# OK TV Auth Service

Backend service for phone-based registration/login with OTP and Google Sheets storage.

## Configuration (Required)

Create `server/.env` using `server/.env.example` as a template.

Required environment variables:

- `JWT_SECRET` — strong random string used to sign sessions.
- `GOOGLE_SHEETS_SPREADSHEET_ID` — the sheet ID from your URL.
- `GOOGLE_SERVICE_ACCOUNT_JSON` — service account JSON (raw JSON string or base64).
- `SMS_PROVIDER_URL` — your SMS provider endpoint.

Optional but recommended:

- `OTP_HASH_SECRET` — separate secret for hashing OTP codes.
- `GOOGLE_SHEETS_SHEET_NAME` — defaults to `Sheet1`.
- `SMS_PROVIDER_HEADERS_JSON` — JSON map of headers to send.
- `SMS_PROVIDER_BODY_TEMPLATE_JSON` — JSON payload template.
- `CORS_ORIGIN` — comma-separated list of allowed origins.

### SMS Provider Payload

The service builds a payload using `SMS_PROVIDER_BODY_TEMPLATE_JSON` and replaces:

- `{{phone}}` → the normalized phone number
- `{{message}}` → the OTP message text

Example:

```json
{"to":"{{phone}}","message":"{{message}}"}
```

If your provider requires different field names, change the template accordingly.

### Google Sheets Columns (Order)

The backend writes new users in this exact column order:

1. MOBILE NUMBER
2. CITY
3. FIRST NAME
4. LAST NAME

## Running Locally

```bash
cd server
npm install
npm start
```

Default port is `4000` (override with `PORT`).

## Frontend Integration

Update `config.js` in the site root:

```js
window.OKTV_CONFIG = {
  authApiBaseUrl: "http://localhost:4000",
  okaiWebhookUrl: "https://your-okai-webhook",
};
```

## Endpoints

- `POST /api/auth/start`
  - Body: `{ "phone": "+9955XXXXXXX" }`
  - Response: `{ exists: boolean, otpSent: boolean }`
- `POST /api/auth/verify`
  - Body: `{ phone, otp, firstName?, lastName?, city? }`
  - Response: `{ token, user }`
- `GET /api/user/me`
  - Header: `Authorization: Bearer <token>`

## Notes

- OTPs expire in ~5 minutes by default (`OTP_TTL_SECONDS`).
- Rate limits apply to both start and verify endpoints.
- Adjust `CORS_ORIGIN` for production.
