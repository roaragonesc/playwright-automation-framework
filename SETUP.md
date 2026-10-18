# Setup & configuration — Windows + VS Code

This guide sets up the portfolio repository **playwright-automation-framework** without requiring paid services.

## 1. Prerequisites

1. Install [Node.js LTS](https://nodejs.org/) (includes npm).
2. Install [Git for Windows](https://git-scm.com/downloads/win) and keep VS Code installed.
3. Create a free [GitHub](https://github.com/) account if you don't already have one.
4. Open VS Code → **Terminal → New Terminal** (PowerShell) and check:

```powershell
node -v
npm -v
git --version
```

If a command is not recognized, close and reopen VS Code after installation.

## 2. Open and install

1. Unzip the project, open its folder in VS Code (**File → Open Folder**).
2. Run these commands **inside the project folder**:

```powershell
npm install
npx playwright install chromium
npm run typecheck
```

`npm install` creates `package-lock.json`. **Commit this file** for reproducible CI installs. Never commit `node_modules`.

If PowerShell blocks `npm.ps1`, use `npm.cmd install` (and `npx.cmd` for npx) or switch the VS Code terminal to Command Prompt. No need to weaken execution policy.

## 3. Run tests

```powershell
npm run test:ui
npm run test:api
npm run test:headed
npm run test:report
```

- `test:ui`: Chromium browser automation against the public demo.
- `test:api`: HTTP tests against the demo's documented API.
- `test:report`: open the HTML test report after execution.

**Configuration:** `playwright.config.ts` defines three projects (`ui-chrome`, `ui-edge`, `api`), retries in CI, reports and failure evidence. UI tests run in Chrome and Edge; API tests remain HTTP-only. `.env.example` contains optional URL overrides. To customize, copy `.env.example` to `.env` (do not commit `.env`).

```powershell
Copy-Item .env.example .env
```

## 4. Publish to GitHub

1. On GitHub, create a **public empty repository** named `playwright-automation-framework` (do not add a README on GitHub).
2. From the VS Code terminal, run (replace `YOUR_USERNAME`):

```powershell
git init
git add .
git commit -m "Initial Playwright UI and API framework"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/playwright-automation-framework.git
git push -u origin main
```

If Git asks for your identity, configure it first using `git config --global user.name "Your Name"` and `git config --global user.email "you@example.com"`. GitHub may prompt you to sign in via browser.

Update `OWNER` in the README badge to your GitHub username.

## 5. GitHub Actions

The workflow in `.github/workflows/playwright.yml` runs on pushes, pull requests, and manually. It installs Node, dependencies, Chromium, type-checks and runs tests. It uploads HTML/JUnit evidence as artifacts even if tests fail.

Check **GitHub → repository → Actions → Playwright Tests**. Public repositories using standard GitHub-hosted runners are free under GitHub's published terms. Public demo instability can still fail CI.

## 6. Qase (optional, next phase)

Qase has a limited Free plan distinct from a trial. Create a Free account and project only if its current limits suit you. **Qase reporting is not configured in this starter**. Later we'll add the compatible Qase reporter, map test cases and store `QASE_API_TOKEN` in GitHub **Settings → Secrets and variables → Actions**, never in the repo.

## 7. Troubleshooting

- `node` not found: reinstall Node LTS, restart VS Code.
- Browser executable missing: `npx playwright install chromium`.
- `npm ci` fails in CI: run `npm install` locally, commit `package-lock.json`, and push again.
- UI test times out: retry and inspect the trace/report; demo sites can change or block automation.
- API assertions fail: check [API docs](https://automationexercise.com/api_list), especially the JSON `responseCode` field.
- `git push` fails: confirm remote URL and GitHub authentication.

## 8. Portfolio checklist

- [ ] Typecheck and tests executed locally
- [ ] Public GitHub repo created and README badge fixed
- [ ] GitHub Actions workflow passed (or failures investigated)
- [ ] HTML report and screenshots reviewed
- [ ] Additional real-world test scenarios added
- [ ] Qase Free reporter integrated in a later iteration

No paid license is needed for Playwright, TypeScript, VS Code, Git or this demo website. Keep within GitHub/Qase free-plan limits.
