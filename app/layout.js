import './globals.css'

export const metadata = {
  title: 'CRM Sales Team',
  description: 'Customer Relationship Management for Sales Teams',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app">
          {children}
        </div>
      </body>
    </html>
  )
}
