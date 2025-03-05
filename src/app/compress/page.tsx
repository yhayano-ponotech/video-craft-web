import VideoCompressor from '@/src/components/video/video-compressor';

export default function CompressPage() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">スマート動画圧縮</h1>
        <p className="text-lg max-w-3xl mx-auto">
          動画ファイルを品質を維持しながら効率的に圧縮できます。
          ファイルサイズを小さくしつつ、見た目の品質を最大限に保ちます。
        </p>
      </div>
      
      <VideoCompressor />
      
      <div className="card mt-8">
        <h2 className="text-xl font-semibold mb-4">使い方</h2>
        <ol className="space-y-3 list-decimal list-inside">
          <li>圧縮したい動画ファイルをアップロードします。</li>
          <li>圧縮レベル（軽度、中程度、高度）を選択します。</li>
          <li>必要に応じて解像度を調整します。サイズを小さくするほど圧縮効果が高まります。</li>
          <li>「圧縮開始」ボタンをクリックし、処理が完了するまで待ちます。</li>
          <li>処理が完了したら、「圧縮ファイルをダウンロード」ボタンをクリックしてダウンロードします。</li>
        </ol>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">圧縮レベルについて</h2>
          <ul className="space-y-3">
            <li>
              <strong>軽度</strong>: わずかな圧縮で、ほぼ原版の品質を維持します。大きなファイルの軽量化に最適です。
            </li>
            <li>
              <strong>中程度</strong>: バランスの取れた圧縮で、品質と容量の良いバランスを提供します。多くの場合はこのレベルがおすすめです。
            </li>
            <li>
              <strong>高度</strong>: 強力な圧縮で、ファイルサイズを大幅に削減します。メール添付やモバイル機器での視聴に最適です。
            </li>
          </ul>
        </div>
        
        <div className="card bg-green-50 border-green-200">
          <h2 className="text-xl font-semibold mb-4">圧縮のコツ</h2>
          <ul className="space-y-3">
            <li>
              <strong>解像度の選択</strong>: 動画の視聴環境に合わせて解像度を選びましょう。スマートフォンでの視聴なら720pで十分な場合が多いです。
            </li>
            <li>
              <strong>最適な圧縮レベル</strong>: 重要な映像は中程度、一時的な共有なら高度圧縮が効果的です。
            </li>
            <li>
              <strong>ファイル形式</strong>: MP4は互換性と圧縮効率のバランスが良く、多くの場合に最適です。
            </li>
            <li>
              <strong>ファイルサイズの目安</strong>: 1分のHD動画で、軽度圧縮で約20-30MB、中程度で10-15MB、高度で3-8MBが目安です。
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}