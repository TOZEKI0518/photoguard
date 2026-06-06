export default function NoticePage() {
  return (
    <main className="min-h-screen bg-white px-5 py-8 text-gray-900">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-extrabold text-gray-950">
          購入者向け注意事項
        </h1>

        <div className="mt-6 rounded-3xl bg-pink-50 p-6">
          <p className="text-4xl">🛡️</p>
          <h2 className="mt-4 text-2xl font-extrabold text-gray-950">
            この写真集は保護されています
          </h2>
          <p className="mt-3 text-sm font-bold leading-7 text-gray-700">
            本コンテンツには購入者ごとの識別情報が付与されています。
            無断転載や共有が確認された場合、流出元を確認できる場合があります。
          </p>
        </div>

        <ul className="mt-8 space-y-4 text-base font-bold leading-7 text-gray-800">
          <li>・URLおよびパスワードを第三者へ共有しないでください。</li>
          <li>・スクリーンショット、画面録画、外部機器による撮影は禁止です。</li>
          <li>・SNS、掲示板、クラウドストレージ等への転載は禁止です。</li>
          <li>・コンテンツには購入者識別用の透かしが表示されます。</li>
          <li>・保存期限を過ぎると閲覧できなくなる場合があります。</li>
          <li>・不正利用が確認された場合、閲覧停止等の措置を行う場合があります。</li>
        </ul>

        <p className="mt-8 rounded-2xl border border-gray-200 p-4 text-sm font-bold leading-6 text-gray-700">
          ※ブラウザ版ではOS標準のスクリーンショットを完全に防止することはできません。
          そのためPhotoGuardでは、透かし・識別情報・閲覧制限による流出抑止を行っています。
        </p>
      </div>
    </main>
  );
}
