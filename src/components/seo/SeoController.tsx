/**
 * Controla meta etiquetas básicas para SEO según la ruta actual.
 * Solo la home es indexable; el resto se marca como noindex.
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BASE_URL = (import.meta.env.VITE_APP_URL || "https://silbatazo.com").replace(
  /\/+$/,
  ""
);

function ensureMeta(name: string) {
  let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", name);
    document.head.appendChild(meta);
  }
  return meta;
}

function ensureLink(rel: string) {
  let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }
  return link;
}

export function SeoController() {
  const location = useLocation();

  useEffect(() => {
    const isHome = location.pathname === "/" || location.pathname === "";
    const robots = isHome ? "index, follow" : "noindex, nofollow";
    const canonicalUrl = `${BASE_URL}/`;

    const robotsMeta = ensureMeta("robots");
    robotsMeta.setAttribute("content", robots);

    const googlebotMeta = ensureMeta("googlebot");
    googlebotMeta.setAttribute("content", robots);

    const canonicalLink = ensureLink("canonical");
    canonicalLink.setAttribute("href", canonicalUrl);

    const ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute("content", canonicalUrl);
    }
  }, [location.pathname]);

  return null;
}
