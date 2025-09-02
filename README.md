# Pietro Pugliesi - iOS Developer Portfolio

## 🚀 Instruções Rápidas

### **Desenvolvimento**
```bash
npm install
npm run dev                    # Site localhost:3000
npm run watch-resume           # Monitor automático (outro terminal)
```

### **Gerar PDFs**
```bash
npm run pdf                    # Gera 6 currículos otimizados
```

### **Deploy Produção**
```bash
npm run build-all              # Gera PDFs + build (cria pasta 'out')
# Upload da pasta 'out' no Cloudflare Pages
```

### **Cloudflare Pages**
1. Conectar GitHub repo
2. Build command: `npm run build-all`
3. Build output directory: `out`

## Configuração para Cloudflare Pages

### Comando de Build
Certifique-se de configurar o comando de build no Cloudflare Pages como:

```
npm run build-all
```

### Diretório de Saída
Configure o diretório de saída como:

```
out
```

### Endpoints para Download de PDFs
Os seguintes PDFs estão disponíveis para download direto. Apenas quem possui o link pode acessá-los:

1. **ATS-friendly para vagas com alto volume de candidatos (PT)**:
   - [Download](https://pietro-portfolio.pages.dev/pdfs/download-1)

2. **ATS-friendly para vagas com alto volume de candidatos (EN)**:
   - [Download](https://pietro-portfolio.pages.dev/pdfs/download-2)

3. **Case study detalhado para vagas de liderança técnica (PT)**:
   - [Download](https://pietro-portfolio.pages.dev/pdfs/download-3)

4. **Case study detalhado para vagas de liderança técnica (EN)**:
   - [Download](https://pietro-portfolio.pages.dev/pdfs/download-4)

5. **Skills matrix para vagas com muitas keywords técnicas específicas (PT)**:
   - [Download](https://pietro-portfolio.pages.dev/pdfs/download-5)

6. **Skills matrix para vagas com muitas keywords técnicas específicas (EN)**:
   - [Download](https://pietro-portfolio.pages.dev/pdfs/download-6)

7. **Todos os PDFs em um único arquivo ZIP**:
   - [Download](https://pietro-portfolio.pages.dev/pdfs/download)

---

## 📋 Sobre o Projeto

Sistema de portfólio + 6 currículos automáticos para Senior iOS Developer, otimizado para vagas internacionais 100% remotas.

**Single source of truth:** `data/resume.json`

## 🎯 3 Tipos de Currículo

| Template | Quando Usar |
|----------|-------------|
| **ATS - Alto Volume** | FAANG, startups, empresas grandes |
| **Case Study - Liderança** | Tech Lead, Staff Engineer |
| **Skills Matrix - Keywords** | Vagas com lista extensa de techs |

## 🛠️ Tech Stack

- Next.js 14 + Tailwind CSS
- HTML templates otimizados para PDF
- Scripts Node.js para automação

## 📁 Estrutura

```
├── data/resume.json           # 📊 Dados únicos
├── pdfs/                      # 📄 6 currículos gerados
├── public/pdfs/               # 📱 Download via site
├── scripts/                   # 🤖 Automação
└── out/                       # 🚀 Deploy (após build)
```

## ⚡ Comandos

```bash
npm run dev              # Desenvolvimento
npm run pdf              # Gerar currículos
npm run build-all        # Build completo
npm run watch-resume     # Monitor automático
```

## 🌍 Features

- Site bilíngue (PT/EN) com toggle
- Dark/Light mode automático
- Download inteligente (currículo ATS no idioma correto)
- 6 templates estratégicos para diferentes vagas
- Métricas quantificadas (Pinterest scale)
- ATS-friendly (zero gráficos, fonte Arial)

## 📊 Highlights

- **Pinterest Tech Lead:** 450M+ usuários, 60+ engenheiros
- **Architecture Migration:** Obj-C → Swift/MVVM
- **Remote Leadership:** 4 timezones, 15+ mentees
- **Quality:** 95% code score, 85% test coverage
- **International:** English C1/C2, distributed teams

---

**Otimizado para Senior iOS · Vagas Internacionais · Remote-First**