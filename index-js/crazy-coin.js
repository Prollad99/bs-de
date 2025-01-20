const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Function to get the current date in YYYY-MM-DD format
function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Function to format the date in "MM-DD-YYYY" format
function formatDateCustom(dateString) {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
}

const url = 'https://dmartgroup.com/get_data.php?show=OUYOSU';
const currentDate = getCurrentDate();
const dir = 'links-json';
const filePath = path.join(dir, 'crazy-coin.json');
const htmlFilePath = path.join('_includes', 'crazy-coin.html');

async function main() {
  try {
    // Check for existing links
    let existingLinks = [];
    if (await fs.access(filePath).then(() => true).catch(() => false)) {
      const fileData = await fs.readFile(filePath, 'utf8');
      if (fileData) {
        existingLinks = JSON.parse(fileData);
      }
    }

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new', // Use the new headless mode
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Disable sandbox for CI/CD
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Extract links
    const newLinks = await page.evaluate(() => {
      const links = [];
      document.querySelectorAll('a[data-pl]').forEach((element) => {
        const href = element.getAttribute('data-pl');
        if (href) {
          links.push({ href, date: new Date().toISOString().split('T')[0] });
        }
      });
      return links;
    });

    await browser.close();

    // Combine new links with existing ones
    const combinedLinks = [...newLinks, ...existingLinks]
      .reduce((acc, link) => {
        if (!acc.find(({ href }) => href === link.href)) {
          acc.push(link);
        }
        return acc;
      }, [])
      .slice(0, 100); // Limit to 100 links

    console.log('Final links:', combinedLinks);

    // Ensure output directory exists
    if (!await fs.access(dir).then(() => true).catch(() => false)) {
      await fs.mkdir(dir);
    }

    // Save combined links to JSON
    await fs.writeFile(filePath, JSON.stringify(combinedLinks, null, 2), 'utf8');

    // Generate HTML file with custom date format
    let htmlContent = '<ul class="list-group mt-3 mb-4">\n';
    combinedLinks.forEach(link => {
      const formattedDate = formatDateCustom(link.date);
      htmlContent += `  <li class="list-group-item d-flex justify-content-between align-items-center">\n`;
      htmlContent += `    <span>Crazy Coins Free Spins ${formattedDate}</span>\n`;
      htmlContent += `    <a href="${link.href}" class="btn btn-primary btn-sm">Sammeln</a>\n`;
      htmlContent += `  </li>\n`;
    });
    htmlContent += '</ul>';

    await fs.writeFile(htmlFilePath, htmlContent, 'utf8');
    console.log(`HTML file saved to ${htmlFilePath}`);
  } catch (err) {
    console.error('Error fetching links:', err);
    process.exit(1);
  }
}

main();