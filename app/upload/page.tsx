"use client";

import { useState } from "react";
import { supabase } from "../../src/lib/supabase";

type StoredPhotoGuardData = {
  id: string;
  buyerName: string;
  password: string;
  days: string;
  message: string;
  files: string[];
};

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [days, setDays] = useState("7");
  const [password, setPassword] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [message, setMessage] = useState("");
  const [generated, setGenerated] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [generatedPw, setGeneratedPw] = useState("");
  const [copiedTarget, setCopiedTarget] = useState<"url" | "pw" | "">("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const makePassword = () => {
    return Math.random().toString(36).slice(2, 8).toUpperCase();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    const urls = selectedFiles
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => URL.createObjectURL(file));

    setPreviewUrls(urls);
    setGenerated(false);
    setGeneratedUrl("");
    setGeneratedPw("");
    setUploadError("");
  };

  const copyText = async (text: string, target: "url" | "pw") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTarget(target);
      setTimeout(() => setCopiedTarget(""), 1200);
    } catch {
      alert("コピーに失敗しました。手動でコピーしてください。");
    }
  };

  const uploadFilesToSupabase = async (id: string) => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;

      const extension = file.name.split(".").pop() || "jpg";
      const safeFileName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${extension}`;
      const filePath = `${id}/${safeFileName}`;

      const { error } = await supabase.storage
        .from("photos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (error) throw error;

      const { data } = supabase.storage.from("photos").getPublicUrl(filePath);
      uploadedUrls.push(data.publicUrl);
    }

    return uploadedUrls;
  };

  const handleGenerate = async () => {
    setUploadError("");

    if (files.length === 0) {
      setUploadError("ファイルを選択してください。");
      return;
    }

    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      setUploadError(
        "現在のMVPではJPG/PNG画像のみ閲覧できます。PDF対応は次のSprintで追加します。"
      );
      return;
    }

    setIsUploading(true);

    try {
      const id = Math.random().toString(36).slice(2, 11);
      const pw = password || makePassword();

      const uploadedUrls = await uploadFilesToSupabase(id);

      const galleryData: StoredPhotoGuardData = {
        id,
        buyerName: buyerName || "購入者",
        password: pw,
        days,
        message: message || "写真集のご購入ありがとうございます。",
        files: uploadedUrls,
      };

      const { error: dbError } = await supabase.from("galleries").insert({
        id: galleryData.id,
        buyer_name: galleryData.buyerName,
        password: galleryData.password,
        days: galleryData.days,
        message: galleryData.message,
        files: galleryData.files,
      });

      if (dbError) throw dbError;

      // 管理画面用。閲覧側はSupabase DBから取得します。
      localStorage.setItem(`photoguard-${id}`, JSON.stringify(galleryData));

      const baseUrl = window.location.origin;
      setGeneratedUrl(`${baseUrl}/password/${id}`);
      setGeneratedPw(pw);
      setGenerated(true);
      setCopiedTarget("");
    } catch (error) {
      console.error("Supabase error:", error);

      const message =
        error instanceof Error ? error.message : JSON.stringify(error);

      setUploadError(`Supabaseエラー: ${message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-5 py-6 text-gray-900">
      <div className="mb-6">
        <a href="/" className="text-sm font-bold text-pink-500">
          ← トップへ戻る
        </a>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-950">
          写真アップロード
        </h1>
        <p className="mt-2 text-base font-medium text-gray-700">
          写真を選択して、保存期間・PW・購入者名を設定します。
        </p>
      </div>

      <label className="block cursor-pointer rounded-3xl border-2 border-dashed border-pink-300 bg-pink-50/50 p-8 text-center active:scale-[0.99]">
        <p className="text-lg font-extrabold text-gray-950">JPG / PNG / PDF</p>
        <p className="mt-2 text-base font-bold text-gray-700">クリックして選択</p>
        <p className="mt-2 text-sm text-gray-600">複数ファイルを選択できます</p>
        <input
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
          onChange={handleChange}
        />
      </label>

      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <h2 className="text-xl font-extrabold text-gray-950">選択ファイル</h2>

          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {previewUrls.map((url, index) => (
                <img
                  key={url}
                  src={url}
                  alt={`preview-${index}`}
                  className="h-40 w-full rounded-2xl border object-cover shadow-sm"
                />
              ))}
            </div>
          )}

          {files.map((file) => (
            <div
              key={file.name}
              className="rounded-2xl border border-gray-200 p-3 text-sm font-bold text-gray-800"
            >
              {file.name}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 space-y-5">
        <div>
          <label className="text-base font-extrabold text-gray-950">保存期間</label>
          <select
            className="mt-2 w-full rounded-2xl border border-gray-300 bg-white p-4 text-base font-bold text-gray-900"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          >
            <option value="1">1日</option>
            <option value="3">3日</option>
            <option value="7">7日</option>
            <option value="14">14日</option>
          </select>
        </div>

        <div>
          <label className="text-base font-extrabold text-gray-950">パスワード</label>
          <input
            className="mt-2 w-full rounded-2xl border border-gray-300 p-4 text-base font-bold text-gray-900 placeholder:text-gray-500"
            placeholder="未入力なら自動生成"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="text-base font-extrabold text-gray-950">購入者名</label>
          <input
            className="mt-2 w-full rounded-2xl border border-gray-300 p-4 text-base font-bold text-gray-900 placeholder:text-gray-500"
            placeholder="例：山田太郎"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-base font-extrabold text-gray-950">メッセージ</label>
          <textarea
            className="mt-2 w-full rounded-2xl border border-gray-300 p-4 text-base font-bold text-gray-900 placeholder:text-gray-500"
            placeholder="写真集のご購入ありがとうございます。"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {uploadError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
            {uploadError}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isUploading}
          className="w-full rounded-2xl bg-pink-500 p-4 text-lg font-extrabold text-white shadow-sm active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-pink-300"
        >
          {isUploading ? "アップロード中..." : "URLを生成する"}
        </button>
      </div>

      {generated && (
        <div className="mt-8 space-y-4 rounded-3xl border border-pink-100 bg-pink-50 p-6 shadow-sm">
          <h2 className="text-2xl font-extrabold text-gray-950">URL発行完了</h2>

          <div>
            <p className="font-extrabold text-gray-950">閲覧URL</p>

            <div className="mt-2 flex gap-2">
              <div className="flex-1 break-all rounded-2xl border bg-white p-3 text-sm font-bold text-gray-800">
                {generatedUrl}
              </div>

              <button
                onClick={() => copyText(generatedUrl, "url")}
                className="shrink-0 rounded-2xl bg-pink-500 px-4 py-3 font-extrabold text-white active:scale-[0.98]"
              >
                コピー
              </button>
            </div>

            {copiedTarget === "url" && (
              <p className="mt-2 text-sm font-bold text-pink-600">✓ URLをコピーしました</p>
            )}
          </div>

          <div>
            <p className="font-extrabold text-gray-950">PW</p>

            <div className="mt-2 flex gap-2">
              <div className="flex-1 rounded-2xl border bg-white p-3 text-lg font-extrabold text-gray-950">
                {generatedPw}
              </div>

              <button
                onClick={() => copyText(generatedPw, "pw")}
                className="shrink-0 rounded-2xl bg-pink-500 px-4 py-3 font-extrabold text-white active:scale-[0.98]"
              >
                コピー
              </button>
            </div>

            {copiedTarget === "pw" && (
              <p className="mt-2 text-sm font-bold text-pink-600">✓ PWをコピーしました</p>
            )}
          </div>

          <p className="text-sm font-bold text-gray-700">
            保存期間：{days}日 / 購入者：{buyerName || "未設定"}
          </p>
        </div>
      )}
    </main>
  );
}
