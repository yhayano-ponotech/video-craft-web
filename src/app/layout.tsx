import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/src/components/layout/header';
import Footer from '@/src/components/layout/footer';

// Interフォントの設定
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Video Toolbox - YouTube動画のダウンロード・編集ツール',
  description: 'YouTubeから動画をダウンロードし、変換、切り取り、スクリーンショットの取得ができるオールインワンツール',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}