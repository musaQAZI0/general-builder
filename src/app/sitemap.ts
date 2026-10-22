import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/services";

const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/contact",
    ...SERVICES.map((service) => `/services/${service.slug}`),
    ...["richmond", "clapham", "hampstead", "ealing"].map((area) => `/areas/${area}`),
  ];

  return paths.map((path) => ({
    url: new URL(path, baseUrl).toString(),
  }));
}
