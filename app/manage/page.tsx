"use client";

import { useEffect, useState } from "react";

type PhotoGuardData = {
  id: string;
  buyerName: string;
  password: string;
  days: string;
  message: string;
  files: string[];
};

export default function ManagePage() {
  const [items, setItems] = useState<PhotoGuardData[]>([]);

  const loadItems = () => {
    const list: PhotoGuardData[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith("photoguard-")) continue;

      const saved = localStorage.getItem(key);
      if (saved) list.push(JSON.parse(saved));
    }

    setItems(list);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const deleteItem = (id: string) => {
    localStorage.removeItem(`photoguard-${id}`);
    loadItems();
  };

  return (
    <main className="min-h-screen bg-white px-5 py-6 text-gray-900">
      <a href="/" className="text-sm font-bold text-pink-500">
        ← トップへ戻る
      </a>

      <h1 className="mt-4 text-4xl font-extrabold text-gray-950">
        Photo<span className="text-pink-500">Guard</span>
      </h1>

      <h2 className="mt-8 text-2xl font-extrabold text-gray-950">管理画面</h2>

      {items.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-pink-50 p-5 font-bold text-gray-700">
          発行済みURLはありません。
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {items.map((item) => {
            const url = `${window.location.origin}/password/${item.id}`;

            return (
              <div key={item.id} className="rounded-3xl border border-gray-200 p-4 shadow-sm">
                <p className="text-lg font-extrabold text-gray-950">購入者：{item.buyerName}</p>
                <p className="mt-2 text-sm font-bold text-gray-700">
                  保存期間：{item.days}日 / 写真数：{item.files.length}枚
                </p>

                <div className="mt-4 rounded-2xl bg-pink-50 p-4 text-sm">
                  <p className="font-extrabold text-gray-950">URL</p>
                  <p className="break-all font-bold text-gray-800">{url}</p>

                  <p className="mt-3 font-extrabold text-gray-950">PW</p>
                  <p className="font-extrabold text-gray-950">{item.password}</p>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => navigator.clipboard.writeText(url)}
                    className="rounded-2xl bg-pink-500 px-4 py-3 font-extrabold text-white"
                  >
                    URLコピー
                  </button>

                  <button
                    onClick={() => deleteItem(item.id)}
                    className="rounded-2xl border border-gray-300 px-4 py-3 font-extrabold text-gray-900"
                  >
                    削除
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
