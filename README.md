# Sourdough & Pizza Bakery Showcase

Minimal full-stack project built to support a bakery business concept and showcase QA automation skills.

## Stack

- Frontend: React + Vite + Chakra UI
- Backend: Node.js + Express
- Automation: WebdriverIO + Appium

## Features

- Responsive, centered, warm-color minimalist UI
- Sourdough dough calculator (flour, hydration, starter, salt)
- API validation for ingredient totals
- Auth-protected premium section with paid courses and exclusive products
- Checkout flow with mock Romanian payment provider (NETOPIA) for automation
- E2E web test and Appium mobile browser test starter

## Run Locally

1. Install dependencies:

	 npm install

2. Start frontend and backend together:

	 npm run dev

3. Backend health check:

	 http://localhost:4000/api/health

## QA Commands

- API contract tests:

	npm run test:automation:api

- WebdriverIO web tests:

	npm run test:automation:web

- Appium mobile tests (Android emulator + Chrome required):

	npm run test:automation:mobile

	(Preflight now auto-detects Android SDK from common Windows paths and exits with clear setup guidance if missing.)

- Cucumber web BDD tests:

	npm run test:automation:cucumber:web

- Cucumber mobile BDD tests:

	npm run test:automation:cucumber:mobile

- Start standalone Appium server (optional):

	npm run appium

- Full QA pipeline (API + Web):

	npm run test:automation:qa

Legacy aliases (`test:api`, `test:web`, `test:mobile`, `test:qa`, `test:cucumber:*`) are kept for backward compatibility.

## QA Support APIs (for automation)

These endpoints are designed for deterministic automation setup/teardown and are guarded by `x-qa-key`.

- `GET /api/test/catalog` → list available seed scenarios
- `POST /api/test/reset` → reset QA state
- `POST /api/test/seed` with `{ "scenario": "bakery-demo-day" }` → seed deterministic data
- `GET /api/test/state` → inspect current seeded state
- `POST /api/test/calculate/batch` with `{ "items": [...] }` → batch calculation for data-driven assertions

## Premium Commerce APIs (for automation)

These endpoints support authenticated premium-content purchase flows and payment simulation.

- `GET /api/premium/catalog` → list courses, exclusive products, and available payment providers
- `POST /api/premium/checkout` with `{ customer, paymentProvider, items }` → create a pending order
- `POST /api/premium/payment/mock-netopia/charge` with `{ orderId, cardToken }` → simulate successful NETOPIA payment
- `GET /api/premium/orders/:orderId` → retrieve order state for assertions

### QA API auth key

- Header required: `x-qa-key`
- Default key for local use: `qa-local-key`
- Override with env var: `QA_API_KEY`

## Automation Architecture 

All automation lives under one top-level folder:

- `automation/e2e/specs/`: Mocha-based API, web, and mobile scenario specs
- `automation/e2e/pages/`: POM classes (`base`, shared calculator, and platform-specific wrappers)
- `automation/e2e/data/`: deterministic test data for reusable assertions
- `automation/e2e/api/`: HTTP transport and domain API client
- `automation/cucumber/features/`: Gherkin feature files for BDD coverage
- `automation/cucumber/step-definitions/`: Cucumber step implementations
- `automation/cucumber/pageobjects/` and `automation/cucumber/utils/`: UI abstraction and shared fixtures

## Interview Showcase Coverage

- API contract happy-path and negative validation coverage (`automation/e2e/specs/api*.e2e.js`)
- QA endpoint access control and deterministic seed-state lifecycle assertions
- Premium checkout guardrails (unsupported provider, invalid batch data, idempotent payment confirmation)
- Web purchase journey coverage (login → premium cart → checkout → mock payment)
- Cucumber BDD coverage for login positive/negative scenarios and authenticated-route behavior

### Design principles used

- Specs contain assertions and user journey intent only.
- Selectors and interaction details live in page objects.
- Shared data is centralized to avoid magic numbers in specs.
- Web and mobile reuse the same business flows via shared base pages.

## Mobile Setup Notes

1. Install Android Studio + SDK Platform-Tools.
2. Ensure an emulator is available/running (for example Android 14).
3. Ensure Appium Android driver is installed:

	npx appium driver list --installed
	npx appium driver install uiautomator2
	# if already installed
	npx appium driver update uiautomator2

## Build & Lint

- Lint: `npm run lint`
- Production build: `npm run build`
