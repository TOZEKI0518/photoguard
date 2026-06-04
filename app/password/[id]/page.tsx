"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

type StoredPhotoGuardData = {
  id: string;
  buyerName: string;
  password: string;
  days: string;
  message: string;
  files: string[];
};

export default function PasswordPage() {
  const router = useRouter();
  const params = useParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState<StoredPhotoGuardData | null>(null);

  useEffect(() => {
    const id = params.id as string;
    const saved = localStorage.getItem(`photoguard-${id}`);

    if (saved) {
      setData(JSON.parse(saved));
    }
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

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-center">
          Photo<span className="text-pink-500">Guard</span>
        </h1>

        <div className="mt-6 rounded-2xl bg-pink-50 p-6 text-center">
          <p className="text-4xl">🔒</p>
          <h2 className="mt-4 text-xl font-bold">
            この写真集は保護されています
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            パスワードを入力してください
          </p>
          {data?.message && (
            <p className="mt-4 text-sm text-gray-700">{data.message}</p>
          )}
        </div>

        <input
          className="mt-6 w-full rounded-xl border p-3"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

        <button
          onClick={handleSubmit}
          className="mt-4 w-full rounded-xl bg-pink-500 p-4 font-bold text-white"
        >
          閲覧する
        </button>
      </div>
    </main>
  );
}