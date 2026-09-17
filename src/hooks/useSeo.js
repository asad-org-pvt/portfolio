import { useEffect } from "react";
import { fetchSeoSettings } from "../services/portfolioService";
import { FALLBACK_SEO } from "../services/fallbackData";

/**
 * Updates document.title and meta description dynamically based on Supabase SEO settings.
 */
export function useSeo(pageRoute = "global") {
  useEffect(() => {
    let isMounted = true;

    async function applySeo() {
      let data = await fetchSeoSettings(pageRoute);
      if (!data && pageRoute !== "global") {
        data = await fetchSeoSettings("global");
      }

      if (!isMounted) return;

      const title = data?.title || FALLBACK_SEO.title;
      const description = data?.meta_description || FALLBACK_SEO.meta_description;

      if (title) {
        document.title = title;
      }

      if (description) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute("content", description);
        }
      }
    }

    applySeo();

    return () => {
      isMounted = false;
    };
  }, [pageRoute]);
}

export default useSeo;
