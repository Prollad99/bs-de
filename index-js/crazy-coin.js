const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

// Helper functions
function getCurrentDate() {
  const date = new Date();
  return date.toISOString().split('T')[0];
}

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

async function fetchLinks() {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  const links = [];
  $('a[data-pl]').each((_, element) => {
    const href = $(element).attr('data-pl');
    if (href) {
      links.push({ href, date: currentDate });
    }
  });

  return links;
}

async function main() {
  try {
    let existingLinks = [];
    if (await fs.access(filePath).then(() => true).catch(() => false)) {
      const fileData = await fs.readFile(filePath, 'utf8');
      if (fileData) existingLinks = JSON.parse(fileData);
    }

    const newLinks = await fetchLinks();

    const combinedLinks = [...newLinks, ...existingLinks]
      .reduce((acc, link) => {
        if (!acc.find(({ href }) => href === link.href)) acc.push(link);
        return acc;
      }, [])
      .slice(0, 100);

    console.log('Final links:', combinedLinks);

    if (!await fs.access(dir).then(() => true).catch(() => false)) {
      await fs.mkdir(dir);
    }

    await fs.writeFile(filePath, JSON.stringify(combinedLinks, null, 2), 'utf8');

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