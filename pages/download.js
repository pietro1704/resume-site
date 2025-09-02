import path from 'path';
import fs from 'fs';

export async function getServerSideProps() {
  const pdfDir = path.join(process.cwd(), 'public/pdfs');
  let files = [];

  if (fs.existsSync(pdfDir)) {
    files = fs.readdirSync(pdfDir);
  }

  return {
    props: {
      files,
    },
  };
}

export default function DownloadPage({ files }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Download PDFs</title>
      </head>
      <body>
        <h1>Available Files</h1>
        <ul>
          {files.map((file) => (
            <li key={file}>
              <a href={`/pdfs/${file}`} download>
                {file}
              </a>
            </li>
          ))}
        </ul>
      </body>
    </html>
  );
}
