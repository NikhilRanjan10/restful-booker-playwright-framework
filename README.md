# Restful Booker — Playwright E2E Automation Framework

A production-grade end-to-end automation framework built with Playwright and JavaScript, targeting the [Restful Booker Platform](https://automationintesting.online) — a hotel booking web application. This framework demonstrates enterprise-level automation patterns including Page Object Model, API layer integration, custom fixtures, data-driven testing, API mocking, cross-role test scenarios, and CI/CD integration.

---

## Table of Contents

- [Framework Overview](#framework-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Running Tests](#running-tests)
- [Framework Features](#framework-features)
- [Test Coverage](#test-coverage)
- [Reporting](#reporting)
- [CI/CD](#cicd)
- [Design Decisions](#design-decisions)

---

## Framework Overview

This framework was built as a learning and demonstration project covering the full spectrum of production-grade Playwright automation. It targets the Restful Booker Platform — a JavaScript-heavy SPA with a public booking interface and an admin panel, backed by a REST API.

The application under test presents real-world automation challenges including dynamic rendering, calendar date pickers, cross-role workflows, and authenticated admin sessions — making it ideal for demonstrating advanced framework patterns.

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [Playwright](https://playwright.dev) | Latest | Browser automation and test runner |
| [Node.js](https://nodejs.org) | 18+ | Runtime |
| [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) | ES2022 | Language |
| [Allure Playwright](https://allurereport.org) | Latest | Test reporting |
| [dotenv](https://github.com/motdotla/dotenv) | Latest | Environment variable management |
| [GitHub Actions](https://github.com/features/actions) | — | CI/CD pipeline |

---

## Project Structure

```
restful-booker/
├── api/
│   ├── apiUtils.js              # Base API class — auth token management
│   ├── roomsApiUtils.js         # Room CRUD operations + teardown
│   ├── bookingApiUtils.js       # Booking CRUD operations + teardown
│   └── messageApiUtils.js       # Message operations + teardown
├── auth/
│   └── adminState.json          # Saved admin session (gitignored)
├── fixtures/
│   └── index.js                 # Custom Playwright fixtures
├── pages/
│   ├── homePage.js              # Public homepage navigation
│   ├── roomsPage.js             # Room listing and selection
│   ├── bookingPage.js           # Reservation form interactions
│   ├── contactUsPage.js         # Contact form interactions
│   ├── locationPage.js          # Location section
│   ├── adminLoginPage.js        # Admin authentication
│   ├── adminRoomsPage.js        # Admin room management
│   ├── adminBookingPage.js      # Admin booking management
│   ├── adminMessagesPage.js     # Admin messages inbox
│   ├── adminBrandingPage.js     # Admin branding settings
│   └── adminReportPage.js       # Admin report calendar
├── testdata/
│   ├── booking/
│   │   ├── bookingPayload.json
│   │   ├── reservationFormValidationData.json
│   │   └── validReservationFormData.json
│   ├── contact/
│   │   ├── contactValidationData.json
│   │   └── validContactFormData.json
│   └── rooms/
│       ├── familyRoomPayload.json
│       └── twinRoomPayload.json
├── tests/
│   ├── admin/
│   │   ├── adminLoginTests.spec.js
│   │   └── adminRoomTests.spec.js
│   ├── booking/
│   │   ├── manageBookingTests.spec.js
│   │   └── reservationFormValidationTests.spec.js
│   ├── contact/
│   │   └── contactFormValidationTests.spec.js
│   ├── crossRole/
│   │   └── crossRoleTests.spec.js
│   └── mockingTests/
│       ├── roomsMockingTests.spec.js
│       ├── brandingMockingTests.spec.js
│       └── authMockingTests.spec.js
├── utils/
│   ├── pageObjectManager.js     # Lazy-initialised page object factory
│   └── dateUtils.js             # Date formatting utilities
├── .env.example                 # Environment variable template
├── .gitignore
├── globalSetup.js               # One-time admin session setup
├── package.json
├── playwright.config.js
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Java 21 (required for Allure CLI)
- Git

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/restful-booker.git
cd restful-booker
```

**2. Install dependencies**

```bash
npm install
```

**3. Install Playwright browsers**

```bash
npx playwright install
```

**4. Install Allure CLI**

```bash
npm install -g allure-commandline
```

**5. Set up environment variables**

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the values:

```
BASE_URL=                    # e.g. https://automationintesting.online
ADMIN_USERNAME=              # admin panel username
ADMIN_PASSWORD=              # admin panel password
HEADLESS=                    # true or false
WORKERS=                     # number of parallel workers
SLOWMO=                      # milliseconds between actions (0 for normal speed)
```

---

## Environment Setup

The framework supports multiple run environments via environment-specific `.env` files:

| File | Purpose | Headless | Workers |
|---|---|---|---|
| `.env.local` | Local development | false | 1 |
| `.env.ci` | CI/CD pipeline | true | 4 |
| `.env.debug` | Debugging with slow motion | false | 1 |

Switch environments using the `ENV` variable:

```bash
ENV=local npm run test
ENV=ci npm run test
ENV=debug npm run test
```

**Note:** On Windows PowerShell use `cross-env`:
```bash
npm install --save-dev cross-env
cross-env ENV=ci npm run test
```

---

## Running Tests

### All Tests

```bash
npm run test
```

### By Environment

```bash
npm run test:local       # local settings
npm run test:ci          # CI settings (headless, 4 workers)
npm run test:debug       # slow motion debug mode
```

### By Tag

```bash
npm run test:smoke       # quick sanity check (~4 tests, ~2 mins)
npm run test:regression  # full suite

```

### Combined Environment + Tag

```bash
cross-env ENV=ci npm run test:smoke
cross-env ENV=ci npm run test:regression
```

### Generate Allure Report

```bash
npm run allure:report    # generate + open in one command
npm run allure:generate  # generate only
npm run allure:open      # open existing report
```

### View Playwright HTML Report

```bash
npm run report
```

---

## Framework Features

### 1. Page Object Model with PageObjectManager

Every page in the application has a dedicated Page Object class encapsulating locators and actions. All page objects are managed through a `PageObjectManager` using lazy initialisation — objects are only created when first requested:

```javascript
const pom = new PageObjectManager(page);
const adminLoginPage = pom.getAdminLoginPage(); // created on first call
const adminLoginPage = pom.getAdminLoginPage(); // returns cached instance
```

### 2. API Layer

Three domain-specific API utility classes extend a base `ApiUtils` class:

- `RoomsApiUtils` — create, find, delete rooms with automatic teardown
- `BookingApiUtils` — create, delete bookings with automatic teardown
- `MessageApiUtils` — find, delete messages with automatic teardown

Each class tracks created resources and deletes them automatically after tests via fixture teardown — no test pollution.

### 3. Custom Fixtures

Playwright's `test` object is extended with three custom fixtures:

```javascript
// pageObjectManager — pre-initialised POM for the current page
test('my test', async ({ pageObjectManager }) => { ... });

// roomsApiUtils — authenticated API context + auto teardown
test('my test', async ({ roomsApiUtils }) => { ... });

// authenticatedPage — page with admin cookie pre-injected
test('my test', async ({ authenticatedPage }) => { ... });
```

### 4. Three Authentication Patterns

The framework demonstrates three distinct approaches to admin authentication:

**Pattern 1 — Cookie injection via API** (`authenticatedPage` fixture)
Gets a fresh token via API and injects it as a cookie before each test.

**Pattern 2 — StorageState per test** (`browser.newContext`)
Loads saved admin session from `auth/adminState.json` for specific tests.

**Pattern 3 — Global Setup** (`globalSetup.js`)
Logs in once before the entire suite runs and saves the session — used for CI/CD performance.

### 5. Data Driven Testing

Form validation tests use JSON-driven data sets — one test function runs multiple scenarios:

```javascript
const validationData = require('../../testdata/contact/contactValidationData.json');

for (const data of validationData) {
    test(`Contact Form Validation: ${data.scenario}`, async ({ page }) => {
        await contactPage.fillForm(data.name, data.email, data.phone, data.subject, data.message);
        for (const error of data.errors) {
            await expect(contactPage.getErrorMessage()).toContainText(error);
        }
    });
}
```

Covers 12 contact form scenarios and 13 reservation form scenarios from JSON files.

### 6. API Response Mocking

Three Playwright route interception patterns demonstrated:

**`route.fulfill()`** — return mock responses:
```javascript
// empty rooms list
await page.route('**/api/room**', route => route.fulfill({
    status: 200,
    body: JSON.stringify({ rooms: [] })
}));
```

**`route.abort()`** — simulate network failure:
```javascript
// auth API unavailable
await page.route('**/api/auth/login**', route => route.abort());
```

**`route.fetch()`** — modify real responses:
```javascript
// remove specific room from real response
const real = await route.fetch();
const body = await real.json();
body.rooms = body.rooms.filter(r => r.type !== 'Single');
await route.fulfill({ response: real, body: JSON.stringify(body) });
```

### 7. Cross-Role Testing

Tests that span public user and admin roles — public action verified in admin panel:

```javascript
// User submits contact form (regular page)
await contactPage.fillForm(data.name, data.email, ...);

// Admin verifies message in inbox (storageState authenticated page)
const adminContext = await browser.newContext({ storageState: 'auth/adminState.json' });
const adminPage = await adminContext.newPage();
await adminMessagePage.clickMessageBySubject(data.subject);
```

### 8. Test Tagging Strategy

Every test is tagged for selective execution:

| Tag | Purpose | Example |
|---|---|---|
| `@smoke` | Quick sanity, run on deployment | Admin login, homepage |
| `@regression` | Full suite, run nightly | All tests |
| `@critical` | Business critical, run before release | E2E booking, cross-role |
| `@admin` | Admin panel tests | Login, room management |
| `@booking` | Booking flow tests | E2E flow, validation |
| `@contact` | Contact form tests | Submission, validation |
| `@mocking` | API mocking tests | Route interception |

### 9. Allure Reporting

Rich visual reports with test steps, screenshots on failure, and suite organisation:

```bash
npm run allure:report
```

### 10. Date Utilities

Reusable date formatting functions for booking and calendar tests:

```javascript
formatDateToYYYYMMDD('28 June 2026')  // → '2026-06-28'
formatDateToMMYYYY('June 2026')        // → '06-2026'
formatDateToMonthYear('2026-06-28')    // → 'June 2026'
```

---

## Test Coverage

### Admin Tests
| Test | Tags |
|---|---|
| Valid admin login | `@smoke @regression @admin` |
| Invalid admin login | `@regression @admin` |
| Create room via API + verify in admin UI | `@regression @admin @api` |
| Create room + booking via API, verify in admin report | `@critical @regression @admin` |
| Submit contact form, verify in admin messages | `@critical @regression @admin` |

### Booking Tests
| Test | Tags |
|---|---|
| E2E booking flow — Single room | `@critical @regression @booking` |
| E2E booking flow — Double room | `@critical @regression @booking` |
| E2E booking flow — Suite room | `@critical @regression @booking` |
| Reservation form validation (13 scenarios) | `@regression @booking @validation` |

### Contact Form Tests
| Test | Tags |
|---|---|
| Contact form validation (12 scenarios) | `@regression @contact @validation` |



### Mocking Tests
| Test | Tags |
|---|---|
| Rooms API returns empty list | `@regression @mocking` |
| Branding API returns server error | `@regression @mocking` |
| Auth API aborted — verify error shown | `@regression @mocking` |
| Remove specific room type from response | `@regression @mocking` |

---

## Reporting

### Playwright HTML Report
Built-in Playwright reporter — best for local debugging:
```bash
npm run report
```

### Allure Report
Rich visual report with steps, categories, and suite organisation:
```bash
npm run allure:report
```

Allure report includes:
- Pass/fail overview with trend history
- Test suite organisation by browser
- Individual test steps with screenshots on failure
- Categories for failure classification
- Timeline view of parallel execution

---

## CI/CD

The framework includes a GitHub Actions workflow that triggers on every push and pull request to `main`.

**Pipeline steps:**
1. Checkout code
2. Set up Node.js
3. Install dependencies
4. Install Playwright browsers
5. Run smoke tests
6. Run full regression suite
7. Upload Allure report as artifact
8. Upload Playwright HTML report as artifact

See `.github/workflows/playwright.yml` for the full pipeline configuration.

---

## Design Decisions

**Why Restful Booker?**
JavaScript-heavy SPA with real-world complexity — dynamic rendering, calendar pickers, cross-role workflows, REST API. More challenging than server-rendered apps.

**Why JavaScript over TypeScript?**
Lower barrier to entry for learning framework patterns. TypeScript refactor is a natural next step once patterns are established.

**Why lazy initialisation in PageObjectManager?**
Only instantiates page objects when first requested — avoids creating 11 objects when a test only needs 2.

**Why composition over inheritance for API utils?**
Each domain utility manages its own authenticated context independently — no shared state between room, booking, and message operations.

**Why three authentication patterns?**
Different scenarios have different needs — per-test cookie injection, saved session loading, and global setup each have valid use cases. Demonstrating all three shows architectural understanding.

**Why data-driven JSON for validation tests?**
Separates test logic from test data — adding new validation scenarios requires only a JSON entry, no code changes.

**Why `route.fetch()` over `route.fulfill()` for selective mocking?**
Preserves real API response structure while modifying specific fields — more realistic than returning entirely fake data.

---

## Known Issues

- Twin room type accepted by API but not rendered on public UI if there are already 3 rooms present — frontend only displays Single, Double, Suite types
- When auth API is aborted, UI shows "Invalid credentials" instead of a network error message — misleading UX
- Booking API accepts non-existent room IDs without validation

---

## Author

Built as a production-grade learning framework demonstrating Playwright E2E automation patterns.