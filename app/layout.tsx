import type { Metadata } from 'next'
import { Sora } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const sora = Sora({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Invoice Generator by Creativorium',
  description: 'Exclusive Invoice Generator by Creativorium',
  icons: {
    icon: [
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
    ],
  },
  openGraph: {
    title: 'Invoice Generator by Creativorium',
    description: 'Exclusive Invoice Generator by Creativorium',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Invoice Generator by Creativorium',
    description: 'Exclusive Invoice Generator by Creativorium',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={sora.className}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
