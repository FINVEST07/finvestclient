import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/", // Home page and sections crawl kar sakte hain
        disallow: ["/admin", "/dashboard"], // Sensitive pages block kar rahe hain
      },
    ],
    sitemap: "https://www.ankurmaternityhospital.in/sitemap.xml", // Aapka sitemap URL
  };
}
