import { useState, useEffect } from "react";
import { fetchPublishedSkills } from "../services/portfolioService";
import { FALLBACK_SKILLS } from "../services/fallbackData";

export function useSkills(category = null) {
  const [skills, setSkills] = useState(() => {
    return category
      ? FALLBACK_SKILLS.filter((s) => s.category === category)
      : FALLBACK_SKILLS;
  });
  const [loading, setLoading] = useState(true);
  const [isFromSupabase, setIsFromSupabase] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const data = await fetchPublishedSkills(category);
      if (isMounted) {
        if (data && data.length > 0) {
          setSkills(data);
          setIsFromSupabase(true);
        }
        setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [category]);

  return { skills, loading, isFromSupabase };
}

export default useSkills;
