import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import ChatOnlineButton from "@/components/chat-online-button"
import FavoritesProvider from "@/components/favorites-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Lulaweb - Venta de Garage",
  description: "Sistema de ventas para venta de garage con exposición en mosaicos",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <FavoritesProvider>
            {children}
            <ChatOnlineButton />
            <Toaster />
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
