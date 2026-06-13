import type { Metadata } from "next";
import { Inter  } from "next/font/google";
import "./globals.css";
import SplashScreen from "@/components/UI/SplashScreen";
import { AuthProvider } from "@/context/AuthContext";
import { ShipmentProvider } from "@/context/ShipmentContext";

// Import Inter from Google Fonts
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // adjust weights as needed
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Apex Delivery Service",
  description: "Delivering packages with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" rel="stylesheet" />
      </head>
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <ShipmentProvider>
            <SplashScreen>{children}</SplashScreen>
          </ShipmentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
// app/layout