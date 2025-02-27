import VideoConverter from '@/src/components/video/video-converter';

export default function ConvertPage() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">動画形式の変換</h1>
        <p className="text-lg max-w-3xl mx-auto">
          動画ファイルを様々な形式（MP4, MOV, AVI など）に変換できます。
          デバイスやソフトウェアの互換性に合わせて最適な形式に変換しましょう。
        </p>
      </div>
      
      <VideoConverter />
      
      <div className="card mt-8">
        <h2 className="text-xl font-semibold mb-4">使い方</h2>
        <ol className="space-y-3 list-decimal list-inside">
          <li>変換したい動画ファイルをアップロードします。</li>
          <li>出力したい形式を選択します。</li>
          <li>「変換開始」ボタンをクリックし、処理が完了するまで待ちます。</li>
          <li>処理が完了したら、「変換ファイルをダウンロード」ボタンをクリックして変換された動画をダウンロードします。</li>
        </ol>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">対応している形式</h2>
          <ul className="space-y-2">
            <li><strong>MP4</strong>: 最も一般的で互換性の高い形式</li>
            <li><strong>MOV</strong>: Apple製デバイスに最適</li>
            <li><strong>AVI</strong>: 高品質で編集向き</li>
            <li><strong>MKV</strong>: 複数の音声・字幕トラックをサポート</li>
            <li><strong>WebM</strong>: ウェブサイト埋め込みに最適</li>
            <li><strong>GIF</strong>: 短い無音動画のループ再生に最適</li>
          </ul>
        </div>
        
        <div className="card bg-blue-50 border-blue-200">
          <h2 className="text-xl font-semibold mb-4">形式選びのヒント</h2>
          <ul className="space-y-3">
            <li>
              <strong>互換性重視</strong>: MP4形式が多くのデバイスやプラットフォームでサポートされています。
            </li>
            <li>
              <strong>高品質重視</strong>: MKVやAVIは高品質な動画保存に適しています。
            </li>
            <li>
              <strong>ウェブ用</strong>: WebMはウェブサイトでの再生に最適です。
            </li>
            <li>
              <strong>サイズ重視</strong>: MP4はファイルサイズと品質のバランスが良いです。
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}