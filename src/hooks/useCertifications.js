import { useState, useEffect } from "react";
import { fetchPublishedCertifications } from "../services/portfolioService";
import { FALLBACK_CERTIFICATIONS } from "../services/fallbackData";

export function useCertifications() {
  const [certifications, setCertifications] = useState(FALLBACK_CERTIFICATIONS);
  const [loading, setLoading] = useState(true);
  const [isFromSupabase, setIsFromSupabase] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const data = await fetchPublishedCertifications();
      if (isMounted) {
        if (data && data.length > 0) {
          const mapped = data.map((cert, idx) => {
            const fallbackMatch = FALLBACK_CERTIFICATIONS.find(
              (f) => f.title.toLowerCase() === cert.title.toLowerCase()
            ) || FALLBACK_CERTIFICATIONS[idx % FALLBACK_CERTIFICATIONS.length];

            return {
              ...cert,
              file_url: cert.file_url || fallbackMatch?.file_url,
              thumbnail_url: cert.thumbnail_url || fallbackMatch?.thumbnail_url,
            };
          });

          setCertifications(mapped);
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

  return { certifications, loading, isFromSupabase };
}

export default useCertifications;
