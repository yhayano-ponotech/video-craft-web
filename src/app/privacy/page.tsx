import React from 'react';
import Link from 'next/link';
import { FaShieldAlt, FaUserSecret, FaClipboardList, FaShareAlt, FaLock, FaHistory, FaEnvelope } from 'react-icons/fa';

export default function PrivacyPage() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">プライバシーポリシー</h1>
        <p className="text-lg max-w-3xl mx-auto">
          Video Toolboxは、お客様のプライバシーを尊重し、個人情報の保護に努めています。
          当社のプライバシーポリシーをご確認いただき、サービスのご利用方法をご理解ください。
        </p>
      </div>

      <div className="card">
        <div className="flex items-start">
          <FaShieldAlt className="text-primary text-3xl mr-4 mt-1 flex-shrink-0" />
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">1. はじめに</h2>
            <p>
              このプライバシーポリシー（以下「本ポリシー」）は、Video Toolbox（以下「本サービス」）が収集する情報の種類、その使用方法、およびお客様の個人情報の保護に関する当社の取り組みについて説明するものです。
            </p>
            <p>
              本サービスを利用することにより、お客様は本ポリシーに記載されている情報の収集および使用に同意したものとみなされます。
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-start">
          <FaUserSecret className="text-primary text-3xl mr-4 mt-1 flex-shrink-0" />
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">2. 収集する情報</h2>
            <p>
              当社が収集する情報には、以下のものが含まれますが、これらに限定されません：
            </p>
            <h3 className="text-xl font-medium mt-4 mb-2">2.1. アップロードされたコンテンツ</h3>
            <p>
              お客様が本サービスにアップロードした動画ファイルや、YouTube URLなどのコンテンツ情報。
              これらは、リクエストされたサービス（変換、トリミングなど）を提供するためにのみ使用されます。
            </p>
            <h3 className="text-xl font-medium mt-4 mb-2">2.2. 技術情報</h3>
            <p>
              IPアドレス、ブラウザの種類、参照元、アクセス日時などの標準的なログ情報。
              デバイスの種類、オペレーティングシステム、言語設定などのデバイス情報。
            </p>
            <h3 className="text-xl font-medium mt-4 mb-2">2.3. Cookie情報</h3>
            <p>
              当社では、サービスの機能向上と利便性の改善のためにCookieを使用しています。
              Cookieは、お客様のブラウザに保存される小さなテキストファイルで、ウェブサイトがお客様のデバイスを認識するために使用されます。
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-start">
          <FaClipboardList className="text-primary text-3xl mr-4 mt-1 flex-shrink-0" />
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">3. 情報の利用方法</h2>
            <p>
              収集した情報は、以下の目的で利用されます：
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>本サービスの提供、維持、および改善</li>
              <li>お客様のリクエストへの対応</li>
              <li>技術的問題の診断と解決</li>
              <li>サービスの使用状況の分析とパフォーマンスの監視</li>
              <li>不正使用や濫用の防止</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-start">
          <FaShareAlt className="text-primary text-3xl mr-4 mt-1 flex-shrink-0" />
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">4. 情報の共有</h2>
            <p>
              当社は、お客様の個人情報を以下の場合を除き、第三者と共有することはありません：
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>サービスプロバイダー</strong>：当社は、本サービスの提供を支援するために、クラウドストレージプロバイダーなどの信頼できる第三者サービスプロバイダーを利用することがあります。これらのプロバイダーは、適切なセキュリティ対策を講じ、当社のプライバシーポリシーに準拠する義務があります。
              </li>
              <li>
                <strong>法的要件</strong>：法律、規制、法的手続き、または政府の要請に応じるために必要な場合。
              </li>
              <li>
                <strong>権利保護</strong>：当社、お客様、または他者の権利、財産、または安全を保護するために必要な場合。
              </li>
            </ul>
            <p className="mt-4">
              当社は、お客様の個人情報を広告目的で第三者に販売または貸与することはありません。
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-start">
          <FaLock className="text-primary text-3xl mr-4 mt-1 flex-shrink-0" />
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">5. データのセキュリティ</h2>
            <p>
              当社は、お客様の個人情報の安全性を確保するために、適切な技術的・組織的措置を講じています。
              ただし、インターネット経由の転送や電子ストレージの方法は100%安全ではなく、絶対的なセキュリティを保証することはできません。
            </p>
            <h3 className="text-xl font-medium mt-4 mb-2">5.1. データの保持</h3>
            <p>
              アップロードされたファイルは、処理完了後24時間以内に自動的に削除されます。
              ただし、サービス向上のために匿名化された使用統計は、より長期間保存される場合があります。
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-start">
          <FaHistory className="text-primary text-3xl mr-4 mt-1 flex-shrink-0" />
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">6. ユーザーの権利</h2>
            <p>
              お客様には、ご自身の個人情報に関して以下の権利があります：
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>アクセス権</strong>：当社が保持しているお客様の個人情報へのアクセスを要求する権利。
              </li>
              <li>
                <strong>修正権</strong>：不正確または不完全な個人情報の修正を要求する権利。
              </li>
              <li>
                <strong>削除権</strong>：特定の状況下で、個人情報の削除を要求する権利。
              </li>
              <li>
                <strong>処理制限権</strong>：特定の状況下で、個人情報の処理を制限するよう要求する権利。
              </li>
              <li>
                <strong>異議申立権</strong>：特定の状況下で、個人情報の処理に異議を唱える権利。
              </li>
            </ul>
            <p className="mt-4">
              これらの権利を行使するには、下記の連絡先までご連絡ください。
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-start">
          <FaEnvelope className="text-primary text-3xl mr-4 mt-1 flex-shrink-0" />
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">7. プライバシーポリシーの変更</h2>
            <p>
              当社は、必要に応じて本プライバシーポリシーを更新することがあります。
              重要な変更がある場合は、本サービス上で通知するか、登録されたメールアドレスに直接通知します。
              変更後も本サービスを継続して利用する場合、お客様は変更後のプライバシーポリシーに同意したものとみなされます。
            </p>
            <h3 className="text-xl font-medium mt-4 mb-2">8. お問い合わせ</h3>
            <p>
              本プライバシーポリシーに関するご質問やご懸念がある場合は、以下の連絡先までお問い合わせください：
            </p>
            <p className="mt-2">
              メール：privacy@videotoolbox.example.com
            </p>
          </div>
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