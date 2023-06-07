import "./globals.css"
import { ReactNode } from "react"
import Script from 'next/script'

// noinspection JSUnusedGlobalSymbols
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script src="https://mxpnl.com/tracker.js"></Script>
      </body>
    </html>
  )
}
