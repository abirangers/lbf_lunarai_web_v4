import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SimulatorProvider } from '@/contexts/SimulatorContext'
import { Toaster } from '@/components/ui/toaster'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LunarAI Beauty Business Analysis Platform',
  description: 'Platform ideasi produk kosmetik berbasis AI untuk brand owner Indonesia - Evidence-based formulation & manufacturing technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <SimulatorProvider>
          {children}
          <Toaster />
        </SimulatorProvider>
      </body>
    </html>
  )
}
