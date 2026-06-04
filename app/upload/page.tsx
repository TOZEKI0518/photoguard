"use client";

import { useState } from "react";

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
  };

  const handleGenerate = () => {
    const id = Math.random().toString(36).slice(2, 11);
    const pw = password || makePassword();

    const data: StoredPhotoGuardData = {
      id,
      buyerName: buyerName || "購入者",
      password: pw,
      days,
      message: message || "写真集のご購入ありがとうございます。",
      files: previewUrls,
    };

    localStorage.setItem(`photoguard-${id}`, JSON.stringify(data));

    setGeneratedUrl(`http://localhost:3000/password/${id}`);
    setGeneratedPw(pw);
    setGenerated(true);
  };

  return (
    <main className="min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold mb-6">写真アップロード</h1>

      <label className="block border-2 border-dashed border-pink-300 rounded-xl p-10 text-center cursor-pointer">
        <p className="text-lg font-semibold">JPG / PNG / PDF</p>
        <p className="text-gray-500 mt-2">クリックして選択</p>
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
          <h2 className="font-bold">選択ファイル</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {previewUrls.map((url, index) => (
              <img
                key={url}
                src={url}
                alt={`preview-${index}`}
                className="h-40 w-full rounded-xl object-cover border"
              />
            ))}
          </div>

          {files.map((file) => (
            <div key={file.name} className="border rounded-xl p-3">
              {file.name}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div>
          <label className="font-bold">保存期間</label>
          <select
            className="w-full border rounded-xl p-3 mt-2"
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
          <label className="font-bold">パスワード</label>
          <input
            className="w-full border rounded-xl p-3 mt-2"
            placeholder="未入力なら自動生成"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="font-bold">購入者名</label>
          <input
            className="w-full border rounded-xl p-3 mt-2"
            placeholder="例：山田太郎"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
          />
        </div>

        <div>
          <label className="font-bold">メッセージ</label>
          <textarea
            className="w-full border rounded-xl p-3 mt-2"
            placeholder="写真集のご購入ありがとうございます。"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button
          onClick={handleGenerate}
          className="w-full bg-pink-500 text-white rounded-xl p-4 font-bold"
        >
          URLを生成する
        </button>
      </div>

      {generated && (
        <div className="mt-8 rounded-2xl bg-pink-50 p-6 space-y-4">
          <h2 className="text-2xl font-bold">URL発行完了</h2>

          <div>
            <p className="font-bold">閲覧URL</p>
            <div className="border rounded-xl p-3 bg-white mt-2">
              {generatedUrl}
            </div>
          </div>

          <div>
            <p className="font-bold">PW</p>
            <div className="border rounded-xl p-3 bg-white mt-2">
              {generatedPw}
            </div>
          </div>

          <p className="text-sm text-gray-600">
            保存期間：{days}日 / 購入者：{buyerName || "未設定"}
          </p>
        </div>
      )}
    </main>
  );
}