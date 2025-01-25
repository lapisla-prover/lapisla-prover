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

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center text-5xl m-6">
        The User-Friendly
        <br /> Theorem Proof Platform
      </div>
      <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center font-black text-9xl m-8 mb-16">
        Lapisla.net
      </div>
      <div className="flex">
        <a href="https://github.com/lapisla-prover/lapisla-prover">
          <img
            src="/mark-github.svg"
            alt="github-icon"
            className="m-2 h-8 w-8"
          />
        </a>
        <a href="">
          <Book className="m-2 h-8 w-8" />
        </a>
      </div>
      <Button className="m-2">Login with GitHub</Button>
    </div>
  );
}
