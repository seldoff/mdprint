import "./globals.css"
import { ReactNode } from "react"

// noinspection JSUnusedGlobalSymbols
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <script src="https://mxpnl.com/tracker.js"></script>
      </body>
    </html>
  )
}
