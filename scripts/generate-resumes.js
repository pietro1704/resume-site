#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const archiver = require('archiver');

const resumeData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/resume.json'), 'utf8'));

function formatDate(value, lang) {
  if (!value) return '';
  if (value === 'Present') return lang === 'pt' ? 'Atual' : 'Present';
  const monthsPT = ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];
  const monthsEN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const months = lang === 'pt' ? monthsPT : monthsEN;
  const [year, month] = value.split('-');
  if (month) return `${months[parseInt(month, 10) - 1]} ${year}`;
  return year;
}

// Bug fix: parse year as plain integer to avoid timezone off-by-one
// (e.g. new Date('2018') in GMT-3 returns 2017)
function yearOf(value) {
  return value ? value.split('-')[0] : '';
}

const buildTimestamp = new Date();
const buildStamp = buildTimestamp.toISOString().slice(0, 10).replace(/-/g, '');

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function contactLine(data) {
  const gh = data.basics.profiles.find(p => p.network === 'GitHub')?.url || '';
  const li = data.basics.profiles.find(p => p.network === 'LinkedIn')?.url || '';
  const site = data.basics.url || '';
  return `${data.basics.email} • ${data.basics.phone} • ${data.basics.location.city}, ${data.basics.location.region}, ${data.basics.location.country}<br>` +
    `<a href="${site}">${site.replace(/^https?:\/\//, '')}</a> • ` +
    `<a href="${gh}">github.com/${data.basics.profiles.find(p => p.network === 'GitHub')?.username}</a> • ` +
    `<a href="${li}">linkedin.com/in/${data.basics.profiles.find(p => p.network === 'LinkedIn')?.username}</a>`;
}

function commonStyles() {
  return `
    @page { size: A4; margin: 0.4in; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.3;
      font-size: 9.5pt;
      color: #111;
    }
    a { color: #111; text-decoration: none; }
    .name { font-size: 16pt; font-weight: 700; letter-spacing: -0.01em; }
    .label {
      font-size: 10pt;
      color: #333;
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .contact { font-size: 8.5pt; color: #444; margin-top: 3px; line-height: 1.35; }
    .section { margin-top: 8px; }
    .section-title {
      font-size: 9pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      border-bottom: 1px solid #111;
      padding-bottom: 1px;
      margin-bottom: 4px;
    }
    .summary { text-align: justify; }
    .row { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
    .role { font-weight: 700; font-size: 10pt; }
    .company { font-weight: 600; }
    .date { font-size: 8.5pt; color: #555; white-space: nowrap; }
    ul { margin: 3px 0 0 16px; }
    li { margin-bottom: 1px; }
    .tech { font-size: 8pt; color: #555; margin-top: 3px; }
    .skills-row { margin-bottom: 2px; }
    .skills-cat { font-weight: 700; }
    .education-entry { margin-bottom: 3px; }
  `;
}

function renderHead(title) {
  return `<!DOCTYPE html>
<html><head>
  <meta charset="UTF-8">
  <title>${escapeHtml(title)}</title>
  <style>${commonStyles()}</style>
</head><body>`;
}

function renderHeader(data) {
  return `
  <div>
    <div class="name">${escapeHtml(data.basics.name)}</div>
    <div class="label">${escapeHtml(data.basics.label)}</div>
    <div class="contact">${contactLine(data)}</div>
  </div>`;
}

function renderSummary(data, isPt) {
  return `
  <div class="section">
    <div class="section-title">${isPt ? 'Resumo' : 'Summary'}</div>
    <div class="summary">${escapeHtml(data.basics.summary)}</div>
  </div>`;
}

