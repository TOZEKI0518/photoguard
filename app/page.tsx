export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b p-4">
        <h1 className="text-3xl font-bold">
          Photo<span className="text-pink-500">Guard</span>
        </h1>
        <p className="text-gray-500 mt-2">
          ギガファイル便のように簡単。でも写真は保護される。
        </p>
      </div>

      {/* Hero */}
      <section className="p-6">
        <div className="rounded-2xl bg-pink-50 p-6">
          <h2 className="text-2xl font-bold mb-4">
            写真集を安全に共有
          </h2>

          <ul className="space-y-2">
            <li>✅ ダウンロード不可</li>
            <li>✅ スクリーンショット抑止</li>
            <li>✅ 購入者別透かし</li>
            <li>✅ URL・PW自動発行</li>
          </ul>
        </div>
      </section>

      {/* Menu */}
      <section className="p-6">
        <div className="grid gap-4">
          <a
            href="/upload"
            className="bg-pink-500 text-white rounded-xl p-4 text-center font-bold"
          >
            写真をアップロード
          </a>

          <a
            href="/manage"
            className="border rounded-xl p-4 text-center"
          >
            管理画面
          </a>
        </div>
      </section>
    </main>
  );
}