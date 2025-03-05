import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* サイト情報 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Video Toolbox</h3>
            <p className="mb-4">
              動画の変換、圧縮、切り取り、画像抽出を簡単に行えるオールインワンツール。
            </p>
          </div>

          {/* クイックリンク */}
          <div>
            <h3 className="text-lg font-semibold mb-4">クイックリンク</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  ホーム
                </Link>
              </li>
              <li>
                <Link href="/convert" className="hover:text-primary transition-colors">
                  変換
                </Link>
              </li>
              <li>
                <Link href="/compress" className="hover:text-primary transition-colors">
                  圧縮
                </Link>
              </li>
              <li>
                <Link href="/trim" className="hover:text-primary transition-colors">
                  切り取り
                </Link>
              </li>
              <li>
                <Link href="/screenshot" className="hover:text-primary transition-colors">
                  画像抽出
                </Link>
              </li>
            </ul>
          </div>

          {/* 法的情報 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">法的情報</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* コピーライト */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p>© {currentYear} Video Toolbox. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}