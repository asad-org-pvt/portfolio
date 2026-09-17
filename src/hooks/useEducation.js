import { useState, useEffect } from "react";
import { fetchPublishedEducation } from "../services/portfolioService";
import { FALLBACK_EDUCATION } from "../services/fallbackData";

export function useEducation() {
  const [educations, setEducations] = useState(FALLBACK_EDUCATION);
  const [loading, setLoading] = useState(true);
  const [isFromSupabase, setIsFromSupabase] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const data = await fetchPublishedEducation();
      if (isMounted) {
        if (data && data.length > 0) {
          setEducations(data);
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

  return { educations, loading, isFromSupabase };
}

export default useEducation;
