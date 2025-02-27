import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">利用規約</h1>
        <p className="text-lg max-w-3xl mx-auto">
          Video Toolboxをご利用いただく前に、以下の利用規約をよくお読みください。
          本サービスを利用することで、これらの規約に同意したものとみなされます。
        </p>
      </div>

      <div className="card">
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold mb-4">1. はじめに</h2>
          <p>
            本利用規約（以下「本規約」）は、Video Toolbox（以下「本サービス」）の利用条件を定めるものです。
            ユーザーの皆様（以下「ユーザー」）には、本規約に従って本サービスをご利用いただきます。
          </p>
        </div>
      </div>

      <div className="card">
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold mb-4">2. サービスの説明</h2>
          <p>
            本サービスは、YouTubeからの動画ダウンロード、動画形式の変換、動画のトリミング、動画からの画像抽出などの機能を提供するオンラインツールです。
            ただし、本サービスの利用は個人的な目的に限定され、著作権法を含む関連法令に準拠する必要があります。
          </p>
        </div>
      </div>

      <div className="card">
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold mb-4">3. 利用条件</h2>
          <p>
            本サービスを利用するには、以下の条件に同意する必要があります：
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>ユーザーは13歳以上である必要があります。</li>
            <li>ユーザーは本規約に同意し、遵守する必要があります。</li>
            <li>ユーザーは本サービスを違法な目的で使用しないことに同意します。</li>
            <li>ユーザーは本サービスを通じて、著作権法に違反するコンテンツを扱わないことに同意します。</li>
          </ul>
        </div>
      </div>

      <div className="card">
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold mb-4">4. 知的財産権</h2>
          <p>
            本サービスおよび関連するすべてのコンテンツ（ロゴ、デザイン、テキスト、グラフィックスなど）は、当社または当社のライセンサーの知的財産であり、著作権、商標権、その他の知的財産権法によって保護されています。
          </p>
          <p>
            ユーザーは、本サービスを通じて処理されたコンテンツの著作権法を遵守する責任があります。第三者の著作物を処理する場合、適切な権利を取得していることを確認する必要があります。
          </p>
        </div>
      </div>

      <div className="card">
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold mb-4">5. 禁止事項</h2>
          <p>
            本サービスの利用にあたり、以下の行為を禁止します：
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>本サービスを商業目的で使用すること</li>
            <li>本サービスの運営を妨害すること</li>
            <li>本サービスを通じて違法なコンテンツを配布すること</li>
            <li>本サービスを使用して著作権法に違反すること</li>
            <li>本サービスのセキュリティを侵害する行為</li>
            <li>本サービスのコードやコンテンツを無断で複製、改変すること</li>
            <li>その他、法令や公序良俗に反する行為</li>
          </ul>
        </div>
      </div>

      <div className="card">
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold mb-4">6. 免責事項</h2>
          <p>
            本サービスは「現状有姿」で提供され、明示または黙示を問わず、いかなる種類の保証もいたしません。
          </p>
          <p>
            当社は、本サービスの利用によって生じた直接的、間接的、偶発的、特別、結果的またはその他のいかなる損害についても、一切の責任を負いません。
          </p>
          <p>
            本サービスを通じて処理されたコンテンツに関連する著作権侵害などの法的問題については、ユーザー自身が全責任を負うものとします。
          </p>
        </div>
      </div>

      <div className="card">
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold mb-4">7. サービスの変更および中断</h2>
          <p>
            当社は、予告なく本サービスの内容を変更、または提供を中断・終了する権利を有します。
            本サービスの変更、中断または終了によりユーザーに生じた損害について、当社は一切の責任を負いません。
          </p>
        </div>
      </div>

      <div className="card">
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold mb-4">8. 規約の変更</h2>
          <p>
            当社は、必要に応じて本規約を変更する権利を有します。
            重要な変更がある場合は、本サービス上で通知します。
            変更後も本サービスを継続して利用する場合、ユーザーは変更後の規約に同意したものとみなされます。
          </p>
        </div>
      </div>

      <div className="card">
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold mb-4">9. 準拠法と管轄裁判所</h2>
          <p>
            本規約の解釈および適用は日本法に準拠するものとし、本サービスに関連する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
          </p>
        </div>
      </div>

      <div className="card">
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold mb-4">10. お問い合わせ</h2>
          <p>
            本規約に関するご質問やご意見は、以下の連絡先までお寄せください：
          </p>
          <p className="mt-2">
            メール：support@videotoolbox.example.com
          </p>
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-gray-500 mb-4">最終更新日：2025年2月27日</p>
        <Link href="/" className="btn btn-primary">
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}