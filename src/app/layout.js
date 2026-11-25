import "./globals.css";
import AppProviders from "@/components/AppProviders";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "বাজার দর | BazarDor",
  description: "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের আজকের বাজারদর এক নজরে।",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body>
        <AppProviders>
          <Navbar />
          <main className="app-main">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
