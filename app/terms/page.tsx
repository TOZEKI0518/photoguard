export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white px-5 py-8 text-gray-900">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold text-gray-950">
          Photo<span className="text-pink-500">Guard</span> 利用規約
        </h1>

        <p className="mt-4 text-sm font-bold leading-7 text-gray-700">
          本利用規約は、PhotoGuardを通じて共有される写真・画像・PDF等のコンテンツの
          閲覧および利用条件を定めるものです。
        </p>

        <section className="mt-8 space-y-6 text-sm font-medium leading-7 text-gray-800">
          <div>
            <h2 className="text-xl font-extrabold text-gray-950">第1条 コンテンツの権利</h2>
            <p className="mt-2">
              本サービスで共有されるコンテンツの著作権、肖像権その他の権利は、
              販売者または正当な権利者に帰属します。
            </p>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-gray-950">第2条 禁止事項</h2>
            <p className="mt-2">
              利用者は、スクリーンショット、画面録画、外部機器による撮影、保存、
              ダウンロード、転載、再配布、SNS投稿、第三者へのURL・パスワード共有を行ってはなりません。
            </p>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-gray-950">第3条 保護機能</h2>
            <p className="mt-2">
              本サービスでは、購入者識別情報、閲覧日時、識別コード等を透かしとして表示する場合があります。
              これらは不正利用の抑止および流出元確認を目的とします。
            </p>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-gray-950">第4条 閲覧履歴等</h2>
            <p className="mt-2">
              コンテンツ保護のため、閲覧日時、アクセス情報、識別情報等を記録する場合があります。
              これらの情報は不正利用の確認、サービス改善、権利保護の目的で利用されます。
            </p>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-gray-950">第5条 免責事項</h2>
            <p className="mt-2">
              本サービスは不正利用の抑止と流出元確認を目的とした保護機能を提供します。
              利用者は、コンテンツの権利を尊重し、禁止事項に違反しないものとします。
            </p>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-gray-950">第6条 違反時の対応</h2>
            <p className="mt-2">
              利用者が本規約に違反した場合、販売者または運営者は閲覧停止、アクセス制限、
              損害賠償請求、その他必要な措置を行うことがあります。
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
