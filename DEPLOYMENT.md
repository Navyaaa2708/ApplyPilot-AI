# ApplyPilot AI - Deployment & Operations Guide

## Backend Deployment

### Railway Deployment

1. **Prepare for deployment:**
   ```bash
   git init
   git add .
   git commit -m "ApplyPilot AI production ready"
   ```

2. **Create Railway project:**
   - Visit railway.app and connect GitHub repository
   - Create new project from template
   - Select Node.js as service
   - Connect Postgres and Redis plugins

3. **Set environment variables in Railway:**
   ```
   DATABASE_URL = <Railway Postgres connection>
   REDIS_URL = <Railway Redis connection>
   JWT_SECRET = <generate a strong secret>
   JWT_ACCESS_TOKEN_EXPIRES = 15m
   JWT_REFRESH_TOKEN_EXPIRES = 30d
   GOOGLE_CLIENT_ID = <OAuth app ID>
   GOOGLE_CLIENT_SECRET = <OAuth secret>
   AI_PROVIDER_ENDPOINT = https://localhost:11434
   AI_PROVIDER_MODEL = llama-3.3-70b
   APP_ENV = production
   ```

4. **Deploy:**
   - Railway auto-deploys on git push
   - Monitor logs in Railway dashboard

### Manual Deployment to Render

1. **Create Render account and services:**
   - PostgreSQL database service
   - Redis service
   - Web service for backend API

2. **Configure build command:**
   ```
   npm install && npm run build
   ```

3. **Configure start command:**
   ```
   npm start
   ```

4. **Attach databases and set environment variables**

5. **Deploy by connecting GitHub**

## Chrome Extension Deployment

### Development Loading

1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/` folder
5. The extension loads with id visible in the interface

### Signing and Release

1. **Generate a signing key:**
   - Chrome Web Store provides keys upon first upload
   - Store securely in password manager

2. **Prepare manifest:**
   - Ensure version is incremented in manifest.json
   - All icons are present in `extension/icons/`

3. **Zip the extension:**
   ```bash
   cd extension
   zip -r applypilot-ai.zip . -x "*.git*" "node_modules/*"
   ```

4. **Upload to Chrome Web Store:**
   - Visit developer.chrome.com/webstore
   - Create developer account ($5 one-time fee)
   - Upload the .zip file
   - Fill in store listing:
     - Title: ApplyPilot AI
     - Short description (under 132 characters)
     - Full description with features
     - Screenshots (1280x800 PNG)
     - Category: Productivity
     - Languages: English
   - Upload icon (128x128 PNG)
   - Review privacy policy and terms

5. **Comply with policies:**
   - CSP enforced (no inline scripts)
   - No hidden tracking or credential harvesting
   - Form autofill requires explicit user consent
   - No automatic submission
   - All permissions justified

### Updating Released Extension

1. Increment version in `extension/manifest.json`
2. Update CHANGELOG with changes
3. Zip updated extension
4. Upload new version to Chrome Web Store
5. Wait for automatic review (typically 1-2 hours)
6. Users receive update notification

## Database Schema Setup

### Initial Setup

```bash
# Connect to PostgreSQL
psql -U postgres -d applypilot -h <host>

# Run schema initialization
\i database-schema.sql

# Verify tables created
\dt
```

### Backup Strategy

**Daily backups:**
```bash
pg_dump -U postgres -h <host> applypilot > backup-$(date +%Y%m%d).sql
```

**Restore from backup:**
```bash
psql -U postgres -d applypilot -h <host> < backup.sql
```

## Monitoring and Alerts

### Sentry Setup

1. Create account at sentry.io
2. Create new project for ApplyPilot AI
3. Set SENTRY_DSN in backend environment
4. Errors automatically captured and reported

### OpenTelemetry (Production Enhancement)

Replace telemetry stub with full SDK:
```typescript
import { NodeSDK } from "@opentelemetry/sdk-node";
import { ConsoleMetricExporter } from "@opentelemetry/sdk-metrics";

const sdk = new NodeSDK({
  serviceName: "applypilot-backend",
  metricReader: new ConsoleMetricExporter()
});

sdk.start();
```

### Logs

All backend logs are structured JSON for easy parsing:
```json
{
  "level": "info",
  "message": "User authenticated",
  "userId": "uuid",
  "timestamp": "2026-06-16T18:30:00Z"
}
```

## Security Checklist

- [ ] Database encrypted at rest (Railway/Render default)
- [ ] HTTPS enforced on all endpoints
- [ ] JWT secrets stored securely (never in version control)
- [ ] OAuth credentials configured for production domains
- [ ] CORS configured for extension origins only
- [ ] Rate limiting enabled (100 requests/minute per IP)
- [ ] Extension CSP enforced
- [ ] Form autofill requires user interaction
- [ ] No eval() or inline scripts in extension
- [ ] All dependencies regularly updated

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+

### Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with local database details
npm run build
npm run dev
```

### Load Extension in Chrome

1. Navigate to `chrome://extensions/`
2. Enable Developer Mode
3. Load unpacked -> select `extension/` folder

### Running Tests

```bash
cd backend
npm test
```

## Scaling Considerations

1. **Database:** PostgreSQL handles 1000+ concurrent users
2. **Redis:** Cache frequent ATS queries
3. **API rate limiting:** Prevent abuse
4. **CDN:** Serve extension updates via CDN
5. **Local AI:** Offload parsing and generation to user devices

## Disaster Recovery

- Database backups: daily to S3
- Extension artifacts: backed up in repository
- Configuration: stored in environment variables
- Rollback: git revert + re-deploy
