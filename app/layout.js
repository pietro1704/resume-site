import './globals.css'

export const metadata = {
  title: 'Pietro Pugliesi - iOS Developer & Computer Engineer',
  description: 'Senior iOS Developer at Pinterest with expertise in Swift, MVVM architecture, and mobile app development.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}