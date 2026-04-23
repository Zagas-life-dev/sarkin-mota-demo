import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'] 
})

export const metadata: Metadata = {
  title: 'Sarkin Mota Autos - The First King of Cars | Dr. Aliyu Muhammad',
  description: 'Sarkin Motor Jan Kasar Hausa. Built from zero capital to a nationwide network. Premium automobiles with 40% initial deposit program. Come and buy before you hear sold.',
  keywords: 'Sarkin Mota Autos, Dr. Aliyu Muhammad, car dealer Nigeria, luxury cars, 40% deposit program, Sarkin Motor, car sales Nigeria',
  authors: [{ name: 'Dr. Aliyu Muhammad - Sarkin Mota Autos' }],
  openGraph: {
    title: 'Sarkin Mota Autos - The First King of Cars',
    description: 'Sarkin Motor Jan Kasar Hausa. Premium automobiles with 40% initial deposit program. Come and buy before you hear sold.',
    type: 'website',
    locale: 'en_NG',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
