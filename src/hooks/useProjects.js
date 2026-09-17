import { useState, useEffect } from "react";
import { fetchPublishedProjects } from "../services/portfolioService";
import { FALLBACK_PROJECTS } from "../services/fallbackData";

export function useProjects() {
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [isFromSupabase, setIsFromSupabase] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const data = await fetchPublishedProjects();
      if (isMounted) {
        if (data && data.length > 0) {
          // If remote cover_image_url is missing or matches fallback slug, preserve bundled image
          const mapped = data.map((proj, idx) => {
            const fallbackMatch = FALLBACK_PROJECTS.find(
              (f) => f.title.toLowerCase() === proj.title.toLowerCase()
            ) || FALLBACK_PROJECTS[idx % FALLBACK_PROJECTS.length];

            return {
              ...proj,
              cover_image_url: proj.cover_image_url || fallbackMatch?.cover_image_url,
            };
          });

          setProjects(mapped);
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

  return { projects, loading, isFromSupabase };
}

export default useProjects;
