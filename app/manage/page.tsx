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
    <main className="min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold">
        Photo<span className="text-pink-500">Guard</span>
      </h1>

      <h2 className="mt-8 text-2xl font-bold">管理画面</h2>

      {items.length === 0 ? (
        <p className="mt-6 text-gray-500">発行済みURLはありません。</p>
      ) : (
        <div className="mt-6 space-y-4">
          {items.map((item) => {
            const url = `http://localhost:3000/password/${item.id}`;

            return (
              <div key={item.id} className="rounded-2xl border p-4">
                <p className="font-bold">購入者：{item.buyerName}</p>
                <p className="mt-2 text-sm text-gray-600">
                  保存期間：{item.days}日 / 写真数：{item.files.length}枚
                </p>

                <div className="mt-4 rounded-xl bg-pink-50 p-3 text-sm">
                  <p className="font-bold">URL</p>
                  <p className="break-all">{url}</p>

                  <p className="mt-3 font-bold">PW</p>
                  <p>{item.password}</p>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => navigator.clipboard.writeText(url)}
                    className="rounded-xl bg-pink-500 px-4 py-2 text-white"
                  >
                    URLコピー
                  </button>

                  <button
                    onClick={() => deleteItem(item.id)}
                    className="rounded-xl border px-4 py-2"
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