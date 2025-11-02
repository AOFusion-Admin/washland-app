const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
  const outDir = path.join(__dirname, 'out');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.setViewport({ width: 1400, height: 900 });

  const url = process.env.URL || 'http://localhost:3000/';
  console.log('Opening', url);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait for client rendering of hero (main element)
  await page.waitForSelector('main', { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(800); // small pause for animations to start

  // Full page screenshot
  const fullPath = path.join(outDir, 'landing-full.png');
  await page.screenshot({ path: fullPath, fullPage: true });
  console.log('Saved full page screenshot:', fullPath);

  // Hero area screenshot (clip to main element)
  const heroHandle = await page.$('main');
  if (heroHandle) {
    const box = await heroHandle.boundingBox();
    if (box) {
      const heroPath = path.join(outDir, 'landing-hero.png');
      await page.screenshot({ path: heroPath, clip: { x: Math.max(0, box.x), y: Math.max(0, box.y), width: Math.min(box.width, 1400), height: Math.min(box.height, 900) } });
      console.log('Saved hero screenshot:', heroPath);
    }
    const heroHtml = await page.evaluate(el => el.outerHTML, heroHandle);
    fs.writeFileSync(path.join(outDir, 'hero-dom.html'), heroHtml, 'utf8');
    console.log('Dumped hero DOM to scripts/out/hero-dom.html');
  } else {
    console.log('No <main> element found to screenshot.');
  }

  await browser.close();
})();
