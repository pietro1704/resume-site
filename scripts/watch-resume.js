#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const resumePath = path.join(__dirname, '../data/resume.json');

console.log('🔍 Monitorando changes no resume.json...');
console.log('📁 Arquivo: ', resumePath);

// Watch for file changes
fs.watchFile(resumePath, (curr, prev) => {
  console.log('\n📝 Resume.json foi alterado!');
  console.log(`⏰ ${new Date().toLocaleString()}`);
  
  try {
    // Generate new resume templates
    console.log('🔄 Gerando novos templates...');
    execSync('npm run pdf', { stdio: 'inherit' });
    
    // Build the website
    console.log('🏗️  Building website...');
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log('✅ Atualização completa! Website e PDFs atualizados.\n');
    console.log('🔍 Continuando monitoramento...');
    
  } catch (error) {
    console.error('❌ Erro durante atualização:', error.message);
  }
});

console.log('✅ Monitoramento ativo! Edite resume.json para ver atualizações automáticas.');
console.log('⚠️  Para parar o monitoramento, pressione Ctrl+C\n');

// Keep the process running
process.stdin.resume();