#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const archiver = require('archiver');

// Read resume data
const resumeData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/resume.json'), 'utf8'));

// Minimal ATS Template - Zero graphics, pure text
function generateATSTemplate(data, lang) {
  const isPortuguese = lang === 'pt';
  
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.basics.name} - Resume</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.4; 
            font-size: 11px;
            color: #000000;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 1in;
        }
        .header { margin-bottom: 20px; }
        .name { font-size: 16pt; font-weight: bold; margin-bottom: 4px; }
        .title { font-size: 12pt; margin-bottom: 8px; }
        .contact { font-size: 10pt; line-height: 1.3; }
        .section { margin-bottom: 16px; }
        .section-title { 
            font-size: 11pt; 
            font-weight: bold; 
            text-transform: uppercase; 
            border-bottom: 1px solid #000000; 
            padding-bottom: 2px; 
            margin-bottom: 10px; 
        }
        .job { margin-bottom: 12px; }
        .job-title { font-weight: bold; font-size: 11pt; }
        .job-company { font-weight: bold; }
        .job-date { float: right; font-size: 10pt; }
        .highlights { margin: 6px 0 0 20px; }
        .highlights li { margin-bottom: 2px; }
        .skills-category { margin-bottom: 8px; }
        .skills-title { font-weight: bold; margin-bottom: 2px; }
        .skills-list { font-size: 10pt; }
        .summary { text-align: justify; margin-bottom: 12px; }
        .education { margin-bottom: 8px; }
        .clear { clear: both; }
        @media print { body { padding: 0.75in; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${data.basics.name}</div>
        <div class="title">${data.basics.label}</div>
        <div class="contact">
            ${data.basics.email} | ${data.basics.phone} | ${data.basics.location.city}, ${data.basics.location.region}, ${data.basics.location.country}<br>
            GitHub: ${data.basics.profiles.find(p => p.network === 'GitHub')?.username} | LinkedIn: ${data.basics.profiles.find(p => p.network === 'LinkedIn')?.username}
        </div>
    </div>

    <div class="section">
        <div class="section-title">${isPortuguese ? 'Resumo Profissional' : 'Professional Summary'}</div>
        <div class="summary">${data.basics.summary}</div>
    </div>

    <div class="section">
        <div class="section-title">${isPortuguese ? 'Experiência Profissional' : 'Professional Experience'}</div>
        ${data.work.map(job => `
        <div class="job">
            <div class="job-title">${job.position}</div>
            <div class="job-date">${new Date(job.startDate).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', { month: 'short', year: 'numeric' })} - ${job.endDate ? new Date(job.endDate).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', { month: 'short', year: 'numeric' }) : (isPortuguese ? 'Atual' : 'Present')}</div>
            <div class="clear"></div>
            <div class="job-company">${job.name}</div>
            <ul class="highlights">
                ${job.highlights.map(highlight => `<li>${highlight.replace(/🎯|🚀|👥|🔧|🧪|♿/g, '')}</li>`).join('')}
            </ul>
        </div>
        `).join('')}
    </div>

    <div class="section">
        <div class="section-title">${isPortuguese ? 'Competências Técnicas' : 'Technical Skills'}</div>
        ${Object.entries(data.skills).map(([category, skills]) => `
        <div class="skills-category">
            <div class="skills-title">${category}:</div>
            <div class="skills-list">${skills.join(', ')}</div>
        </div>
        `).join('')}
    </div>

    <div class="section">
        <div class="section-title">${isPortuguese ? 'Formação' : 'Education'}</div>
        ${data.education.map(edu => `
        <div class="education">
            <strong>${edu.studyType} ${isPortuguese ? 'em' : 'in'} ${edu.area}</strong><br>
            ${edu.institution} | ${new Date(edu.startDate).getFullYear()} - ${new Date(edu.endDate).getFullYear()}
        </div>
        `).join('')}
    </div>
</body>
</html>`;
}

// Case Study Template - Minimal, focus on achievements
function generateCaseStudyTemplate(data, lang) {
  const isPortuguese = lang === 'pt';
  
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.basics.name} - Technical Leadership Resume</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.5; 
            font-size: 11px;
            color: #000000;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 1in;
        }
        .header { text-align: center; margin-bottom: 24px; }
        .name { font-size: 18pt; font-weight: bold; margin-bottom: 4px; }
        .title { font-size: 14pt; margin-bottom: 8px; }
        .contact { font-size: 10pt; }
        .section { margin-bottom: 20px; }
        .section-title { 
            font-size: 12pt; 
            font-weight: bold; 
            text-transform: uppercase; 
            border-bottom: 2px solid #000000; 
            padding-bottom: 2px; 
            margin-bottom: 12px; 
        }
        .case-study {
            border: 1px solid #000000;
            padding: 16px;
            margin-bottom: 16px;
        }
        .case-title {
            font-size: 12pt;
            font-weight: bold;
            margin-bottom: 8px;
        }
        .case-subtitle {
            font-style: italic;
            margin-bottom: 12px;
        }
        .case-section {
            margin-bottom: 10px;
        }
        .case-section-title {
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 4px;
        }
        .job { margin-bottom: 16px; border-bottom: 1px solid #333333; padding-bottom: 10px; }
        .job-title { font-weight: bold; font-size: 12pt; }
        .job-company { font-weight: bold; }
        .job-date { float: right; font-size: 10pt; }
        .highlights { margin: 8px 0 0 20px; }
        .highlights li { margin-bottom: 3px; text-align: justify; }
        .tech-list { font-size: 10pt; margin-top: 6px; }
        .clear { clear: both; }
        .page-break { page-break-before: always; }
        @media print { body { padding: 0.75in; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${data.basics.name}</div>
        <div class="title">${data.basics.label}</div>
        <div class="contact">
            ${data.basics.email} | ${data.basics.phone} | ${data.basics.location.city}, ${data.basics.location.region}, ${data.basics.location.country}<br>
            GitHub: ${data.basics.profiles.find(p => p.network === 'GitHub')?.username} | LinkedIn: ${data.basics.profiles.find(p => p.network === 'LinkedIn')?.username}
        </div>
    </div>

    <div class="section">
        <div class="section-title">${isPortuguese ? 'Perfil Executivo' : 'Executive Profile'}</div>
        <div class="summary">${data.basics.summary}</div>
    </div>

    <div class="section">
        <div class="section-title">${isPortuguese ? 'Caso de Estudo: Liderança Técnica' : 'Case Study: Technical Leadership'}</div>
        <div class="case-study">
            <div class="case-title">${isPortuguese ? 'Migração de Arquitetura em Escala - Pinterest iOS' : 'Architecture Migration at Scale - Pinterest iOS'}</div>
            <div class="case-subtitle">${isPortuguese ? 'Liderança técnica distribuída em equipe global de 60+ engenheiros' : 'Distributed technical leadership across 60+ engineer global team'}</div>
            
            <div class="case-section">
                <div class="case-section-title">${isPortuguese ? 'Desafio' : 'Challenge'}</div>
                <p>${isPortuguese ? 
                    'Modernizar app Pinterest (milhões de usuários) de arquitetura monolítica Objective-C legada para Swift moderno, mantendo estabilidade e performance durante migração crítica.' : 
                    'Modernize Pinterest app (millions of users) from legacy monolithic Objective-C to modern Swift architecture, maintaining stability and performance during critical migration.'}</p>
            </div>
            
            <div class="case-section">
                <div class="case-section-title">${isPortuguese ? 'Solução' : 'Solution'}</div>
                <p>${isPortuguese ? 
                    'Liderei migração gradual para MVVM em Swift, reimplementando telas críticas (Updates, Comments, Home). Estabeleci padrões Clean Code, testes automatizados e cultura de mentoria remota.' : 
                    'Led gradual migration to Swift MVVM, reimplementing critical screens (Updates, Comments, Home). Established Clean Code standards, automated testing, and remote mentorship culture.'}</p>
            </div>
            
            <div class="case-section">
                <div class="case-section-title">${isPortuguese ? 'Resultado' : 'Result'}</div>
                <p>${isPortuguese ? 
                    'Melhoria significativa na qualidade do código, redução no tempo de manutenção, implementação de office hours semanais e onboarding estruturado para novos membros da equipe global.' : 
                    'Significant code quality improvement, reduced maintenance time, implemented weekly office hours and structured onboarding for new global team members.'}</p>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">${isPortuguese ? 'Experiência Técnica Detalhada' : 'Detailed Technical Experience'}</div>
        ${data.work.map(job => `
        <div class="job">
            <div class="job-title">${job.position}</div>
            <div class="job-date">${new Date(job.startDate).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', { month: 'short', year: 'numeric' })} - ${job.endDate ? new Date(job.endDate).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', { month: 'short', year: 'numeric' }) : (isPortuguese ? 'Atual' : 'Present')}</div>
            <div class="clear"></div>
            <div class="job-company">${job.name}</div>
            <ul class="highlights">
                ${job.highlights.map(highlight => `<li>${highlight.replace(/🎯|🚀|👥|🔧|🧪|♿/g, '')}</li>`).join('')}
            </ul>
            <div class="tech-list"><strong>${isPortuguese ? 'Tecnologias' : 'Technologies'}:</strong> ${job.technologies.join(', ')}</div>
        </div>
        `).join('')}
    </div>
</body>
</html>`;
}

