"use client";

import Image, { type ImageProps } from "next/image";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

async function login() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      credentials: "include",
    });
    const data = await response.json();
    window.location.href = data.url;
  } catch (error) {
    console.error(error);
  }
}

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-32">
      {/* メインタイトル */}
      <div className="flex flex-col items-center justify-center w-full px-6 sm:px-20 text-center text-3xl sm:text-5xl font-semibold m-4 sm:m-6">
        The User-Friendly
        <br /> Theorem Proof Platform
      </div>

      {/* サブタイトル */}
      <div className="flex flex-col items-center justify-center w-full px-6 sm:px-20 text-center font-black text-5xl sm:text-9xl m-6 sm:m-8 mb-12 sm:mb-16">
        Lapisla.net
      </div>

      {/* アイコンリンク */}
      <div className="flex space-x-4">
        <a href="https://github.com/lapisla-prover/lapisla-prover">
          <img src="/mark-github.svg" alt="github-icon" className="h-6 w-6 sm:h-8 sm:w-8" />
        </a>
        <a href="">
          <Book className="h-6 w-6 sm:h-8 sm:w-8" />
        </a>
      </div>

      {/* ログインボタン */}
      <Button className="mt-6 sm:mt-8 flex items-center" onClick={login}>
        Login with GitHub
        <img src="/mark-github.svg" alt="github-icon" className="ml-2 h-4 w-4 sm:h-6 sm:w-6" />
      </Button>
    </div>
  );
}
