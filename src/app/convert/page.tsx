import VideoConverter from '@/src/components/video/video-converter';

export default function ConvertPage() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">動画形式の変換</h1>
        <p className="text-lg max-w-3xl mx-auto">
          動画ファイルを様々な形式に簡単に変換できます。
          MP4、MOV、AVI、MKV、WebMなど、幅広い形式に対応しています。
        </p>
      </div>
      
      <VideoConverter />
      
      <div className="card mt-8">
        <h2 className="text-xl font-semibold mb-4">使い方</h2>
        <ol className="space-y-3 list-decimal list-inside">
          <li>変換したい動画ファイルをアップロードします。</li>
          <li>変換したい出力形式（MP4、MOV、AVIなど）を選択します。</li>
          <li>「変換開始」ボタンをクリックし、処理が完了するまで待ちます。</li>
          <li>処理が完了したら、「変換ファイルをダウンロード」ボタンをクリックしてダウンロードします。</li>
        </ol>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">対応フォーマット</h2>
          <ul className="space-y-3">
            <li>
              <strong>MP4</strong>: 最も汎用的な動画形式。ほとんどのデバイスやプラットフォームで再生可能です。
            </li>
            <li>
              <strong>MOV</strong>: Apple製品との互換性が高い形式です。
            </li>
            <li>
              <strong>AVI</strong>: Windows環境で広く使われている形式です。
            </li>
            <li>
              <strong>MKV</strong>: 高品質な動画や複数の字幕・音声トラックを含められる形式です。
            </li>
            <li>
              <strong>WebM</strong>: ウェブでの使用に最適化された形式です。
            </li>
            <li>
              <strong>GIF</strong>: アニメーションGIF形式に変換できます。
            </li>
          </ul>
        </div>
        
        <div className="card bg-blue-50 border-blue-200">
          <h2 className="text-xl font-semibold mb-4">変換のコツ</h2>
          <ul className="space-y-3">
            <li>
              <strong>用途に合わせた形式選択</strong>: SNSでの共有にはMP4、高品質保存にはMKVなど、使用目的に合わせて形式を選びましょう。
            </li>
            <li>
              <strong>GIF変換の注意点</strong>: GIFに変換すると音声が失われ、ファイルサイズが大きくなる場合があります。短い動画に適しています。
            </li>
            <li>
              <strong>互換性の考慮</strong>: 特定のデバイスで再生する場合は、そのデバイスがサポートする形式を選びましょう。
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}