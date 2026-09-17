import { useState, useEffect } from "react";
import { fetchPublishedServices } from "../services/portfolioService";
import { FALLBACK_SERVICES } from "../services/fallbackData";

export function useServices() {
  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [loading, setLoading] = useState(true);
  const [isFromSupabase, setIsFromSupabase] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const data = await fetchPublishedServices();
      if (isMounted) {
        if (data && data.length > 0) {
          const mapped = data.map((srv, idx) => {
            const fallbackMatch = FALLBACK_SERVICES.find(
              (f) => f.title.toLowerCase() === srv.title.toLowerCase()
            ) || FALLBACK_SERVICES[idx % FALLBACK_SERVICES.length];

            return {
              ...srv,
              icon_url: srv.icon_url || fallbackMatch?.icon_url,
            };
          });

          setServices(mapped);
          setIsFromSupabase(true);
        }
        setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return { services, loading, isFromSupabase };
}

export default useServices;
