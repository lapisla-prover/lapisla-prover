import nextra from "nextra";
import { bundledLanguages, getSingletonHighlighter } from "shiki";
import lapislaSyntax from "./public/lapisla-syntax.json" with { type: "json" };

const withNextra = nextra({
  latex: true,
  mdxOptions: {
    rehypePrettyCodeOptions: {
      getHighlighter: (options) =>
        getSingletonHighlighter({
          ...options,
          langs: [...Object.keys(bundledLanguages), lapislaSyntax],
        }),
    },
  },
});

// You can include other Next.js configuration options here, in addition to Nextra settings:
const nextConfig = withNextra({
  // ... Other Next.js config options
});

export default nextConfig;