// Skills Matrix Template - Professional, clean
function generateHybridSkillsTemplate(data, lang) {
  const isPortuguese = lang === 'pt';
  
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.basics.name} - Skills Matrix Resume</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.4; 
            font-size: 11px;
            color: #000000;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 1in;
        }
        .header { text-align: center; margin-bottom: 20px; }
        .name { font-size: 16pt; font-weight: bold; margin-bottom: 4px; }
        .title { font-size: 12pt; margin-bottom: 8px; }
        .contact { font-size: 10pt; }
        .section { margin-bottom: 18px; }
        .section-title { 
            font-size: 11pt; 
            font-weight: bold; 
            text-transform: uppercase; 
            border-bottom: 1px solid #000000; 
            padding-bottom: 2px; 
            margin-bottom: 10px; 
        }
        .summary { text-align: justify; margin-bottom: 12px; }
        .experience-highlight {
            border: 1px solid #000000;
            padding: 12px;
            margin-bottom: 12px;
        }
        .highlight-company {
            font-weight: bold;
            margin-bottom: 4px;
        }
        .highlight-role {
            font-style: italic;
            margin-bottom: 6px;
        }
        .highlight-achievement {
            text-align: justify;
        }
        .skills-matrix {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 16px;
        }
        .skills-category {
            border: 1px solid #333333;
            padding: 10px;
        }
        .skills-category-title {
            font-weight: bold;
            margin-bottom: 6px;
        }
        .skills-list {
            font-size: 10pt;
            line-height: 1.3;
        }
        .keywords-section {
            text-align: center;
            margin-bottom: 16px;
        }
        .keywords {
            font-size: 10pt;
            font-weight: bold;
        }
        .projects-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }
        .project {
            border: 1px solid #333333;
            padding: 8px;
        }
        .project-name {
            font-weight: bold;
            margin-bottom: 2px;
        }
        .project-desc {
            font-size: 10pt;
            margin-bottom: 4px;
        }
        .project-tech {
            font-size: 9pt;
        }
        @media print { body { padding: 0.75in; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${data.basics.name}</div>
        <div class="title">${data.basics.label}</div>
        <div class="contact">
            ${data.basics.email} | ${data.basics.phone} | ${data.basics.location.city}, ${data.basics.location.region}, ${data.basics.location.country}<br>
            GitHub: ${data.basics.profiles.find(p => p.network === 'GitHub')?.username} | LinkedIn: ${data.basics.profiles.find(p => p.network === 'LinkedIn')?.username}
        </div>
    </div>

    <div class="section">
        <div class="summary">${data.basics.summary}</div>
    </div>

    <div class="section">
        <div class="section-title">${isPortuguese ? 'Destaques da Experiência' : 'Experience Highlights'}</div>
        ${data.work.slice(0, 2).map(job => `
        <div class="experience-highlight">
            <div class="highlight-company">${job.name} - ${job.position}</div>
            <div class="highlight-role">${job.summary}</div>
            <div class="highlight-achievement">${job.highlights[0].replace(/🎯|🚀|👥|🔧|🧪|♿/g, '')}</div>
        </div>
        `).join('')}
    </div>

    <div class="section">
        <div class="section-title">${isPortuguese ? 'Matriz de Competências' : 'Skills Matrix'}</div>
        <div class="skills-matrix">
            ${Object.entries(data.skills).map(([category, skills]) => `
            <div class="skills-category">
                <div class="skills-category-title">${category}</div>
                <div class="skills-list">${skills.join(' | ')}</div>
            </div>
            `).join('')}
        </div>
    </div>

    <div class="section">
        <div class="section-title">${isPortuguese ? 'Palavras-Chave Técnicas' : 'Technical Keywords'}</div>
        <div class="keywords-section">
            <div class="keywords">
                Swift | iOS Development | MVVM Architecture | Tech Lead | Remote Leadership | SwiftUI | 
                Combine | Async/Await | Unit Testing | Pinterest Scale | Code Review | Mentorship | 
                Clean Code | CI/CD | Accessibility | Performance Optimization | Distributed Teams | 
                Cross-timezone Collaboration | Objective-C Migration | App Store
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">${isPortuguese ? 'Projetos Selecionados' : 'Selected Projects'}</div>
        <div class="projects-grid">
            ${data.projects.map(project => `
            <div class="project">
                <div class="project-name">${project.name}</div>
                <div class="project-desc">${project.description}</div>
                <div class="project-tech"><strong>${isPortuguese ? 'Tech' : 'Tech'}:</strong> ${project.technologies.join(', ')}</div>
            </div>
            `).join('')}
        </div>
    </div>

    <div class="section">
        <div class="section-title">${isPortuguese ? 'Formação' : 'Education'}</div>
        ${data.education.map(edu => `
        <div>
            <strong>${edu.studyType} ${isPortuguese ? 'em' : 'in'} ${edu.area}</strong><br>
            ${edu.institution} | ${new Date(edu.startDate).getFullYear()} - ${new Date(edu.endDate).getFullYear()}
        </div>
        `).join('')}
    </div>
</body>
</html>`;
}

// Generate all templates
console.log('🔄 Gerando templates de currículo minimalistas (padrões 2025)...');

const templates = [
  { 
    name: 'pietro-cv-ats-vagasAltoVolume-pt.html', 
    content: generateATSTemplate(resumeData.pt, 'pt'),
    description: 'ATS-friendly para vagas com alto volume de candidatos'
  },
  { 
    name: 'pietro-cv-ats-vagasAltoVolume-en.html', 
    content: generateATSTemplate(resumeData.en, 'en'),
    description: 'ATS-friendly for high-volume job applications'
  },
  { 
    name: 'pietro-cv-casestudy-vagasLideranca-pt.html', 
    content: generateCaseStudyTemplate(resumeData.pt, 'pt'),
    description: 'Case study detalhado para vagas de liderança técnica/Tech Lead'
  },
  { 
    name: 'pietro-cv-casestudy-vagasLideranca-en.html', 
    content: generateCaseStudyTemplate(resumeData.en, 'en'),
    description: 'Detailed case study for technical leadership/Tech Lead positions'
  },
  { 
    name: 'pietro-cv-skills-vagasMuitasKeywords-pt.html', 
    content: generateHybridSkillsTemplate(resumeData.pt, 'pt'),
    description: 'Skills matrix para vagas com muitas keywords técnicas específicas'
  },
  { 
    name: 'pietro-cv-skills-vagasMuitasKeywords-en.html', 
    content: generateHybridSkillsTemplate(resumeData.en, 'en'),
    description: 'Skills matrix for positions with many specific technical keywords'
  }
];

// Ensure directory exists
const outputDir = path.join(__dirname, '../pdfs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write all templates
templates.forEach(template => {
  const filePath = path.join(outputDir, template.name);
  fs.writeFileSync(filePath, template.content);
  console.log(`✅ Gerado: ${template.name}`);
});

console.log('🎉 Templates minimalistas gerados com sucesso!');
console.log(`📁 Arquivos salvos em: ${outputDir}`);
console.log('\n📄 Templates otimizados para Senior Dev 2025:');
console.log('   • Zero gráficos, icons ou decorações');
console.log('   • Fonte Arial/Calibri padrão');
console.log('   • Layout ATS-friendly');
console.log('   • Foco em métricas de impacto');
console.log('   • Design minimalista profissional');
console.log('\n🎯 QUANDO USAR CADA CURRÍCULO:');
templates.forEach(template => {
  console.log(`   • ${template.name}`);
  console.log(`     ↳ ${template.description}\n`);
});

// Generate PDFs using Puppeteer
async function generatePDFs() {
  console.log('🔄 Gerando PDFs de currículos...');

  const templates = [
    { 
      name: 'pietro-cv-ats-vagasAltoVolume-pt.pdf', 
      content: generateATSTemplate(resumeData.pt, 'pt'),
      description: 'ATS-friendly para vagas com alto volume de candidatos'
    },
    { 
      name: 'pietro-cv-ats-vagasAltoVolume-en.pdf', 
      content: generateATSTemplate(resumeData.en, 'en'),
      description: 'ATS-friendly for high-volume job applications'
    },
    { 
      name: 'pietro-cv-casestudy-vagasLideranca-pt.pdf', 
      content: generateCaseStudyTemplate(resumeData.pt, 'pt'),
      description: 'Case study detalhado para vagas de liderança técnica/Tech Lead'
    },
    { 
      name: 'pietro-cv-casestudy-vagasLideranca-en.pdf', 
      content: generateCaseStudyTemplate(resumeData.en, 'en'),
      description: 'Detailed case study for technical leadership/Tech Lead positions'
    },
    { 
      name: 'pietro-cv-skills-vagasMuitasKeywords-pt.pdf', 
      content: generateHybridSkillsTemplate(resumeData.pt, 'pt'),
      description: 'Skills matrix para vagas com muitas keywords técnicas específicas'
    },
    { 
      name: 'pietro-cv-skills-vagasMuitasKeywords-en.pdf', 
      content: generateHybridSkillsTemplate(resumeData.en, 'en'),
      description: 'Skills matrix for positions with many specific technical keywords'
    }
  ];

  const outputDirs = [
    path.join(__dirname, '../pdfs'),
    path.join(__dirname, '../out')
  ];

  for (const dir of outputDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const template of templates) {
    for (const dir of outputDirs) {
      const filePath = path.join(dir, template.name);
      await page.setContent(template.content, { waitUntil: 'load' });
      await page.pdf({ path: filePath, format: 'A4' });
      console.log(`✅ Gerado: ${filePath}`);
    }
  }

  await browser.close();

  // Criar arquivo .zip com todos os PDFs
  const zipPath = path.join(outputDirs[0], 'all-resumes.zip');
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`🎉 Arquivo ZIP criado: ${zipPath} (${archive.pointer()} bytes)`);
  });

  archive.on('error', err => {
    throw err;
  });

  archive.pipe(output);

  templates.forEach(template => {
    const filePath = path.join(outputDirs[0], template.name);
    archive.file(filePath, { name: template.name });
  });

  await archive.finalize();

  console.log('🎉 PDFs gerados com sucesso em todas as pastas!');
}

generatePDFs().catch(err => console.error('Erro ao gerar PDFs:', err));