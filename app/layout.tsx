import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'advanced-todo',
  description: 'advanced-todo is a simple todo app built with Next.js 13 and TypeScript',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
