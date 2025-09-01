import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'

// Create Auth Context
const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        console.log('🔍 Checking initial session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Error getting session:', error)
          setUser(null)
          setProfile(null)
          setLoading(false)
          return
        }

        console.log('✅ Initial session check completed:', session?.user?.email || 'No user')
        setUser(session?.user ?? null)
        setLoading(false) // Set loading false immediately after setting user
        
        // Fetch profile asynchronously without blocking the auth flow
        if (session?.user) {
          fetchProfile(session.user.id).catch(error => {
            console.error('Profile fetch failed but continuing:', error)
          })
        }
      } catch (error) {
        console.error('❌ Error in getSession:', error)
        setUser(null)
        setProfile(null)
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email || 'No user')
        
        try {
          setUser(session?.user ?? null)
          setLoading(false) // Set loading false immediately
          
          // Handle profile fetching asynchronously
          if (session?.user) {
            fetchProfile(session.user.id).catch(error => {
              console.error('Profile fetch failed but continuing:', error)
            })
          } else {
            setProfile(null)
          }
        } catch (error) {
          console.error('❌ Error in auth state change:', error)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Fetch user profile with timeout
  const fetchProfile = async (userId) => {
    try {
      console.log('🔍 Fetching profile for user:', userId)
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000) // 5 second timeout
      })
      
      // Race between the actual fetch and timeout
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      const { data, error } = await Promise.race([profilePromise, timeoutPromise])

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error fetching profile:', error)
        return
      }

      console.log('✅ Profile fetched successfully:', data?.display_name || 'No name')
      setProfile(data)
    } catch (error) {
      console.error('❌ Error in fetchProfile:', error)
      // Don't block the app if profile fetch fails
    }
  }

  // Sign up
  const signUp = async (email, password, { firstName, lastName, favoritePlayer }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
            favorite_player: favoritePlayer,
            preferred_position: 'Spurs Fan'
          }
        }
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Sign in
  const signIn = async (email, password, options = {}) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          // Set session persistence based on rememberMe
          ...(options.rememberMe && { 
            data: { remember: true } 
          })
        }
      })

      if (error) throw error
      
      // Store remember preference in localStorage for persistence
      if (options.rememberMe) {
        localStorage.setItem('spurs_remember_me', 'true')
      } else {
        localStorage.removeItem('spurs_remember_me')
      }
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Sign in with provider (Google, Facebook, etc.)
  const signInWithProvider = async (provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setProfile(null)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Reset password
  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Update password
  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Update email
  const updateEmail = async (newEmail) => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      })

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Update profile
  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      setProfile(data)
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Force refresh session (useful for debugging)
  const refreshSession = async () => {
    try {
      setLoading(true)
      const { data: { session }, error } = await supabase.auth.refreshSession()
      
      if (error) {
        console.error('Error refreshing session:', error)
        setUser(null)
        setProfile(null)
        return { error }
      }

      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
      }
      
      return { error: null }
    } catch (error) {
      console.error('Error in refreshSession:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  // Clear all auth data (useful for debugging)
  const clearAuthData = () => {
    setUser(null)
    setProfile(null)
    setLoading(false)
    localStorage.removeItem('spurs_remember_me')
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    resetPassword,
    updatePassword,
    updateEmail,
    updateProfile,
    fetchProfile,
    refreshSession,
    clearAuthData
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
