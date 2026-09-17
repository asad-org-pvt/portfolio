import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

/**
 * Public Data Service: Fetches published portfolio content from Supabase.
 * Enforces `is_published = true` or `is_active = true` at the query level.
 */

export async function fetchPublishedProfile() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("is_published", true)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn("Could not fetch published profile from Supabase:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("fetchPublishedProfile exception:", err);
    return null;
  }
}

export async function fetchPublishedProjects() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Could not fetch published projects from Supabase:", error.message);
      return null;
    }
    return data && data.length > 0 ? data : null;
  } catch (err) {
    console.warn("fetchPublishedProjects exception:", err);
    return null;
  }
}

export async function fetchPublishedSkills(category = null) {
  if (!isSupabaseConfigured) return null;
  try {
    let query = supabase
      .from("skills")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (error) {
      console.warn("Could not fetch published skills from Supabase:", error.message);
      return null;
    }
    return data && data.length > 0 ? data : null;
  } catch (err) {
    console.warn("fetchPublishedSkills exception:", err);
    return null;
  }
}

export async function fetchPublishedServices() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.warn("Could not fetch published services from Supabase:", error.message);
      return null;
    }
    return data && data.length > 0 ? data : null;
  } catch (err) {
    console.warn("fetchPublishedServices exception:", err);
    return null;
  }
}

export async function fetchPublishedCertifications() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.warn("Could not fetch published certifications from Supabase:", error.message);
      return null;
    }
    return data && data.length > 0 ? data : null;
  } catch (err) {
    console.warn("fetchPublishedCertifications exception:", err);
    return null;
  }
}

export async function fetchActiveResume() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from("resume")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn("Could not fetch active resume from Supabase:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("fetchActiveResume exception:", err);
    return null;
  }
}

export async function fetchPublishedContactInfo() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from("contact_info")
      .select("*")
      .eq("is_published", true)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn("Could not fetch contact info from Supabase:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("fetchPublishedContactInfo exception:", err);
    return null;
  }
}

export async function fetchPublishedSocialLinks() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.warn("Could not fetch social links from Supabase:", error.message);
      return null;
    }
    return data && data.length > 0 ? data : null;
  } catch (err) {
    console.warn("fetchPublishedSocialLinks exception:", err);
    return null;
  }
}

export async function fetchPublishedExperience() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.warn("Could not fetch experience from Supabase:", error.message);
      return null;
    }
    return data && data.length > 0 ? data : null;
  } catch (err) {
    console.warn("fetchPublishedExperience exception:", err);
    return null;
  }
}

export async function fetchPublishedEducation() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.warn("Could not fetch education from Supabase:", error.message);
      return null;
    }
    return data && data.length > 0 ? data : null;
  } catch (err) {
    console.warn("fetchPublishedEducation exception:", err);
    return null;
  }
}

export async function fetchSeoSettings(route = "global") {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from("seo_settings")
      .select("*")
      .eq("page_route", route)
      .maybeSingle();

    if (error) {
      console.warn("Could not fetch SEO settings from Supabase:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("fetchSeoSettings exception:", err);
    return null;
  }
}
