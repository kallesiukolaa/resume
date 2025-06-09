const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Load your local HTML file
  const filePath = path.resolve(__dirname, 'index.html');
  const fileUrl = `file://${filePath}`;

  await page.goto(fileUrl, {
    waitUntil: 'networkidle0',
  });

   const height = await page.evaluate(() => {
    return document.documentElement.scrollHeight;
  });

  // Generate PDF
  await page.pdf({
    path: 'cv.pdf',
    printBackground: true,
    width: '210mm',
    height: `${height}px`,
    margin: {
      top: '0mm',
      bottom: '0mm',
      left: '0mm',
      right: '0mm',
    },
  });

  console.log('✅ PDF generated as cv.pdf');
  await browser.close();
})();
