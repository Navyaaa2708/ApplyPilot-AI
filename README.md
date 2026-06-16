# ApplyPilot AI

> **Your Private Career Copilot**  
> An AI-powered Chrome extension for resume management, ATS optimization, job tracking, and intelligent application assistance.

![ApplyPilot AI](extension/icons/icon128.png)

## ✨ Features

### Core Functionality
- 📄 **Resume Management** – Upload PDF, DOCX, and TXT resumes with automatic parsing
- 🎯 **ATS Scoring** – Get real-time compatibility scores for job postings
- 🔍 **Job Analysis** – Extract company, role, skills, and requirements automatically
- ✏️ **Resume Optimization** – AI-powered tailoring for each job description
- 📝 **Cover Letter Generation** – Create personalized, ATS-friendly cover letters
- 📊 **Application Tracking** – Monitor your pipeline with status, dates, and notes
- 💡 **Career Insights** – Skill gap analysis, market demand, and growth recommendations
- 🤖 **Local AI Mode** – Use Ollama for privacy-first, on-device processing

### Supported Job Boards
- LinkedIn
- Indeed
- Naukri
- Wellfound
- Greenhouse
- Lever
- Ashby
- Workday

### Privacy & Security
- ✅ **Open Source** – Fully transparent, community-driven
- 🔐 **Encrypted** – End-to-end encryption for sensitive data
- 🚫 **No Tracking** – No hidden analytics or credential harvesting
- 🌐 **Offline Support** – Local AI mode keeps data on your device
- ☁️ **Optional Cloud** – Sync across devices with encrypted backend

## 🚀 Quick Start

### Chrome Extension (Development)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ApplyPilot.git
   cd ApplyPilot
   ```

2. Load the extension in Chrome:
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension/` folder

3. Open the extension popup and upload a resume

### Backend API (Local Development)

```bash
cd backend
npm install
cp .env.example .env
# Configure DATABASE_URL and REDIS_URL
npm run dev
```

The API will start on `http://localhost:4000`

## 📋 Architecture

```
ApplyPilot AI
├── extension/                 # Chrome extension (content, popup, dashboard)
│   ├── background/           # Service worker and event handlers
│   ├── content/              # Job scraping and form autofill
│   ├── popup/                # Main UI interface
│   ├── dashboard/            # Application pipeline & analytics
│   ├── options/              # Settings and local AI config
│   ├── ai/                   # AI provider gateway
│   ├── services/             # API client and helpers
│   ├── utils/                # Constants, storage, sanitization
│   └── manifest.json         # Extension manifest (MV3)
├── backend/                  # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── app.ts           # Express application setup
│   │   ├── index.ts         # Server entrypoint
│   │   ├── routes/          # API endpoints
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── models/          # Data types
│   │   ├── middleware/      # Auth, error handling, logging
│   │   ├── config/          # Database, Redis, environment
│   │   └── utils/           # Helpers, logger, telemetry
│   ├── database-schema.sql  # PostgreSQL DDL
│   ├── tsconfig.json        # TypeScript config
│   ├── package.json         # Dependencies
│   └── jest.config.js       # Test configuration
├── tests/                    # Unit, integration, E2E tests
├── docs/                     # Documentation
└── .github/                  # CI/CD workflows
```

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES2020)
- Manifest V3 compliant
- No external UI frameworks (lightweight)

### Backend
- Node.js 18+
- Express.js
- TypeScript
- PostgreSQL
- Redis

### AI
- **Open Source Models:** Llama 3.3, Qwen 3, DeepSeek, Gemma, Phi, Mistral
- **Local Inference:** Ollama, vLLM
- **Cloud Inference:** Together AI, Groq
- **Embeddings:** BGE-M3, Nomic Embed, E5

## 📦 Installation

### Chrome Web Store (Coming Soon)
Search for "ApplyPilot AI" and click Install

### Development Mode
See "Quick Start" above

## 📚 Documentation

- [Architecture](architecture.md) – System design and components
- [System Design](system-design.md) – Data models and API contracts
- [Deployment Guide](DEPLOYMENT.md) – Production setup for Railway/Render
- [Privacy Policy](PRIVACY_POLICY.md) – Data handling and user rights
- [Terms of Service](TERMS_OF_SERVICE.md) – Legal agreement
- [Contributing Guide](CONTRIBUTING.md) – How to contribute

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Extension Tests
- Tested on Chrome 90+
- Tested on LinkedIn, Indeed, Naukri job postings
- Manual E2E testing for form autofill

## 🔐 Security

- **CSP Enforced:** No inline scripts or unsafe DOM manipulation
- **HTTPS Only:** All API communication encrypted
- **Input Validation:** Strong type checking and sanitization
- **OWASP Compliant:** Protection against XSS, CSRF, SQL injection
- **Regular Updates:** Dependencies audited weekly

See [DEPLOYMENT.md](DEPLOYMENT.md) for security checklist.

## 📊 Performance

- **Popup Load:** < 1 second
- **ATS Analysis:** < 3 seconds
- **Resume Parsing:** < 5 seconds
- **Form Autofill:** < 500ms

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Areas for Contribution
- Job board integrations
- AI model improvements
- Performance optimization
- Accessibility enhancements
- Documentation
- Testing

## 📄 License

ApplyPilot AI is licensed under the MIT License. See LICENSE for details.

## 💬 Community

- **GitHub Issues:** Report bugs and suggest features
- **Discussions:** Ask questions and share ideas
- **Email:** hello@applypilot.ai

## 🙏 Acknowledgments

- Open source AI models (Llama, Qwen, Mistral, etc.)
- Job board parsers inspired by community tools
- Contributors and testers

---

**Made with ❤️ by the ApplyPilot AI community**
