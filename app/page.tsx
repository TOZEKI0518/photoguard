export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 px-5 py-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-950">
          Photo<span className="text-pink-500">Guard</span>
        </h1>
        <p className="mt-3 text-base font-medium text-gray-700">
          かんたんに送れて、大切な写真はしっかり保護。
        </p>
      </header>

      {/* Hero */}
      <section className="px-5 py-6">
        <div className="rounded-3xl border border-pink-100 bg-pink-50 p-6 shadow-sm">
          <h2 className="text-2xl font-extrabold text-gray-950">
            写真集を安全に共有
          </h2>

          <div className="mt-5 grid gap-4 text-base font-bold text-gray-900">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl shadow-sm">
                📥
              </span>
              <span>ダウンロード不可</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl shadow-sm">
                🛡️
              </span>
              <span>スクリーンショット抑止</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl shadow-sm">
                👤
              </span>
              <span>購入者別透かし</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl shadow-sm">
                🔗
              </span>
              <span>URL・PW自動発行</span>
            </div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section className="px-5 pb-8">
        <div className="grid gap-4">
          <a
            href="/upload"
            className="rounded-2xl bg-pink-500 p-4 text-center text-lg font-extrabold text-white shadow-sm active:scale-[0.99]"
          >
            写真をアップロード
          </a>

          <a
            href="/manage"
            className="rounded-2xl border border-pink-200 bg-white p-4 text-center text-lg font-extrabold text-pink-500 shadow-sm active:scale-[0.99]"
          >
            管理画面
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-5 py-6 text-center text-sm font-bold">
        <div className="flex flex-col gap-3">
          <a href="/terms" className="text-pink-500 underline">
            利用規約
          </a>
          <a href="/notice" className="text-pink-500 underline">
            購入者向け注意事項
          </a>
        </div>
      </footer>
    </main>
  );
}
