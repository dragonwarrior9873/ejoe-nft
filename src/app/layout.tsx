import { Poppins } from "next/font/google";
import "./globals.css";
import "@/styles/index.scss";
import "rc-slider/assets/index.css";
import Footer from "@/shared/Footer/Footer";
import MusicPlayer from "@/components/MusicPlayer/MusicPlayer";
import SiteHeader from "@/app/SiteHeader";
import { Providers } from "./Provider";
import { Toaster } from "react-hot-toast";
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Cicryp.",
  description: "Buy/Sell NFT on Cicryp. NFT Marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html lang="en" className={poppins.className}>
        <body className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
          <Toaster position="bottom-left" />

          <SiteHeader />
          {children}
          <Footer />
          <MusicPlayer />
        </body>
      </html>
    </Providers>
  );
}
