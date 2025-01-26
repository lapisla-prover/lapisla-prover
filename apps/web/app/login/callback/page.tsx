"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

async function handleCallback(router: any) {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (!code) {
      throw new Error("認証コードが見つかりません。");
    }

    // バックエンドにリクエストを送信してトークンを取得
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/login/callback?code=${code}&state=${state}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("認証処理に失敗しました。");
    }

    window.location.href = "/files";
  } catch (error) {
    console.error("コールバック処理中にエラーが発生しました:", error);
    alert("ログイン処理中にエラーが発生しました。");
  }
}

const CallbackPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    handleCallback(router);
  }, [router]);

  return <div>ログイン処理中...</div>;
};

export default CallbackPage;
