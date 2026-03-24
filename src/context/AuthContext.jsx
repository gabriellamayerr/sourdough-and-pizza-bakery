/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import i18n from '../i18n'

const AuthContext = createContext(null)

const STORAGE_KEY = 'bakery-user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) {
      return null
    }

    try {
      return JSON.parse(saved)
    } catch {
      return null
    }
  })

  const login = ({ email, password }) => {
    if (!email || !password) {
      return { success: false, message: i18n.t('login.errors.required') }
    }

    const userName = email.split('@')[0]
    const sessionUser = {
      name: userName.charAt(0).toUpperCase() + userName.slice(1),
      email,
      lastLoginAt: new Date().toISOString(),
    }

    setUser(sessionUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser))
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
