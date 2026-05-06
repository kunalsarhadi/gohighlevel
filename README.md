# gohighlevel
mfg-website

## PDF Guide

`assets/CMHC-MLI-Select-Investor-Guide.pdf` is a static PDF snapshot of `guide.html`.

**To regenerate after updating guide.html:**

```bash
cd /home/user/multifamilydeals
node generate-pdf.js
git add assets/CMHC-MLI-Select-Investor-Guide.pdf
git commit -m "regen: update investor guide PDF"
git push origin main
```

Requires Node.js and the `puppeteer` dev dependency (`npm install` to restore if needed).
