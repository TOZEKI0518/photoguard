"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
  const [agreed, setAgreed] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [sessionCode, setSessionCode] = useState("");

  useEffect(() => {
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    setSessionCode(code);
  }, []);

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

  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();

    const preventKeys = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (
        key === "printscreen" ||
        key === "f12" ||
        (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) ||
        (e.ctrlKey && ["s", "p", "u", "c", "a"].includes(key)) ||
        (e.metaKey && ["s", "p", "u", "c", "a"].includes(key))
      ) {
        e.preventDefault();
        setBlocked(true);
        setTimeout(() => setBlocked(false), 1800);
      }
    };

    const handleBlur = () => {
      setBlocked(true);
      setTimeout(() => setBlocked(false), 1200);
    };

    document.addEventListener("contextmenu", preventDefault);
    document.addEventListener("dragstart", preventDefault);
    document.addEventListener("selectstart", preventDefault);
    document.addEventListener("copy", preventDefault);
    document.addEventListener("cut", preventDefault);
    document.addEventListener("keydown", preventKeys);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("contextmenu", preventDefault);
      document.removeEventListener("dragstart", preventDefault);
      document.removeEventListener("selectstart", preventDefault);
      document.removeEventListener("copy", preventDefault);
      document.removeEventListener("cut", preventDefault);
      document.removeEventListener("keydown", preventKeys);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  const total = data?.files.length || 0;
  const currentImage = data?.files[index];

  const watermarkText = useMemo(() => {
    const user = data?.buyer_name || "USER";
    const date = new Date().toLocaleString();
    const id = data?.id?.slice(0, 6).toUpperCase() || "ID";
    return `${user} / ${date} / ${id} / ${sessionCode}`;
  }, [data, sessionCode]);

  const microWatermarks = useMemo(() => {
    return Array.from({ length: 84 }, (_, i) => ({
      id: i,
      left: `${(i * 17) % 100}%`,
      top: `${(i * 23) % 100}%`,
      rotate: i % 2 === 0 ? "-24deg" : "24deg",
      opacity: i % 4 === 0 ? "0.09" : "0.052",
      size: i % 5 === 0 ? "12px" : "10px",
    }));
  }, []);

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

  if (!agreed) {
    return (
      <main className="min-h-screen bg-black p-5 text-white">
        <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-neutral-900 p-6">
          <h1 className="text-3xl font-extrabold">
            Photo<span className="text-pink-500">Guard</span>
          </h1>

          <div className="mt-6 rounded-3xl bg-pink-500/10 p-5">
            <p className="text-4xl">🛡️</p>
            <h2 className="mt-4 text-xl font-extrabold">
              閲覧前の注意事項
            </h2>
            <p className="mt-3 text-sm font-bold leading-6 text-gray-200">
              この写真集は購入者ごとに識別情報が付与されています。
              スクリーンショット、画面録画、撮影、転載、URL・PW共有は禁止されています。
            </p>
          </div>

          <ul className="mt-5 space-y-3 text-sm font-bold text-gray-200">
            <li>✓ ダウンロード・保存・右クリックは禁止されています。</li>
            <li>✓ 画面全体に購入者識別用の透かしが表示されます。</li>
            <li>✓ 流出が確認された場合、購入者情報から確認できる場合があります。</li>
            <li>✓ ブラウザではOS標準スクショを完全には防げません。</li>
          </ul>

          <div className="mt-5 rounded-2xl bg-white/5 p-4 text-xs leading-6 text-gray-300">
            <p className="font-bold text-white">利用規約</p>
            <p className="mt-2">
              本コンテンツの複製、転載、再配布、画面録画、スクリーンショット、
              第三者へのURL・パスワード共有は禁止です。違反行為により損害が発生した場合、
              販売者が必要な措置を講じることがあります。
            </p>
          </div>

          <button
            onClick={() => setAgreed(true)}
            className="mt-6 w-full rounded-2xl bg-pink-500 p-4 text-lg font-extrabold text-white active:scale-[0.99]"
          >
            同意して閲覧する
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen select-none bg-black text-white"
      onContextMenu={(e) => e.preventDefault()}
      style={{
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    >
      {blocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-center text-white">
          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
            <p className="text-4xl">🛡️</p>
            <p className="mt-4 text-lg font-extrabold">
              コンテンツ保護のため一時的に非表示にしました
            </p>
          </div>
        </div>
      )}

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
            className="pointer-events-none max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="text-center text-gray-400">
            <div className="text-6xl">🖼️</div>
            <p className="mt-4">画像がありません</p>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {microWatermarks.map((item) => (
            <span
              key={item.id}
              className="absolute whitespace-nowrap font-bold tracking-widest text-white"
              style={{
                left: item.left,
                top: item.top,
                fontSize: item.size,
                transform: `translate(-50%, -50%) rotate(${item.rotate})`,
                opacity: item.opacity,
                textShadow: "0 0 1px rgba(255,255,255,0.5)",
              }}
            >
              {watermarkText}
            </span>
          ))}
        </div>

        <div className="pointer-events-none absolute rotate-[-25deg] text-xl font-bold text-white/25">
          USER: {data.buyer_name} / {new Date().toLocaleDateString()} / {sessionCode}
        </div>

        <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/45 px-3 py-1 text-[10px] font-bold text-white/70">
          Protected ID: {data.id.slice(0, 8).toUpperCase()}
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-md justify-between px-6">
        <button
          onClick={prev}
          className="rounded-full bg-white/10 px-6 py-3 font-bold"
        >
          ← 前へ
        </button>

        <button
          onClick={next}
          className="rounded-full bg-pink-500 px-6 py-3 font-extrabold"
        >
          次へ →
        </button>
      </div>

      <p className="mt-6 px-5 text-center text-sm font-bold leading-6 text-gray-400">
        このコンテンツはダウンロード・保存・右クリックできません。
        ブラウザ版ではスクリーンショットを完全に防止することはできないため、
        購入者識別透かしにより流出抑止を行っています。
      </p>
    </main>
  );
}
