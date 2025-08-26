const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const cvFileName = 'cv.pdf';

//Take a backup
const joined = cvFileName.substring(0, cvFileName.lastIndexOf('.')) + '_BACK' + cvFileName.substring(cvFileName.lastIndexOf('.'), cvFileName.length)
fs.copyFileSync(cvFileName, joined, fs.constants.COPYFILE_FICLONE);

// We want to have a new creation date in order to navigate the file conveniently 
fs.unlinkSync(cvFileName);

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
    path: cvFileName,
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
