import "./globals.css";
import { Toaster } from "react-hot-toast";
import { NextProviderUI } from "@/context/NextProviderUI";
import Navbar from "@/components/Navbar";
import NextAuthProviders from "@/context/NextAuthProviders";

export const metadata = {
  title: "Diabe Delicias",
  description: "Mi restaurante de delicias!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="overflow-auto">
        <NextProviderUI>
          <NextAuthProviders>
            <Navbar />
            {children}
          </NextAuthProviders>
          <Toaster />
        </NextProviderUI>
      </body>
    </html>
  );
}
