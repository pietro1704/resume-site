# Contributing

Thanks for taking the time to look. This is a personal resume system, but improvements and new templates are welcome.

## Local setup

```bash
git clone https://github.com/pietro1704/resume-site.git
cd resume-site
npm install
npm run pdf      # builds PDFs from data/resume.example.json
npm run dev      # starts Next.js on localhost:3000
```

The build picks up `data/resume.json` if present (gitignored), otherwise it falls back to `data/resume.example.json`. See [README › Getting started](README.md#getting-started).

## Adding a new PDF template

1. Open `scripts/generate-resumes.js`.
2. Compose a new `generateXxxTemplate(data, lang)` function using the existing `renderHeader`, `renderExperience`, `renderEducation`, `renderSkills`, `renderProjects`, `renderLanguages` helpers (or add new ones).
3. Register it in the `templates` array near the bottom of the file.
4. `npm run pdf` and inspect the output in `pdfs/<your-template>.pdf`.

Useful checks before opening a PR:
- `pdfinfo pdfs/<your-template>.pdf | grep Pages` — keep ATS-friendly variants to a single page when possible.
- Open the PDF in Preview and run a quick text-extraction sanity check: `pdftotext pdfs/<your-template>.pdf -`.

## Updating the web portfolio

`app/page.js` reads from `data/resume.json` directly. Avoid hardcoding personal data; if a new field is needed, add it to `resume.example.json` first so the placeholder stays consistent.

## Pull requests

- Keep PRs small and focused.
- The CI workflow at `.github/workflows/ci.yml` runs `npm run build` against the example data and asserts that all templates produce a non-empty PDF.
- Conventional commit messages are appreciated but not required.

## Reporting issues

If you spot a layout regression in a PDF, please attach the rendered file (or a screenshot) to the issue.
