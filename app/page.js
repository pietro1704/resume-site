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
  FiSun 
} from 'react-icons/fi'
import resumeData from '../data/resume.json'

export default function Home() {
  // State
  const [currentLang, setCurrentLang] = useState('pt')
  const [darkMode, setDarkMode] = useState(false)
  const data = resumeData[currentLang]

  // Effects
  useEffect(() => {
    // Detectar idioma do navegador
    const browserLang = navigator.language || navigator.userLanguage
    const lang = browserLang.startsWith('pt') ? 'pt' : 'en'
    setCurrentLang(lang)

    // Detectar preferência de tema do sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(prefersDark)
  }, [])

  useEffect(() => {
    // Aplicar tema
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  // Event handlers
  const toggleLanguage = () => {
    setCurrentLang(prev => prev === 'pt' ? 'en' : 'pt')
  }

  const toggleTheme = () => {
    setDarkMode(prev => !prev)
  }

  const smoothScrollTo = (elementId) => {
    const element = document.getElementById(elementId)
    if (!element) return

    // Offset para compensar o header fixo
    const headerHeight = 80
    const elementPosition = element.offsetTop - headerHeight
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    })
  }

  const downloadPDF = (lang) => {
    const fileName = `pietro-cv-${lang}.pdf`
    const downloadName = `Pietro_Pugliesi_CV_${lang.toUpperCase()}.pdf`
    
    const link = document.createElement('a')
    link.href = `/pdfs/${fileName}?v=${Date.now()}`
    link.download = downloadName
    link.target = '_blank'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Constants
  const NAV_ITEMS = [
    { id: 'about', label: { pt: 'Sobre', en: 'About' } },
    { id: 'experience', label: { pt: 'Experiência', en: 'Experience' } },
    { id: 'projects', label: { pt: 'Projetos', en: 'Projects' } },
    { id: 'skills', label: { pt: 'Skills', en: 'Skills' } },
    { id: 'contact', label: { pt: 'Contato', en: 'Contact' } },
  ]

  const BUTTON_CLASSES = {
    nav: "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors",
    theme: "p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors",
    primary: "inline-flex items-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-base font-medium rounded-lg shadow-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors",
    download: "px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors",
  }

  // Render helpers
  const renderNavigation = () => (
    <nav className="hidden md:flex space-x-8">
      {NAV_ITEMS.map(({ id, label }) => (
        <button 
          key={id}
          onClick={() => smoothScrollTo(id)} 
          className={BUTTON_CLASSES.nav}
        >
          {label[currentLang]}
        </button>
      ))}
    </nav>
  )

  const renderLanguageToggle = () => (
    <div className="relative inline-flex items-center">
      <span className={`text-sm font-medium ${currentLang === 'pt' ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>
        Português
      </span>
      <label className="relative inline-flex items-center cursor-pointer mx-2">
        <input
          type="checkbox"
          checked={currentLang === 'en'}
          onChange={toggleLanguage}
          className="sr-only peer"
        />
        <div className="w-16 h-8 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 dark:peer-focus:ring-slate-700 rounded-full peer dark:bg-slate-600">
          <div className={`absolute top-1 left-1 w-6 h-6 bg-white border border-slate-300 rounded-full transition-transform dark:border-slate-500 ${currentLang === 'en' ? 'translate-x-8 bg-slate-900 dark:bg-slate-100' : 'bg-slate-900 dark:bg-slate-100'}`} />
        </div>
      </label>
      <span className={`text-sm font-medium ${currentLang === 'en' ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>
        English
      </span>
    </div>
  )

  const renderActionButtons = () => (
    <div className="flex flex-wrap gap-4 mb-4">
      <a
        href={`mailto:${data.basics.email}`}
        className={BUTTON_CLASSES.primary}
      >
        <FiMail className="mr-2" />
        {currentLang === 'pt' ? 'Entrar em contato' : 'Get in touch'}
      </a>
      
      <a
        href="https://linkedin.com/in/pietro-pugliesi/"
        target="_blank"
        rel="noopener noreferrer"
        className={BUTTON_CLASSES.primary}
      >
        <FiLinkedin className="mr-2" />
        LinkedIn
      </a>
      
      <div className="flex space-x-4">
        <button
          onClick={() => downloadPDF('pt')}
          className={`${BUTTON_CLASSES.download} ${currentLang === 'pt' ? 'ring-4 ring-blue-500' : ''}`}
        >
          🇧🇷 Baixar CV (PT)
        </button>

        <button
          onClick={() => downloadPDF('en')}
          className={`${BUTTON_CLASSES.download} ${currentLang === 'en' ? 'ring-4 ring-blue-500' : ''}`}
        >
          🇺🇸 Download CV (EN)
        </button>
      </div>
    </div>
  )

  const renderHeader = () => (
    <header className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Pietro Pugliesi
          </h1>
          
          {renderNavigation()}

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={BUTTON_CLASSES.theme}
            >
              {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            
            {renderLanguageToggle()}
          </div>
        </div>
      </div>
    </header>
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {renderHeader()}

      <main className="pt-20">
        {/* Hero Section */}
        <section id="about" className="py-12 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-start">
              <div className="lg:col-span-12">
                <div className="flex flex-col lg:flex-row lg:gap-8 items-start mb-6">
                  <div className="flex-1 lg:order-1">
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
                      {data.basics.name}
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mt-3 mb-4">
                      {data.basics.label}
                    </p>
                    <p className="text-lg text-slate-700 dark:text-slate-400 leading-relaxed">
                      {data.basics.summary}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0 mb-6 lg:mb-0 lg:order-2">
                    <Image
                      src="/photo.jpg"
                      alt="Pietro Pugliesi"
                      width={240}
                      height={240}
                      className="rounded-2xl object-cover mx-auto lg:mx-0"
                    />
                  </div>
                </div>
                
                {renderActionButtons()}

                <div className="flex space-x-6 mb-4">
                  {data.basics.profiles.map((profile) => (
                    <a
                      key={profile.network}
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      {profile.network === 'GitHub' && <FiGithub size={24} />}
                      {profile.network === 'LinkedIn' && <FiLinkedin size={24} />}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-20 bg-white dark:bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-16 text-center">
              {currentLang === 'pt' ? 'Experiência' : 'Experience'}
            </h2>
            
            <div className="space-y-12">
              {data.work.map((job, index) => (
                <div key={index} className="relative">
                  {index !== data.work.length - 1 && (
                    <div className="absolute left-8 top-16 w-0.5 h-full bg-slate-200 dark:bg-slate-700"></div>
                  )}
                  
                  <div className="relative flex items-start space-x-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-slate-900 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {job.name.charAt(0)}
                      </span>
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex flex-wrap items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {job.position}
                        </h3>
                        <span className="text-slate-600 dark:text-slate-400 text-sm">
                          {job.startDate} - {job.endDate || 'Present'}
                        </span>
                      </div>
                      
                      <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {job.name}
                      </p>
                      
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        {job.summary}
                      </p>
                      
                      <ul className="space-y-2 mb-6">
                        {job.highlights.map((highlight, hIndex) => (
                          <li key={hIndex} className="flex items-start">
                            <span className="flex-shrink-0 w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full mt-2 mr-3"></span>
                            <span className="text-slate-700 dark:text-slate-300">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="flex flex-wrap gap-2">
                        {job.technologies.map((tech, tIndex) => (
                          <span
                            key={tIndex}
                            className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-16 text-center">
              {currentLang === 'pt' ? 'Projetos' : 'Projects'}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.projects.map((project, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {project.name}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {project.description}
                  </p>
                  
                  <ul className="space-y-1 mb-6">
                    {project.highlights.map((highlight, hIndex) => (
                      <li key={hIndex} className="flex items-start">
                        <span className="flex-shrink-0 w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full mt-2 mr-3"></span>
                        <span className="text-slate-700 dark:text-slate-300 text-sm">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, tIndex) => (
                      <span
                        key={tIndex}
                        className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs"
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
                      className="inline-flex items-center text-slate-900 dark:text-white hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      <FiExternalLink className="mr-2" size={16} />
                      {currentLang === 'pt' ? 'Ver projeto' : 'View project'}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 bg-white dark:bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-16 text-center">
              Skills
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(data.skills).map(([category, skills]) => (
                <div
                  key={category}
                  className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6"
                >
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    {category}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm border border-slate-200 dark:border-slate-700"
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

        {/* Contact Section */}
        <section id="contact" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8">
              {currentLang === 'pt' ? 'Vamos conversar?' : "Let's get in touch"}
            </h2>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
              {currentLang === 'pt'
                ? 'Estou sempre aberto a novas oportunidades e conversas interessantes sobre tecnologia e desenvolvimento iOS.'
                : "I'm always open to new opportunities and interesting conversations about technology and iOS development."
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href={`mailto:${data.basics.email}`}
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
              >
                <FiMail className="mr-3" />
                {data.basics.email}
              </a>
              
              <a
                href="https://linkedin.com/in/pietro-pugliesi/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 border border-slate-300 dark:border-slate-600 text-lg font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <FiLinkedin className="mr-3" />
                LinkedIn
              </a>
              
              <a
                href={`tel:${data.basics.phone}`}
                className="inline-flex items-center px-8 py-4 border border-slate-300 dark:border-slate-600 text-lg font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <FiPhone className="mr-3" />
                {data.basics.phone}
              </a>
            </div>
            
            <div className="flex justify-center items-center mt-8 text-slate-600 dark:text-slate-400">
              <FiMapPin className="mr-2" />
              <span>{data.basics.location.city}, {data.basics.location.region} - {data.basics.location.country}</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-slate-400">
                © 2025 Pietro Pugliesi. {currentLang === 'pt' ? 'Todos os direitos reservados.' : 'All rights reserved.'}
              </p>
            </div>
            
            <div className="flex space-x-6">
              {data.basics.profiles.map((profile) => (
                <a
                  key={profile.network}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {profile.network === 'GitHub' && <FiGithub size={20} />}
                  {profile.network === 'LinkedIn' && <FiLinkedin size={20} />}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}