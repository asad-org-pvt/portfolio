import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabaseClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  /**
   * Checks whether a given authenticated user ID exists in the public.admin_users table.
   */
  const checkAdminStatus = useCallback(async (userId) => {
    if (!userId || !isSupabaseConfigured) {
      setIsAdmin(false);
      return false;
    }
    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.warn("Error querying admin_users table:", error.message);
        setIsAdmin(false);
        return false;
      }

      const hasAdminRole = Boolean(data && data.role === "admin");
      setIsAdmin(hasAdminRole);
      return hasAdminRole;
    } catch (err) {
      console.error("Unexpected error verifying admin status:", err);
      setIsAdmin(false);
      return false;
    }
  }, []);

  // Initialize and listen to Supabase auth state changes
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    // 1. Check existing active session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!isMounted) return;
      if (error) {
        setAuthError(error.message);
        setLoading(false);
        return;
      }
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id).finally(() => {
          if (isMounted) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    // 2. Subscribe to auth state changes (LOGIN, LOGOUT, TOKEN_REFRESHED, PASSWORD_RECOVERY)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await checkAdminStatus(session.user.id);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [checkAdminStatus]);

  /**
   * Log in with Email and Password
   */
  const login = async (email, password) => {
    setAuthError(null);
    if (!isSupabaseConfigured) {
      throw new Error(
        "Supabase is not configured yet. Please configure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env file."
      );
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setAuthError(error.message);
      throw error;
    }

    // Verify admin role
    const hasAdmin = await checkAdminStatus(data.user.id);
    if (!hasAdmin) {
      await supabase.auth.signOut();
      const nonAdminErr = new Error(
        "Access Denied: Your account is not authorized as a portfolio administrator."
      );
      setAuthError(nonAdminErr.message);
      throw nonAdminErr;
    }

    return data;
  };

  /**
   * Log out and terminate the Supabase session
   */
  const logout = async () => {
    setAuthError(null);
    if (!isSupabaseConfigured) return;
    try {
      await supabase.auth.signOut();
    } finally {
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    }
  };

  /**
   * Trigger native Supabase password reset email
   */
  const requestPasswordReset = async (email) => {
    setAuthError(null);
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured. Please check your .env file.");
    }
    const redirectUrl = `${window.location.origin}/admin/reset-password`;
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    if (error) {
      setAuthError(error.message);
      throw error;
    }
    return data;
  };

  /**
   * Update password in recovery session
   */
  const updatePassword = async (newPassword) => {
    setAuthError(null);
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured.");
    }
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      setAuthError(error.message);
      throw error;
    }
    return data;
  };

  const value = {
    user,
    session,
    isAdmin,
    loading,
    authError,
    setAuthError,
    isConfigured: isSupabaseConfigured,
    login,
    logout,
    requestPasswordReset,
    updatePassword,
    checkAdminStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
