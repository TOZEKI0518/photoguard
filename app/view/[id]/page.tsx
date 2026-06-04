"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type StoredPhotoGuardData = {
  id: string;
  buyerName: string;
  password: string;
  days: string;
  message: string;
  files: string[];
};

export default function ViewPage() {
  const params = useParams();
  const [index, setIndex] = useState(0);
  const [data, setData] = useState<StoredPhotoGuardData | null>(null);

  useEffect(() => {
    const id = params.id as string;
    const saved = localStorage.getItem(`photoguard-${id}`);

    if (saved) {
      setData(JSON.parse(saved));
    }
  }, [params.id]);

  const total = data?.files.length || 0;
  const currentImage = data?.files[index];

  const next = () => {
    if (index < total - 1) setIndex(index + 1);
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  if (!data) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        データが見つかりません
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-black text-white select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="flex items-center justify-between p-4">
        <span>PhotoGuard</span>
        <span>
          {index + 1} / {total}
        </span>
      </div>

      <div className="relative mx-auto flex h-[75vh] max-w-md items-center justify-center bg-neutral-900 overflow-hidden">
        {currentImage ? (
          <img
            src={currentImage}
            alt={`photo-${index + 1}`}
            draggable={false}
            className="max-h-full max-w-full object-contain pointer-events-none"
          />
        ) : (
          <div className="text-center text-gray-400">
            <div className="text-6xl">🖼️</div>
            <p className="mt-4">画像がありません</p>
          </div>
        )}

        <div className="pointer-events-none absolute rotate-[-25deg] text-xl text-white/35">
          USER: {data.buyerName} / {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-md justify-between px-6">
        <button
          onClick={prev}
          className="rounded-full bg-white/10 px-6 py-3"
        >
          ← 前へ
        </button>

        <button
          onClick={next}
          className="rounded-full bg-pink-500 px-6 py-3 font-bold"
        >
          次へ →
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-gray-400">
        このコンテンツはダウンロード・保存・右クリックできません
      </p>
    </main>
  );
}