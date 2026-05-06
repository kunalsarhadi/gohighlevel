const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  const filePath = path.resolve(__dirname, 'guide.html');
  await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait a bit for any fonts/styles to settle
  await new Promise(r => setTimeout(r, 2000));

  const outputPath = path.resolve(__dirname, 'assets/CMHC-MLI-Select-Investor-Guide.pdf');

  await page.pdf({
    path: outputPath,
    format: 'Letter',
    margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
    printBackground: true,
  });

  await browser.close();

  const fs = require('fs');
  const stats = fs.statSync(outputPath);
  const fileSizeKB = (stats.size / 1024).toFixed(1);
  console.log(`PDF generated: ${outputPath}`);
  console.log(`File size: ${fileSizeKB} KB`);
})();
