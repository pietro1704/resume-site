#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📄 Copiando currículos ATS para pasta public...');

const sourceDir = path.join(__dirname, '../pdfs');
const publicDir = path.join(__dirname, '../public/pdfs');

// Criar diretório público se não existir
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Copiar apenas os arquivos ATS (para download geral)
const atsFiles = [
  'pietro-cv-ats-vagasAltoVolume-pt.html',
  'pietro-cv-ats-vagasAltoVolume-en.html'
];

atsFiles.forEach(fileName => {
  const sourcePath = path.join(sourceDir, fileName);
  const destPath = path.join(publicDir, fileName);
  
  try {
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Copiado: ${fileName}`);
    } else {
      console.log(`⚠️  Arquivo não encontrado: ${fileName}`);
    }
  } catch (error) {
    console.error(`❌ Erro ao copiar ${fileName}:`, error.message);
  }
});

console.log('🎉 Currículos ATS disponibilizados para download via website!');