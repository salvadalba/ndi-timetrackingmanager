const { spawn } = require('child_process');
const puppeteer = require('puppeteer-core');

// Start simple static server
const server = spawn(process.execPath, ['scripts/serve_static.js'], {
  env: process.env,
  stdio: ['ignore', 'pipe', 'pipe'],
});

server.stdout.on('data', d => process.stdout.write(d));
server.stderr.on('data', d => process.stderr.write(d));

(async () => {
  // Wait briefly for server to start
  await new Promise(r => setTimeout(r, 500));

  const launchOptions = { args: ['--no-sandbox', '--disable-setuid-sandbox'] };

  // Resolve chrome path: env.CHROME_PATH -> common system locations
  const fs = require('fs');
  const candidates = [];
  if (process.env.CHROME_PATH) candidates.push(process.env.CHROME_PATH);
  candidates.push('/usr/bin/chromium-browser');
  candidates.push('/usr/bin/chromium');
  candidates.push('/usr/bin/google-chrome-stable');
  candidates.push('/usr/bin/google-chrome');
  candidates.push('/snap/bin/chromium');

  const chromePath = candidates.find(p => p && fs.existsSync(p));
  if (chromePath) {
    console.log('Found Chrome executable at:', chromePath);
    launchOptions.executablePath = chromePath;
  } else {
    console.error('No Chrome/Chromium executable found on PATH or common locations.');
    console.error(
      'Set CHROME_PATH env var to your Chrome/Chromium binary to run e2e with puppeteer-core.',
    );
    process.exit(2);
  }

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:9000', { waitUntil: 'networkidle2' });

    // Basic smoke tests
    // 1. Check title
    const title = await page.title();
    if (!title.toLowerCase().includes('time tracking'))
      throw new Error('Title check failed: ' + title);

    // 2. Open time tracking modal
    await page.click('#timeTrackingFab');
    await page.waitForSelector('#timeTrackingModal.active', { timeout: 2000 });

    // 3. Start timer and ensure timeDisplay updates
    await page.click('#startTimer');
    await page.waitForTimeout(1100);
    const timeText = await page.$eval('#timeDisplay', el => el.textContent);
    if (!/\d{2}:\d{2}:\d{2}/.test(timeText))
      throw new Error('Timer display not updated: ' + timeText);

    // 4. Close modal
    await page.click('#closeTimeModal');
    await page.waitForSelector('#timeTrackingModal.active', { hidden: true, timeout: 2000 });

    console.log('E2E smoke checks passed');
    await browser.close();
    server.kill();
    process.exit(0);
  } catch (err) {
    console.error('E2E failed:', err);
    await browser.close();
    server.kill();
    process.exit(2);
  }
})();
