"use client";

import { useRouter, useParams } from "next/navigation";
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

export default function PasswordPage() {
  const router = useRouter();
  const params = useParams();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
        setError("データが見つかりません");
        setIsLoading(false);
        return;
      }

      setData(data as GalleryData);
      setIsLoading(false);
    };

    fetchGallery();
  }, [params.id]);

  const handleSubmit = () => {
    if (!data) {
      setError("データが見つかりません");
      return;
    }

    if (password === data.password) {
      router.push(`/view/${params.id}`);
    } else {
      setError("パスワードが違います");
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white p-6 text-gray-900">
        読み込み中...
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-center text-3xl font-extrabold text-gray-950">
          Photo<span className="text-pink-500">Guard</span>
        </h1>

        <div className="mt-6 rounded-3xl bg-pink-50 p-6 text-center">
          <p className="text-5xl">🔒</p>
          <h2 className="mt-4 text-xl font-extrabold text-gray-950">
            この写真集は保護されています
          </h2>
          <p className="mt-2 text-sm font-bold text-gray-700">
            パスワードを入力してください
          </p>

          {data?.message && (
            <p className="mt-4 rounded-2xl bg-white p-3 text-sm font-bold text-gray-700">
              {data.message}
            </p>
          )}
        </div>

        <input
          className="mt-6 w-full rounded-2xl border border-gray-300 p-4 text-base font-bold text-gray-900 placeholder:text-gray-500"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="mt-2 text-sm font-bold text-red-500">{error}</p>}

        <button
          onClick={handleSubmit}
          className="mt-4 w-full rounded-2xl bg-pink-500 p-4 text-lg font-extrabold text-white active:scale-[0.99]"
        >
          閲覧する
        </button>
      </div>
    </main>
  );
}
