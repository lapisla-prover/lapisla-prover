import Image, { type ImageProps } from "next/image";
import { Button } from "@/components/ui/button";

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
      <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center font-black text-9xl m-8">
        Lapisla.net
      </div>
      <Button className="m-8">Login with GitHub</Button>
    </div>
  );
}
