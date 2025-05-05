import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import ChatOnlineButton from "@/components/chat-online-button"
import FavoritesProvider from "@/components/favorites-provider"
import CartProvider from "@/components/cart-provider"
import ProductsProvider from "@/components/products-provider"
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Lulaweb - Venta de Garage",
  description: "Sistema de ventas para venta de garage con exposición en mosaicos",
  generator: 'v0.dev',
  icons: {
    icon: '/images/icono2lulaweb.png',
    shortcut: '/images/icono2lulaweb.png',
    apple: '/images/icono2lulaweb.png',
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es" className="light" style={{ colorScheme: "light" }}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ProductsProvider>
            <FavoritesProvider>
              <CartProvider>
                <KeyboardShortcuts />
                {children}
                <ChatOnlineButton />
                <Toaster />
              </CartProvider>
            </FavoritesProvider>
          </ProductsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