function renderExperience(data, lang, isPt, opts = {}) {
  const showTech = opts.showTech !== false;
  return `
  <div class="section">
    <div class="section-title">${isPt ? 'Experiência' : 'Experience'}</div>
    ${data.work.map(job => `
      <div style="margin-bottom: 6px;">
        <div class="row">
          <div><span class="role">${escapeHtml(job.position)}</span> — <span class="company">${escapeHtml(job.name)}</span></div>
          <div class="date">${formatDate(job.startDate, lang)} – ${formatDate(job.endDate, lang) || (isPt ? 'Atual' : 'Present')}</div>
        </div>
        <ul>
          ${job.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
        </ul>
        ${showTech && job.technologies ? `<div class="tech"><strong>Stack:</strong> ${job.technologies.map(escapeHtml).join(' · ')}</div>` : ''}
      </div>
    `).join('')}
  </div>`;
}

function renderProjects(data, isPt) {
  if (!data.projects || data.projects.length === 0) return '';
  return `
  <div class="section">
    <div class="section-title">${isPt ? 'Projetos' : 'Projects'}</div>
    ${data.projects.map(p => `
      <div style="margin-bottom: 6px;">
        <div class="row">
          <div><span class="role">${escapeHtml(p.name)}</span></div>
          ${p.url ? `<div class="date"><a href="${escapeHtml(p.url)}">${escapeHtml(p.url.replace(/^https?:\/\//, ''))}</a></div>` : ''}
        </div>
        <div>${escapeHtml(p.description)}</div>
        ${p.technologies ? `<div class="tech"><strong>Stack:</strong> ${p.technologies.map(escapeHtml).join(' · ')}</div>` : ''}
      </div>
    `).join('')}
  </div>`;
}

function renderSkills(data, isPt, opts = {}) {
  const layout = opts.layout || 'inline';
  if (layout === 'matrix') {
    return `
    <div class="section">
      <div class="section-title">${isPt ? 'Competências' : 'Skills'}</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 16px; row-gap: 4px;">
        ${Object.entries(data.skills).map(([cat, items]) => `
          <div class="skills-row"><span class="skills-cat">${escapeHtml(cat)}:</span> ${items.map(escapeHtml).join(', ')}</div>
        `).join('')}
      </div>
    </div>`;
  }
  return `
  <div class="section">
    <div class="section-title">${isPt ? 'Competências' : 'Skills'}</div>
    ${Object.entries(data.skills).map(([cat, items]) => `
      <div class="skills-row"><span class="skills-cat">${escapeHtml(cat)}:</span> ${items.map(escapeHtml).join(', ')}</div>
    `).join('')}
  </div>`;
}

function renderEducation(data, isPt) {
  if (!data.education) return '';
  return `
  <div class="section">
    <div class="section-title">${isPt ? 'Formação' : 'Education'}</div>
    ${data.education.map(edu => `
      <div class="education-entry">
        <div class="row">
          <div><strong>${escapeHtml(edu.studyType)}${edu.area ? ' — ' + escapeHtml(edu.area) : ''}</strong> · ${escapeHtml(edu.institution)}</div>
          <div class="date">${yearOf(edu.startDate)} – ${yearOf(edu.endDate)}</div>
        </div>
        ${edu.highlights ? `<ul>${edu.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('')}
  </div>`;
}

function renderLanguages(data, isPt) {
  if (!data.basics.languages) return '';
  return `
  <div style="margin-top: 6px; font-size: 9pt;">
    <strong>${isPt ? 'Idiomas' : 'Languages'}:</strong> ${data.basics.languages.map(escapeHtml).join(' · ')}
  </div>`;
}

// ---------- TEMPLATES ----------

// 1) ATS template — single column, plain text, ATS-friendly
function generateATSTemplate(data, lang) {
  const isPt = lang === 'pt';
  return renderHead(`${data.basics.name} — Resume`) +
    renderHeader(data) +
    renderSummary(data, isPt) +
    renderExperience(data, lang, isPt) +
    renderSkills(data, isPt, { layout: 'inline' }) +
    renderProjects(data, isPt) +
    renderEducation(data, isPt) +
    renderLanguages(data, isPt) +
    `</body></html>`;
}

// 2) Case study template — adds STAR-style narrative, Education + Projects included
function generateCaseStudyTemplate(data, lang) {
  const isPt = lang === 'pt';
  const caseStudy = `
  <div class="section">
    <div class="section-title">${isPt ? 'Case: Migração de Arquitetura no Pinterest iOS' : 'Case: Pinterest iOS Architecture Migration'}</div>
    <div style="border-left: 3px solid #111; padding-left: 10px;">
      <div style="margin-bottom: 4px;"><strong>${isPt ? 'Contexto' : 'Context'}:</strong> ${isPt
        ? 'App principal do Pinterest (450M+ MAU), arquitetura monolítica em Objective-C; equipe iOS distribuída de 60+ engenheiros.'
        : 'Pinterest main app (450M+ MAU), monolithic Objective-C codebase; 60+ engineer distributed iOS org.'}</div>
      <div style="margin-bottom: 4px;"><strong>${isPt ? 'Ação' : 'Action'}:</strong> ${isPt
        ? 'Reimplementação incremental para Swift/MVVM em features core (Updates, Comments, Home). Liderança em exercício do squad de migração durante férias do tech lead principal — planejamento, code review e alinhamento entre times sem perda de cadência. Adoção de fluxo AI-augmented (Claude Code, Cursor, Codex) para acelerar refactor e geração de testes.'
        : 'Incremental reimplementation to Swift/MVVM on core features (Updates, Comments, Home). Acting tech lead of the migration squad during the lead\'s PTO — planning, code review and cross-team alignment with no slippage. Adopted an AI-augmented workflow (Claude Code, Cursor, Codex) to accelerate refactor and test generation.'}</div>
      <div><strong>${isPt ? 'Resultado' : 'Result'}:</strong> ${isPt
        ? 'Primeiro projeto da migração entregue; segundo em andamento. Cobertura de testes do escopo da equipe subiu de 60% para 85%. Onboarding de novos membros caiu de ~3 meses para ~6 semanas. Conformidade WCAG 2.1 AA nas features sob minha responsabilidade.'
        : 'First migration project delivered; second in progress. Team-scope test coverage raised from 60% to 85%. Onboarding dropped from ~3 months to ~6 weeks. WCAG 2.1 AA compliance on owned features.'}</div>
    </div>
  </div>`;

  return renderHead(`${data.basics.name} — Tech Leadership`) +
    renderHeader(data) +
    renderSummary(data, isPt) +
    caseStudy +
    renderExperience(data, lang, isPt) +
    renderProjects(data, isPt) +
    renderEducation(data, isPt) +
    renderSkills(data, isPt, { layout: 'matrix' }) +
    renderLanguages(data, isPt) +
    `</body></html>`;
}

// 3) Skills matrix template — 2-col skills grid + projects + experience condensed
function generateSkillsTemplate(data, lang) {
  const isPt = lang === 'pt';
  const condensedExperience = `
  <div class="section">
    <div class="section-title">${isPt ? 'Experiência' : 'Experience'}</div>
    ${data.work.map(job => `
      <div style="margin-bottom: 6px;">
        <div class="row">
          <div><span class="role">${escapeHtml(job.position)}</span> — <span class="company">${escapeHtml(job.name)}</span></div>
          <div class="date">${formatDate(job.startDate, lang)} – ${formatDate(job.endDate, lang) || (isPt ? 'Atual' : 'Present')}</div>
        </div>
        <div>${escapeHtml(job.summary)}</div>
        <ul>${job.highlights.slice(0, 3).map(h => `<li>${escapeHtml(h)}</li>`).join('')}</ul>
      </div>
    `).join('')}
  </div>`;

  return renderHead(`${data.basics.name} — Skills Matrix`) +
    renderHeader(data) +
    renderSummary(data, isPt) +
    renderSkills(data, isPt, { layout: 'matrix' }) +
    condensedExperience +
    renderProjects(data, isPt) +
    renderEducation(data, isPt) +
    renderLanguages(data, isPt) +
    `</body></html>`;
}

// ---------- BUILD ----------

async function generatePDFs() {
  console.log('🔄 Gerando PDFs...');

  const templates = [
    { name: 'pietro-cv-ats-vagasAltoVolume-pt.pdf', content: generateATSTemplate(resumeData.pt, 'pt') },
    { name: 'pietro-cv-ats-vagasAltoVolume-en.pdf', content: generateATSTemplate(resumeData.en, 'en') },
    { name: 'pietro-cv-casestudy-vagasLideranca-pt.pdf', content: generateCaseStudyTemplate(resumeData.pt, 'pt') },
    { name: 'pietro-cv-casestudy-vagasLideranca-en.pdf', content: generateCaseStudyTemplate(resumeData.en, 'en') },
    { name: 'pietro-cv-skills-vagasMuitasKeywords-pt.pdf', content: generateSkillsTemplate(resumeData.pt, 'pt') },
    { name: 'pietro-cv-skills-vagasMuitasKeywords-en.pdf', content: generateSkillsTemplate(resumeData.en, 'en') },
  ];

  const outputDirs = [
    path.join(__dirname, '../pdfs'),
    path.join(__dirname, '../out'),
  ];
  outputDirs.forEach(d => fs.existsSync(d) || fs.mkdirSync(d, { recursive: true }));

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  for (const tpl of templates) {
    for (const dir of outputDirs) {
      const filePath = path.join(dir, tpl.name);
      await page.setContent(tpl.content, { waitUntil: 'load' });
      await page.pdf({ path: filePath, format: 'A4', printBackground: true });
      console.log(`✅ ${filePath}`);
    }
  }

  await browser.close();

  // Aliases (general / pt / en) — always use ATS template in correct language
  const ptSrc = path.join(outputDirs[0], 'pietro-cv-ats-vagasAltoVolume-pt.pdf');
  const enSrc = path.join(outputDirs[0], 'pietro-cv-ats-vagasAltoVolume-en.pdf');
  const ptTarget = path.join(outputDirs[0], 'pietro-cv-pt.pdf');
  const enTarget = path.join(outputDirs[0], 'pietro-cv-en.pdf');
  const generalTarget = path.join(outputDirs[0], 'pietro-cv-general.pdf');
  fs.copyFileSync(ptSrc, ptTarget);
  fs.copyFileSync(enSrc, enTarget);
  fs.copyFileSync(ptSrc, generalTarget);
  console.log(`✅ Aliases: pietro-cv-pt.pdf, pietro-cv-en.pdf, pietro-cv-general.pdf`);

  // Mirror to public/pdfs (for site downloads)
  const publicDir = path.join(__dirname, '../public/pdfs');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const mirror = [
    'pietro-cv-pt.pdf',
    'pietro-cv-en.pdf',
    'pietro-cv-general.pdf',
    'pietro-cv-ats-vagasAltoVolume-pt.pdf',
    'pietro-cv-ats-vagasAltoVolume-en.pdf',
    'pietro-cv-casestudy-vagasLideranca-pt.pdf',
    'pietro-cv-casestudy-vagasLideranca-en.pdf',
    'pietro-cv-skills-vagasMuitasKeywords-pt.pdf',
    'pietro-cv-skills-vagasMuitasKeywords-en.pdf',
  ];
  mirror.forEach(name => {
    fs.copyFileSync(path.join(outputDirs[0], name), path.join(publicDir, name));
  });
  console.log(`✅ Espelhado em public/pdfs/`);

  // ZIP with all resumes
  const zipPath = path.join(outputDirs[0], 'all-resumes.zip');
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });
  output.on('close', () => console.log(`🎉 ZIP: ${zipPath} (${archive.pointer()} bytes)`));
  archive.on('error', err => { throw err; });
  archive.pipe(output);
  templates.forEach(t => archive.file(path.join(outputDirs[0], t.name), { name: t.name }));
  await archive.finalize();

  // Cache-buster manifest (site reads buildStamp for ?v= param)
  const manifest = { generatedAt: buildTimestamp.toISOString(), buildStamp };
  [
    path.join(__dirname, '../data/pdf-manifest.json'),
    path.join(publicDir, 'manifest.json'),
  ].forEach(p => {
    fs.writeFileSync(p, JSON.stringify(manifest, null, 2));
    console.log(`✅ Manifest: ${p}`);
  });
}

generatePDFs().catch(err => {
  console.error('Erro ao gerar PDFs:', err);
  process.exit(1);
});
