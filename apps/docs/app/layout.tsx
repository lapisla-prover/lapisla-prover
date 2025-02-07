import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import { FaUpRightFromSquare } from "react-icons/fa6";
import style from "./layout.module.css";

export const metadata = {
  // Define your metadata here
  // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
  title: "Lapisla - The User-Friendly Theorem Proof Platform",
};

const navbar = (
  <Navbar
    logo={<b>Lapisla</b>}
    projectLink="https://github.com/lapisla-prover/lapisla-prover"
  >
    <a
      href="https://lapisla.net"
      target="_blank"
      rel="noreferrer"
      className={style.link}
    >
      <FaUpRightFromSquare /> Try Lapisla Now!
    </a>
  </Navbar>
);
const footer = (
  <Footer>
    MIT {new Date().getFullYear()} © Lapisla. Powered by&nbsp;
    <a
      href="https://nextra.site"
      target="_blank"
      rel="noreferrer"
      className={style.simpleLink}
    >
      nextra
    </a>
  </Footer>
);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      // Not required, but good for SEO
      lang="en"
      // Required to be set
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css"
        />
      </Head>
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/lapisla-prover/lapisla-prover/tree/main/apps/docs"
          footer={footer}
          // ... Your additional layout options
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
