const axios = require('axios');
const cheerio = require('cheerio');
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
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month and pad with 0 if needed
  const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with 0 if needed
  const year = date.getFullYear();
  return `${month}-${day}-${year}`; // Return formatted date
}

const url = 'https://techyhigher.com/gametwist-slots-free-coins/';
const currentDate = getCurrentDate();
const dir = 'links-json';
const filePath = path.join(dir, 'gametwist.json');
const htmlFilePath = path.join('_includes', 'gametwist.html');

async function main() {
  try {
    let existingLinks = [];
    if (await fs.access(filePath).then(() => true).catch(() => false)) {
      try {
        const fileData = await fs.readFile(filePath, 'utf8');
        if (fileData) {
          existingLinks = JSON.parse(fileData);
        }
      } catch (error) {
        console.error('Error reading existing links:', error);
      }
    }

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const newLinks = [];

    $('a[href*="bit.ly"]').each((index, element) => {
      const link = $(element).attr('href');
      const existingLink = existingLinks.find(l => l.href === link);
      const date = existingLink ? existingLink.date : currentDate;
      newLinks.push({ href: link, date: date });
    });

    // Combine new links with existing links, keeping the older dates if they exist
    const combinedLinks = [...newLinks, ...existingLinks]
      .reduce((acc, link) => {
        if (!acc.find(({ href }) => href === link.href)) {
          acc.push(link);
        }
        return acc;
      }, [])
      .slice(0, 100); // Limit to 100 links

    console.log('Final links:', combinedLinks);

    if (!await fs.access(dir).then(() => true).catch(() => false)) {
      await fs.mkdir(dir);
    }

    await fs.writeFile(filePath, JSON.stringify(combinedLinks, null, 2), 'utf8');

    // Generate HTML file with the custom date format and text
    let htmlContent = '<ul class="list-group mt-3 mb-4">\n';
    combinedLinks.forEach(link => {
      const formattedDate = formatDateCustom(link.date); // Format date as MM-DD-YYYY
      htmlContent += `  <li class="list-group-item d-flex justify-content-between align-items-center">\n`;
      htmlContent += `    <span>Free Coins ${formattedDate}</span>\n`; // Custom text with formatted date
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