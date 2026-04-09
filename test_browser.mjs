import puppeteer from 'puppeteer';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto(`file://${path.resolve('index.html')}`);
  await page.waitForTimeout(1000);
  
  // Try to unlock
  await page.evaluate(() => {
    document.getElementById('codeInput').value = "LECTURE2026";
    document.getElementById('unlockBtn').click();
  });
  
  await page.waitForTimeout(1000);
  
  const gridHtml = await page.evaluate(() => document.getElementById('lectureGrid').innerHTML);
  console.log("GRID HTML length:", gridHtml.length);
  
  const appDisplay = await page.evaluate(() => document.getElementById('app').style.display);
  console.log("APP display:", appDisplay);

  await browser.close();
})();
