import { useState, useEffect } from "react";
import {
  fetchPublishedContactInfo,
  fetchPublishedSocialLinks,
} from "../services/portfolioService";
import {
  FALLBACK_CONTACT,
  FALLBACK_SOCIAL_LINKS,
} from "../services/fallbackData";

export function useContact() {
  const [contact, setContact] = useState(FALLBACK_CONTACT);
  const [socialLinks, setSocialLinks] = useState(FALLBACK_SOCIAL_LINKS);
  const [loading, setLoading] = useState(true);
  const [isFromSupabase, setIsFromSupabase] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const [contactData, socialsData] = await Promise.all([
        fetchPublishedContactInfo(),
        fetchPublishedSocialLinks(),
      ]);

      if (isMounted) {
        if (contactData) {
          setContact({
            ...FALLBACK_CONTACT,
            ...contactData,
          });
          setIsFromSupabase(true);
        }
        if (socialsData && socialsData.length > 0) {
          setSocialLinks(socialsData);
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

  return { contact, socialLinks, loading, isFromSupabase };
}

export default useContact;
