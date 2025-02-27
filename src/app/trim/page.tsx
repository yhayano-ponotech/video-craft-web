import VideoTrimmer from '@/src/components/video/video-trimmer';

export default function TrimPage() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">動画のトリミング</h1>
        <p className="text-lg max-w-3xl mx-auto">
          動画の必要な部分だけを切り取って新しい動画ファイルを作成できます。
          余分な部分をカットして、必要なシーンだけを残しましょう。
        </p>
      </div>
      
      <VideoTrimmer />
      
      <div className="card mt-8">
        <h2 className="text-xl font-semibold mb-4">使い方</h2>
        <ol className="space-y-3 list-decimal list-inside">
          <li>トリミングしたい動画ファイルをアップロードします。</li>
          <li>動画プレーヤーで内容を確認します。</li>
          <li>切り取りたい開始位置と終了位置を設定します。プレーヤーで再生しながら「現在位置を開始点に設定」「現在位置を終了点に設定」ボタンを使うと便利です。</li>
          <li>出力形式を選択します。</li>
          <li>「トリミング開始」ボタンをクリックし、処理が完了するまで待ちます。</li>
          <li>処理が完了したら、「トリミングした動画をダウンロード」ボタンをクリックしてダウンロードします。</li>
        </ol>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-green-50 border-green-200">
          <h2 className="text-xl font-semibold mb-4">トリミングのコツ</h2>
          <ul className="space-y-3">
            <li>
              <strong>正確なカット位置</strong>: 再生しながら適切なタイミングで「現在位置を開始/終了点に設定」ボタンを使用すると、より正確にカットできます。
            </li>
            <li>
              <strong>前後に余裕を持たせる</strong>: 大事なシーンのちょうど前後ではなく、少し余裕を持たせてトリミングするとより自然な仕上がりになります。
            </li>
            <li>
              <strong>複数回のトリミング</strong>: 複雑な編集は、一度に行うのではなく複数回に分けて行うと効率的です。
            </li>
          </ul>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">トリミングの活用例</h2>
          <ul className="space-y-3">
            <li>
              <strong>ハイライト作成</strong>: 長い動画から印象的なシーンだけを抽出してハイライト動画を作成
            </li>
            <li>
              <strong>不要部分の削除</strong>: 録画した動画の冒頭や末尾の余分な部分をカット
            </li>
            <li>
              <strong>SNS用に最適化</strong>: 長い動画から短い部分を切り出してSNSに最適なサイズに調整
            </li>
            <li>
              <strong>教育コンテンツ作成</strong>: 長い講義動画から特定のトピックだけを抽出
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}