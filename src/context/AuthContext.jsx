import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isInitializing = useRef(true);
  const profileCache = useRef(null);

  const fetchProfile = async (userId) => {
    console.log('[Auth] Fetching profile for:', userId);

    // Return cached profile if we have it for this user
    if (profileCache.current && profileCache.current.id === userId) {
      console.log('[Auth] Using cached profile');
      setUser(profileCache.current);
      return profileCache.current;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[Auth] Profile fetch error:', error);
        throw error;
      }

      if (data) {
        console.log('[Auth] Profile loaded:', data.email);
        profileCache.current = data;
        setUser(data);
        return data;
      }

      throw new Error('Profile not found');
    } catch (err) {
      console.error('[Auth] fetchProfile failed:', err);
      throw err;
    }
  };

  useEffect(() => {
    let mounted = true;
    console.log('[Auth] Initializing...');

    // Failsafe timeout
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('[Auth] Timeout reached - forcing ready state');
        setLoading(false);
        isInitializing.current = false;
      }
    }, 8000);

    const initialize = async () => {
      try {
        console.log('[Auth] Getting session...');
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('[Auth] getSession error:', error);
        } else if (session) {
          console.log('[Auth] Session found for:', session.user.email);
          try {
            await fetchProfile(session.user.id);
          } catch (profileErr) {
            console.error('[Auth] Could not load profile on init:', profileErr);
            // Clear the problematic session
            console.log('[Auth] Signing out due to profile error...');
            await supabase.auth.signOut();
            profileCache.current = null;
            setUser(null);
          }
        } else {
          console.log('[Auth] No session found');
        }
      } catch (err) {
        console.error('[Auth] Initialize error:', err);
      } finally {
        if (mounted) {
          console.log('[Auth] Initialization complete');
          isInitializing.current = false;
          setLoading(false);
          clearTimeout(timeout);
        }
      }
    };

    // Set up auth state listener BEFORE initializing
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Auth] Event:', event, '- Initializing:', isInitializing.current);

      // Skip events during initialization to avoid race conditions
      if (isInitializing.current) {
        console.log('[Auth] Skipping event during initialization');
        return;
      }

      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        console.log('[Auth] User signed out');
        profileCache.current = null;
        setUser(null);
        return;
      }

      if (event === 'TOKEN_REFRESHED') {
        console.log('[Auth] Token refreshed, keeping current user');
        return;
      }

      if (event === 'SIGNED_IN') {
        console.log('[Auth] User signed in');
        // Profile is loaded by login() function, no need to reload here
        return;
      }

      // For other events, if we have a session but no user, try to load profile
      if (session && !user) {
        console.log('[Auth] Unexpected state: session without user, loading profile...');
        try {
          await fetchProfile(session.user.id);
        } catch (err) {
          console.error('[Auth] Failed to recover user state:', err);
        }
      }
    });

    initialize();

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    console.log('[Auth] Login attempt:', email);

    // Clear any existing problematic state
    profileCache.current = null;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('[Auth] Login failed:', error);
      throw error;
    }

    console.log('[Auth] Login successful, loading profile...');

    // Load profile immediately after auth
    if (data.user) {
      try {
        await fetchProfile(data.user.id);
      } catch (profileErr) {
        console.error('[Auth] Profile load after login failed:', profileErr);
        await supabase.auth.signOut();
        throw new Error('No se pudo cargar el perfil. Contacte soporte.');
      }
    }

    return data;
  };

  const logout = async () => {
    console.log('[Auth] Logout');
    profileCache.current = null;
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (updates) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    if (data) {
      profileCache.current = data;
      setUser(data);
    }
    return data;
  };

  const loginAsDemo = async (identifier) => {
    const demoRoles = {
      admin: 'admin@asvian.com',
      controller: 'mantenimiento@asvian.com',
      local: 'zara@asvian.com'
    };

    const email = demoRoles[identifier] || identifier;
    const password = 'gestmaint2026';

    return await login(email, password);
  };

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/login',
    });
    if (error) throw error;
  };

  // Always render children, but pass loading state
  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      loginAsDemo,
      logout,
      updateProfile,
      resetPassword,
      isAuthenticated: !!user
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
