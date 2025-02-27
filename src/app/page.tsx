import Link from 'next/link';
import { FaDownload, FaExchangeAlt, FaCut, FaCamera } from 'react-icons/fa';

export default function Home() {
  // 機能カードの定義
  const features = [
    {
      title: 'YouTube動画のダウンロード',
      description: 'YouTubeのURLを入力するだけで、高画質な動画を簡単にダウンロードできます。',
      icon: <FaDownload className="text-4xl text-primary mb-4" />,
      link: '/download',
    },
    {
      title: '動画形式の変換',
      description: '動画ファイルを様々な形式（MP4, MOV, AVI など）に変換できます。',
      icon: <FaExchangeAlt className="text-4xl text-primary mb-4" />,
      link: '/convert',
    },
    {
      title: '動画のトリミング',
      description: '動画の必要な部分だけを切り取って新しい動画ファイルを作成できます。',
      icon: <FaCut className="text-4xl text-primary mb-4" />,
      link: '/trim',
    },
    {
      title: '動画からの画像抽出',
      description: '動画の任意のフレームを画像として保存できます。',
      icon: <FaCamera className="text-4xl text-primary mb-4" />,
      link: '/screenshot',
    },
  ];

  return (
    <div className="space-y-10">
      {/* ヒーローセクション */}
      <section className="text-center py-10">
        <h1 className="text-4xl font-bold mb-4">動画編集ツールボックス</h1>
        <p className="text-xl max-w-2xl mx-auto mb-8">
          YouTubeからの動画ダウンロードから編集まで、必要な動画ツールがすべて揃っています。
          簡単操作で動画をダウンロード、変換、切り取り、画像抽出ができます。
        </p>
        <Link href="/download" className="btn btn-primary">
          今すぐ使ってみる
        </Link>
      </section>

      {/* 機能セクション */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">主な機能</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link 
              href={feature.link} 
              key={index}
              className="card text-center hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center">
                {feature.icon}
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="mb-4">{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 使い方セクション */}
      <section className="card">
        <h2 className="text-3xl font-bold text-center mb-8">使い方</h2>
        <ol className="space-y-4 max-w-3xl mx-auto">
          <li className="flex items-start">
            <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">1</span>
            <p>機能を選択：ダウンロード、変換、トリミング、画像抽出から必要な機能を選びます。</p>
          </li>
          <li className="flex items-start">
            <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">2</span>
            <p>ファイルの準備：YouTube URLを入力するか、既存の動画ファイルをアップロードします。</p>
          </li>
          <li className="flex items-start">
            <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">3</span>
            <p>設定を調整：必要に応じて出力形式や切り取り範囲などを設定します。</p>
          </li>
          <li className="flex items-start">
            <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">4</span>
            <p>処理を実行：「処理開始」ボタンをクリックして待ちます。完了したらファイルをダウンロードできます。</p>
          </li>
        </ol>
      </section>
    </div>
  );
}