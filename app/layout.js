import './globals.css'
import resumeData from '../data/resume.json'

const baseLang = (resumeData.en?.basics) ? resumeData.en : resumeData.pt
const name = baseLang.basics.name
const label = baseLang.basics.label
const summary = baseLang.basics.summary

export const metadata = {
  title: `${name} — ${label}`,
  description: summary,
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
