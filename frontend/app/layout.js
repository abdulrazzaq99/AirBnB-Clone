import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SimpleNavbar from "./components/SimpleNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Django BnB",
  description: "A platform for booking unique accommodations",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SimpleNavbar />
        <div className="pt-32">{children}</div>
      </body>
    </html>
  );
}
