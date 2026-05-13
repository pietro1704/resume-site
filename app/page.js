'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiPhone,
  FiMapPin,
  FiExternalLink,
  FiMoon,
  FiSun,
  FiDownload,
  FiArrowRight,
  FiCalendar,
  FiBriefcase,
  FiGlobe,
  FiChevronDown
} from 'react-icons/fi'
import resumeData from '../data/resume.json'
import pdfManifest from '../data/pdf-manifest.json'

const LANGUAGES = [
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
]

export default function Home() {
  const [currentLang, setCurrentLang] = useState('en')
  const [darkMode, setDarkMode] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const data = resumeData[currentLang]

  useEffect(() => {
    const browserLang = navigator.language || navigator.userLanguage
    setCurrentLang(browserLang.startsWith('pt') ? 'pt' : 'en')
    setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const t = (pt, en) => currentLang === 'pt' ? pt : en

  const formatPeriod = (start, end) => {
    const months = currentLang === 'pt'
      ? ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const fmt = (v) => {
      if (!v) return null
      if (v === 'Present') return t('Atual', 'Present')
      const [year, month] = v.split('-')
      return month ? `${months[parseInt(month, 10) - 1]} ${year}` : year
    }
    return `${fmt(start)} — ${fmt(end) || t('Atual', 'Present')}`
  }

  const downloadPDF = (lang) => {
    const slug = pdfManifest?.slug || 'resume'
    const safeName = (data.basics.name || 'resume').replace(/\s+/g, '_')
    const link = document.createElement('a')
    link.href = `/pdfs/${slug}-cv-${lang}.pdf?v=${pdfManifest?.buildStamp || Date.now()}`
    link.download = `${safeName}_CV_${lang.toUpperCase()}.pdf`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const smoothScrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' })
  }

  const stats = [
    { value: '450M+', label: t('Usuários ativos', 'Monthly active users') },
    { value: '7+', label: t('Anos de experiência', 'Years of experience') },
    { value: '60→85%', label: t('Cobertura de testes', 'Test coverage') },
    { value: '100+', label: t('PRs revisados', 'PRs reviewed') },
  ]

  const navItems = [
    { id: 'experience', label: t('Experiência', 'Experience') },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: t('Projetos', 'Projects') },
    { id: 'education', label: t('Formação', 'Education') },
    { id: 'contact', label: t('Contato', 'Contact') },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <span className="font-bold text-slate-900 dark:text-white tracking-tight">
              {data.basics.name.split(' ')[0]}
            </span>

            <nav className="hidden md:flex items-center gap-8">
              {navItems.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => smoothScrollTo(id)}
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(p => !p)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>
              <div className="relative">
                <button
                  onClick={() => setLangMenuOpen(p => !p)}
                  onBlur={() => setTimeout(() => setLangMenuOpen(false), 150)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <FiGlobe size={14} />
                  {LANGUAGES.find(l => l.code === currentLang)?.flag} {currentLang.toUpperCase()}
                  <FiChevronDown size={12} className={`transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {langMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden z-50">
                    {LANGUAGES.map(({ code, label, flag }) => (
                      <button
                        key={code}
                        onClick={() => { setCurrentLang(code); setLangMenuOpen(false) }}
                        className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${currentLang === code ? 'bg-slate-50 dark:bg-slate-700 font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}
                      >
                        <span>{flag}</span>
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
              <div className="lg:max-w-2xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-4">
                  {data.basics.name}
                </h1>

                <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-medium mb-6">
                  {data.basics.label}
                </p>

                <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed mb-8 max-w-xl">
                  {data.basics.summary}
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <a
                    href={`mailto:${data.basics.email}`}
                    className="inline-flex items-center px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                  >
                    <FiMail className="mr-2" size={16} />
                    {t('Entrar em contato', 'Get in touch')}
                  </a>
                  <a
                    href="https://linkedin.com/in/pietro-pugliesi/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-2.5 bg-[#0A66C2] text-white rounded-lg text-sm font-semibold hover:bg-[#004182] transition-colors"
                  >
                    <FiLinkedin className="mr-2" size={16} />
                    LinkedIn
                  </a>
                  <button
                    onClick={() => downloadPDF(currentLang)}
                    className="inline-flex items-center px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <FiDownload className="mr-2" size={16} />
                    {t('Baixar CV', 'Download CV')}
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {data.basics.profiles.map((p) => (
                    <a
                      key={p.network}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      {p.network === 'GitHub' && <FiGithub size={20} />}
                      {p.network === 'LinkedIn' && <FiLinkedin size={20} />}
                    </a>
                  ))}
                  <span className="text-sm text-slate-400 dark:text-slate-500 flex items-center">
                    <FiMapPin size={14} className="mr-1" />
                    {data.basics.location.city}, {data.basics.location.region}
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <Image
                  src="/photo.jpg"
                  alt={data.basics.name}
                  width={280}
                  height={280}
                  className="rounded-2xl object-cover shadow-xl"
                  priority
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-slate-100 dark:border-slate-800">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="py-24 px-6 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {t('Experiência', 'Experience')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-16 max-w-2xl">
              {t(
                'Trajetória focada em iOS nativo, modernização de arquitetura e mentoria técnica em escala.',
                'A career focused on native iOS, architecture modernization, and technical mentorship at scale.'
              )}
            </p>

            <div className="space-y-16">
              {data.work.map((job, i) => (
                <div key={i} className="relative">
                  <div className="flex flex-col md:flex-row md:gap-12">
                    {/* Left column — company info */}
                    <div className="md:w-64 flex-shrink-0 mb-6 md:mb-0">
                      <div className="sticky top-24">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-slate-900 dark:bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">
                              {job.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                              {job.name}
                            </h3>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {job.position}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center mt-1">
                          <FiCalendar size={12} className="mr-1.5" />
                          {formatPeriod(job.startDate, job.endDate)}
                        </p>
                      </div>
                    </div>

                    {/* Right column — details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-600 dark:text-slate-400 mb-6">
                        {job.summary}
                      </p>

                      <ul className="space-y-3 mb-8">
                        {job.highlights.map((h, hi) => (
                          <li key={hi} className="flex items-start group">
                            <FiArrowRight size={14} className="flex-shrink-0 mt-1.5 mr-3 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
                            <span className="text-slate-700 dark:text-slate-300 text-[15px] leading-relaxed">
                              {h}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-2">
                        {job.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {i < data.work.length - 1 && (
                    <div className="border-b border-slate-200 dark:border-slate-800 mt-16"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-16">
              Skills
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {Object.entries(data.skills).map(([category, skills]) => (
                <div
                  key={category}
                  className="p-6 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                >
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="py-24 px-6 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-16">
              {t('Projetos', 'Projects')}
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {data.projects.map((project, i) => (
                <div
                  key={i}
                  className="group bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                >
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {project.name}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <FiExternalLink size={14} className="mr-1.5" />
                      {t('Ver projeto', 'View project')}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education */}
        <section id="education" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-16">
              {t('Formação', 'Education')}
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {data.education.map((edu, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl border border-slate-100 dark:border-slate-800"
                >
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    {edu.startDate?.split('-')[0]} — {edu.endDate?.split('-')[0]}
                  </p>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    {edu.studyType}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-1">
                    {edu.area}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
                    {edu.institution}
                  </p>

                  {edu.highlights && (
                    <ul className="space-y-2">
                      {edu.highlights.map((h, hi) => (
                        <li key={hi} className="flex items-start text-sm text-slate-600 dark:text-slate-400">
                          <span className="flex-shrink-0 w-1 h-1 bg-slate-400 rounded-full mt-2 mr-2.5"></span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {data.certifications && data.certifications.length > 0 && (
              <div className="mt-12">
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">
                  {t('Certificações', 'Certifications')}
                </h3>
                {data.certifications.map((cert, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                      <FiBriefcase size={18} className="text-slate-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{cert.name}</p>
                      <p className="text-xs text-slate-500">{cert.issuer} · {cert.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {data.basics.languages && (
              <div className="mt-8 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="font-semibold">{t('Idiomas:', 'Languages:')}</span>
                {data.basics.languages.join(' · ')}
              </div>
            )}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-24 px-6 bg-slate-900 dark:bg-black">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('Vamos conversar?', "Let's talk")}
            </h2>

            <p className="text-slate-400 mb-12 max-w-lg mx-auto">
              {t(
                'Aberto a novas oportunidades e conversas sobre iOS, arquitetura e engenharia de software.',
                "Open to new opportunities and conversations about iOS, architecture, and software engineering."
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`mailto:${data.basics.email}`}
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-900 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors"
              >
                <FiMail className="mr-2" size={16} />
                {data.basics.email}
              </a>

              <a
                href="https://linkedin.com/in/pietro-pugliesi/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-slate-700 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
              >
                <FiLinkedin className="mr-2" size={16} />
                LinkedIn
              </a>

              <a
                href={`tel:${data.basics.phone}`}
                className="inline-flex items-center justify-center px-6 py-3 border border-slate-700 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
              >
                <FiPhone className="mr-2" size={16} />
                {data.basics.phone}
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 bg-slate-950 dark:bg-black border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {data.basics.name}
          </p>
          <div className="flex gap-4">
            {data.basics.profiles.map((p) => (
              <a
                key={p.network}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-white transition-colors"
              >
                {p.network === 'GitHub' && <FiGithub size={16} />}
                {p.network === 'LinkedIn' && <FiLinkedin size={16} />}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
