const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

// Funktion, um das aktuelle Datum im Format YYYY-MM-DD zu erhalten
function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Funktion, um das Datum im Format "MM-DD-YYYY" zu formatieren
function formatDateCustom(dateString) {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Monat holen und mit 0 auffüllen, falls nötig
  const day = String(date.getDate()).padStart(2, '0'); // Tag holen und mit 0 auffüllen, falls nötig
  const year = date.getFullYear();
  return `${month}-${day}-${year}`; // Formatiertes Datum zurückgeben
}

const url = 'https://nueva-temporada.com/en/coin-master-free-spins-today/';
const currentDate = getCurrentDate();
const dir = 'links-json';
const filePath = path.join(dir, 'coin-master.json');
const htmlFilePath = path.join('_includes', 'coin-master.html');

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
        console.error('Fehler beim Lesen der bestehenden Links:', error);
      }
    }

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const newLinks = [];

    $('a[href*="static.moonactive.net"]').each((index, element) => {
      const link = $(element).attr('href');
      const existingLink = existingLinks.find(l => l.href === link);
      const date = existingLink ? existingLink.date : currentDate;
      newLinks.push({ href: link, date: date });
    });

    // Neue Links mit bestehenden Links kombinieren, wobei die älteren Daten beibehalten werden, wenn sie existieren
    const combinedLinks = [...newLinks, ...existingLinks]
      .reduce((acc, link) => {
        if (!acc.find(({ href }) => href === link.href)) {
          acc.push(link);
        }
        return acc;
      }, [])
      .slice(0, 100); // Begrenzung auf 100 Links

    console.log('Finale Links:', combinedLinks);

    if (!await fs.access(dir).then(() => true).catch(() => false)) {
      await fs.mkdir(dir);
    }

    await fs.writeFile(filePath, JSON.stringify(combinedLinks, null, 2), 'utf8');

    // HTML-Datei mit dem benutzerdefinierten Datumsformat und Text generieren
    let htmlContent = '<ul class="list-group mt-3 mb-4">\n';
    combinedLinks.forEach(link => {
      const formattedDate = formatDateCustom(link.date); // Datum im Format MM-DD-YYYY formatieren
      htmlContent += `  <li class="list-group-item d-flex justify-content-between align-items-center">\n`;
      htmlContent += `    <span>Coin Master Spin Link ${formattedDate}</span>\n`; // Benutzerdefinierter Text mit formatiertem Datum
      htmlContent += `    <a href="${link.href}" class="btn btn-primary btn-sm">Sammeln</a>\n`;
      htmlContent += `  </li>\n`;
    });
    htmlContent += '</ul>';

    await fs.writeFile(htmlFilePath, htmlContent, 'utf8');
    console.log(`HTML-Datei wurde gespeichert unter ${htmlFilePath}`);
  } catch (err) {
    console.error('Fehler beim Abrufen der Links:', err);
    process.exit(1);
  }
}

main();