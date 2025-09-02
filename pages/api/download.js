import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const pdfDir = path.join(process.cwd(), 'out/pdfs');

  if (!fs.existsSync(pdfDir)) {
    return res.status(404).send('<h1>404 - Directory Not Found</h1>');
  }

  const files = fs.readdirSync(pdfDir);

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Download PDFs</title>
    </head>
    <body>
      <h1>Available Files</h1>
      <ul>
        ${files.map(file => `<li><a href="/pdfs/${file}" download>${file}</a></li>`).join('')}
      </ul>
    </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
