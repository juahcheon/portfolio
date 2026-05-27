import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://portfolio-dusky-three-v0owey1kvg.vercel.app/sitemap.xml",
  };
}
