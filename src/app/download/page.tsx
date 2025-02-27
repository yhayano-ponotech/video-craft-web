import VideoDownloader from '@/src/components/video/video-downloader';

export default function DownloadPage() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">YouTube動画ダウンロード</h1>
        <p className="text-lg max-w-3xl mx-auto">
          YouTubeのURLを入力するだけで、高画質な動画を簡単にダウンロードできます。
          動画ファイルはお使いのデバイスに保存され、オフラインでも視聴可能です。
        </p>
      </div>
      
      <VideoDownloader />
      
      <div className="card mt-8">
        <h2 className="text-xl font-semibold mb-4">使い方</h2>
        <ol className="space-y-3 list-decimal list-inside">
          <li>上のフォームにYouTube動画のURLを入力し、「検索」ボタンをクリックします。</li>
          <li>動画情報が表示されたら、希望の形式と画質を選択します。</li>
          <li>「ダウンロード開始」ボタンをクリックし、処理が完了するまで待ちます。</li>
          <li>処理が完了したら、「ファイルをダウンロード」ボタンをクリックしてダウンロードを開始します。</li>
        </ol>
      </div>
      
      <div className="card bg-yellow-50 border-yellow-200">
        <h2 className="text-xl font-semibold mb-4">ご注意</h2>
        <p>
          YouTubeの動画をダウンロードする際は、著作権法を遵守してください。
          個人的な利用以外の目的での使用は法律で禁止されている場合があります。
          当ツールは教育目的および個人的な使用のみを想定しています。
        </p>
      </div>
    </div>
  );
}