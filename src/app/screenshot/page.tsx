import VideoScreenshotter from '@/src/components/video/video-screenshotter';

export default function ScreenshotPage() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">動画からの画像抽出</h1>
        <p className="text-lg max-w-3xl mx-auto">
          動画の任意のフレームを高品質な画像として保存できます。
          好きなシーンを簡単にキャプチャして、画像として活用しましょう。
        </p>
      </div>
      
      <VideoScreenshotter />
      
      <div className="card mt-8">
        <h2 className="text-xl font-semibold mb-4">使い方</h2>
        <ol className="space-y-3 list-decimal list-inside">
          <li>画像を抽出したい動画ファイルをアップロードします。</li>
          <li>動画プレーヤーで内容を確認します。</li>
          <li>画像として保存したい瞬間に一時停止し、「現在位置を使用」ボタンをクリックします。</li>
          <li>画像の形式（JPGまたはPNG）と品質を選択します。</li>
          <li>「スクリーンショットを取得」ボタンをクリックし、処理が完了するまで待ちます。</li>
          <li>抽出された画像のプレビューを確認し、「画像をダウンロード」ボタンをクリックして保存します。</li>
        </ol>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">画像形式について</h2>
          <ul className="space-y-3">
            <li>
              <strong>JPG</strong>: ファイルサイズが小さく、写真のような複雑な画像に適しています。ただし、圧縮によって画質が若干低下する場合があります。
            </li>
            <li>
              <strong>PNG</strong>: 画質を損なわない高品質な画像形式です。特にテキストやシンプルなグラフィックを含むスクリーンショットに適しています。ただし、JPGよりもファイルサイズが大きくなります。
            </li>
          </ul>
        </div>
        
        <div className="card bg-purple-50 border-purple-200">
          <h2 className="text-xl font-semibold mb-4">活用アイデア</h2>
          <ul className="space-y-3">
            <li>
              <strong>サムネイル作成</strong>: 動画の代表的なシーンをキャプチャしてサムネイル画像を作成
            </li>
            <li>
              <strong>プレゼン資料への挿入</strong>: 動画コンテンツの特定の瞬間をスライドに活用
            </li>
            <li>
              <strong>SNSでの共有</strong>: 印象的なシーンを画像として保存してSNSに投稿
            </li>
            <li>
              <strong>参考資料としての保存</strong>: チュートリアル動画から重要な画面を参考資料として保存
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}