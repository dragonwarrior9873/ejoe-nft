import { Poppins } from "next/font/google";
import "./globals.css";
import "@/styles/index.scss";
import "rc-slider/assets/index.css";
import Footer from "@/shared/Footer/Footer";
import MusicPlayer from "@/components/MusicPlayer/MusicPlayer";
import SiteHeader from "@/app/SiteHeader";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Ejoe NFT Marketplace",
  description: "Buy/Sell NFT on Ejoe NFT Marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
        <SiteHeader />
        {children}
        <Footer />
        <MusicPlayer />
      </body>
    </html>
  );
}
