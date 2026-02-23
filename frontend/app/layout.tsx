import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import { NotificationProvider } from "@/components/notifications/notification-provider"
import { AuthProvider } from "@/contexts/auth-context"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: "StarNet - Premier Artist Booking Platform",
  description: "Book the best performers in Sri Lanka for your events",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={poppins.variable}>
        <body className="font-sans antialiased bg-gradient-to-br from-gray-50 to-white text-gray-900 overflow-x-hidden">
          <NotificationProvider>
            <AuthProvider>{children}</AuthProvider>
          </NotificationProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
