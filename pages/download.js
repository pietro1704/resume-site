import path from 'path';
import fs from 'fs';
import Head from 'next/head';

export async function getStaticProps() {
  const pdfDir = path.join(process.cwd(), 'public/pdfs');
  let files = [];

  if (fs.existsSync(pdfDir)) {
    files = fs.readdirSync(pdfDir).filter(file => file.endsWith('.pdf'));
  }

  return {
    props: {
      files,
    },
  };
}

export default function DownloadPage({ files }) {
  return (
    <>
      <Head>
        <title>Index of /download</title>
        <style>{`
          body { 
            font-family: monospace; 
            margin: 20px; 
            background: white;
            color: black;
          }
          h1 { 
            font-size: 18px; 
            font-weight: normal; 
            margin-bottom: 20px;
          }
          hr { 
            border: none; 
            border-top: 1px solid #ccc; 
            margin: 10px 0; 
          }
          pre { 
            font-family: monospace; 
            line-height: 1.2;
          }
          a { 
            color: blue; 
            text-decoration: underline; 
          }
          a:visited { 
            color: purple; 
          }
        `}</style>
      </Head>
      <h1>Index of /download</h1>
      <hr />
      <pre>
        <a href="../">../</a>{'\n'}
        {files.map((file) => (
          <span key={file}>
            <a href={`/pdfs/${file}`}>{file}</a>{'\n'}
          </span>
        ))}
      </pre>
      <hr />
    </>
  );
}
