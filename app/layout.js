// import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionWrapper from "@/components/SessionWrapper";


export const metadata = {
  title: "Patreon Clone",
  description: "Developed by Raunit",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className=" min-h-screen flex flex-col
      [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] text-white">
        <SessionWrapper>
          <Navbar />

          <main className=" min-h-screen  [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]  text-white">

            {children}
          </main>
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
