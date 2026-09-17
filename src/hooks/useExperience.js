import { useState, useEffect } from "react";
import { fetchPublishedExperience } from "../services/portfolioService";
import { FALLBACK_EXPERIENCE } from "../services/fallbackData";

export function useExperience() {
  const [experiences, setExperiences] = useState(FALLBACK_EXPERIENCE);
  const [loading, setLoading] = useState(true);
  const [isFromSupabase, setIsFromSupabase] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const data = await fetchPublishedExperience();
      if (isMounted) {
        if (data && data.length > 0) {
          setExperiences(data);
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

  return { experiences, loading, isFromSupabase };
}

export default useExperience;
