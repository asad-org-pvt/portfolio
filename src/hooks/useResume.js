import { useState, useEffect } from "react";
import { fetchActiveResume } from "../services/portfolioService";
import { FALLBACK_RESUME } from "../services/fallbackData";

export function useResume() {
  const [resume, setResume] = useState(FALLBACK_RESUME);
  const [loading, setLoading] = useState(true);
  const [isFromSupabase, setIsFromSupabase] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const data = await fetchActiveResume();
      if (isMounted) {
        if (data && data.file_url) {
          setResume({
            ...FALLBACK_RESUME,
            ...data,
          });
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

  return { resume, loading, isFromSupabase };
}

export default useResume;
