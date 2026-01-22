import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Failsafe: ensure loading is set to false even if Supabase/Network is slow
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Check active sessions and sets the user
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        console.error('Error getting session:', err);
      } finally {
        setLoading(false);
        clearTimeout(timeout);
      }
    };

    getSession();

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setUser(data);
    } else if (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // For the demo, we keep these helper roles if needed, but the real logic is in login()
  const loginAsDemo = async (identifier) => {
    const demoRoles = {
      admin: 'admin@asvian.com',
      controller: 'mantenimiento@asvian.com',
      local: 'zara@asvian.com'
    };

    const email = demoRoles[identifier] || identifier;
    const password = 'gestmaint2026'; // All demo accounts use the same password

    return await login(email, password);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      loginAsDemo,
      logout,
      isAuthenticated: !!user
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
