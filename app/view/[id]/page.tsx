"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../../src/lib/supabase";

type GalleryData = {
  id: string;
  buyer_name: string;
  password: string;
  days: string;
  message: string | null;
  files: string[];
  created_at: string;
};

export default function ViewPage() {
  const params = useParams();
  const [index, setIndex] = useState(0);
  const [data, setData] = useState<GalleryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      const id = params.id as string;

      const { data, error } = await supabase
        .from("galleries")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setData(null);
        setIsLoading(false);
        return;
      }

      setData(data as GalleryData);
      setIsLoading(false);
    };

    fetchGallery();
  }, [params.id]);

  const total = data?.files.length || 0;
  const currentImage = data?.files[index];

  const next = () => {
    if (index < total - 1) setIndex(index + 1);
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        読み込み中...
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        データが見つかりません
      </main>
    );
  }

  return (
    <main
      className="min-h-screen select-none bg-black text-white"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="flex items-center justify-between p-4">
        <span className="font-bold">PhotoGuard</span>
        <span className="font-bold">
          {index + 1} / {total}
        </span>
      </div>

      <div className="relative mx-auto flex h-[75vh] max-w-md items-center justify-center overflow-hidden bg-neutral-900">
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

        <div className="pointer-events-none absolute rotate-[-25deg] text-xl font-bold text-white/35">
          USER: {data.buyer_name} / {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-md justify-between px-6">
        <button onClick={prev} className="rounded-full bg-white/10 px-6 py-3 font-bold">
          ← 前へ
        </button>

        <button onClick={next} className="rounded-full bg-pink-500 px-6 py-3 font-extrabold">
          次へ →
        </button>
      </div>

      <p className="mt-6 text-center text-sm font-bold text-gray-400">
        このコンテンツはダウンロード・保存・右クリックできません
      </p>
    </main>
  );
}
