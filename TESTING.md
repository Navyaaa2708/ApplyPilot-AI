# ApplyPilot AI - Testing Guide

## Unit Tests (Backend Services)

### Running All Tests
```bash
cd backend
npm test
```

### Running Specific Test File
```bash
npm test -- src/services/auth.service.test.ts
```

### Coverage Report
```bash
npm test -- --coverage
```

## Integration Tests

### Database Tests
```bash
npm test -- src/services/resume.service.test.ts
npm test -- src/services/application.service.test.ts
```

### API Endpoint Tests
```bash
npm test -- src/routes/auth.routes.test.ts
npm test -- src/routes/resume.routes.test.ts
npm test -- src/routes/ats.routes.test.ts
npm test -- src/routes/application.routes.test.ts
```

## E2E Tests (Extension)

### Prerequisites
```bash
npm install -D @playwright/test
```

### Running E2E Tests
```bash
npm run test:e2e
```

### Test Scenarios

#### Resume Upload and Analysis
1. Open extension popup
2. Click "Choose File"
3. Select sample resume
4. Verify parsed fields (name, email, phone, skills)
5. Verify confirmation message

#### Job Analysis
1. Navigate to LinkedIn job posting
2. Click "Analyze Job"
3. Verify extracted job data displays
4. Verify ATS score calculated
5. Verify recommendations shown

#### Form Autofill
1. Open job application form
2. Click extension icon
3. Select resume
4. Click "Fill Form"
5. Verify fields populated correctly
6. **Manual step:** Verify NO auto-submission occurs
7. Review populated data
8. Submit manually

#### Dashboard Pipeline
1. Open dashboard
2. Verify application list displays
3. Click status dropdown
4. Change status (e.g., Applied → Interview)
5. Verify status updated
6. Verify metrics recalculated

## Manual Testing Checklist

### Job Board Compatibility

- [ ] **LinkedIn Jobs**
  - [ ] Job data extraction works
  - [ ] "Analyze Job" button appears
  - [ ] ATS score displays

- [ ] **Indeed**
  - [ ] Job data extraction works
  - [ ] Resume suggestions display

- [ ] **Naukri**
  - [ ] Job data extraction works
  - [ ] Skill extraction accurate

- [ ] **Wellfound (AngelList Talent)**
  - [ ] Startup/job details extracted
  - [ ] Apply button preserved

- [ ] **Greenhouse**
  - [ ] Application form autofill works
  - [ ] No interference with application flow

- [ ] **Lever**
  - [ ] Job parsing accurate
  - [ ] Custom fields handled

- [ ] **Ashby**
  - [ ] Application form recognized
  - [ ] Field mapping correct

- [ ] **Workday**
  - [ ] Complex form handling
  - [ ] Required fields validated

### Extension Features

- [ ] **Resume Upload**
  - [ ] PDF parsing works
  - [ ] DOCX parsing works
  - [ ] TXT parsing works
  - [ ] Large files (>5MB) handled gracefully
  - [ ] Invalid files rejected with clear error

- [ ] **ATS Analysis**
  - [ ] Score range 0-100
  - [ ] Keyword matching accurate
  - [ ] Skill detection working
  - [ ] Recommendations relevant

- [ ] **Resume Optimization**
  - [ ] Generated resume maintains structure
  - [ ] Keywords added appropriately
  - [ ] Doesn't over-optimize
  - [ ] Export works (PDF, DOCX)

- [ ] **Cover Letter Generation**
  - [ ] Generated in <10 seconds
  - [ ] Content relevant to job/company
  - [ ] ATS-friendly formatting
  - [ ] Can be customized in popup

- [ ] **Application Tracker**
  - [ ] Adds applications correctly
  - [ ] Status updates save
  - [ ] Notes persist
  - [ ] Metrics calculate accurately
  - [ ] Export to CSV works

- [ ] **Local AI Mode**
  - [ ] Ollama connection test works
  - [ ] Model selection works
  - [ ] Resume parsing uses local AI
  - [ ] No data sent to cloud

### Security Testing

- [ ] **Form Autofill**
  - [ ] Requires explicit user interaction
  - [ ] No auto-submission
  - [ ] Respects form requirements
  - [ ] Handles multi-page forms

- [ ] **Data Privacy**
  - [ ] Resumes stored encrypted
  - [ ] No tracking cookies set
  - [ ] No console errors for CSP violations
  - [ ] HTTPS enforced for API calls

- [ ] **Input Validation**
  - [ ] SQL injection attempts rejected
  - [ ] XSS payloads sanitized
  - [ ] Invalid file types rejected
  - [ ] File size limits enforced

### Performance Testing

```bash
npm install -D lighthouse
lighthouse https://localhost:4000 --headless
```

**Targets:**
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### Browser Compatibility

- [ ] Chrome 90+
- [ ] Chrome 120+ (latest)
- [ ] Edge 90+ (Chromium-based)
- [ ] Brave (Chromium-based)
- [ ] Vivaldi (Chromium-based)

### Accessibility Testing

```bash
npm install -D @axe-core/playwright
npm run test:a11y
```

**Requirements:**
- WCAG 2.1 AA compliance
- Keyboard navigation works
- Screen reader compatible
- Color contrast > 4.5:1
- Focus indicators visible

## Regression Testing

### Before Each Release
1. Run full test suite: `npm test`
2. Run E2E tests: `npm run test:e2e`
3. Run accessibility tests: `npm run test:a11y`
4. Manual testing on all supported job boards
5. Performance audit with Lighthouse
6. Security audit with npm audit

### Continuous Integration
GitHub Actions runs all tests automatically on:
- Push to main branch
- Pull requests
- Scheduled daily at 2 AM UTC

## Performance Profiling

### Backend Profiling
```bash
node --prof backend/dist/index.js
# Run some requests...
node --prof-process isolate-*.log > results.txt
```

### Extension Profiling
1. Open DevTools (F12)
2. Go to Performance tab
3. Click record
4. Perform action
5. Stop recording
6. Analyze timeline for bottlenecks

## Load Testing

```bash
npm install -D artillery

artillery run load-test.yml
```

**Targets:**
- 100 concurrent users
- 1000 requests/minute
- 99th percentile response time < 500ms

## Stress Testing

```bash
# Simulate high load
artillery run stress-test.yml
```

**Limits:**
- Database connection pool: 10 (configured)
- Memory usage: < 500MB per instance
- CPU usage: < 80%
