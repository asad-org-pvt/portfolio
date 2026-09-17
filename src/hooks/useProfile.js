import { useState, useEffect } from "react";
import { fetchPublishedProfile } from "../services/portfolioService";
import { FALLBACK_PROFILE } from "../services/fallbackData";

export function useProfile() {
  const [profile, setProfile] = useState(FALLBACK_PROFILE);
  const [loading, setLoading] = useState(true);
  const [isFromSupabase, setIsFromSupabase] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const data = await fetchPublishedProfile();
      if (isMounted) {
        if (data) {
          setProfile({
            ...FALLBACK_PROFILE,
            ...data,
            // Ensure array formatting for rotating titles and hobbies
            rotating_titles:
              Array.isArray(data.rotating_titles) && data.rotating_titles.length > 0
                ? data.rotating_titles
                : FALLBACK_PROFILE.rotating_titles,
            hobbies:
              Array.isArray(data.hobbies) && data.hobbies.length > 0
                ? data.hobbies
                : FALLBACK_PROFILE.hobbies,
            // Fall back to local bundled graphics if remote URLs are empty
            avatar_url: data.avatar_url || FALLBACK_PROFILE.avatar_url,
            hero_image_url: data.hero_image_url || FALLBACK_PROFILE.hero_image_url,
            about_image_url: data.about_image_url || FALLBACK_PROFILE.about_image_url,
            contact_image_url: data.contact_image_url || FALLBACK_PROFILE.contact_image_url,
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

  return { profile, loading, isFromSupabase };
}

export default useProfile;
