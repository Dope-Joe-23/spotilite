import React, { createContext, useState, useEffect } from 'react'
import { authAPI } from '../api/client'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('access_token'))

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await authAPI.getUserInfo()
          setUser(response.data)
        } catch (error) {
          localStorage.removeItem('access_token')
          setToken(null)
        }
      }
      setLoading(false)
    }
    checkAuth()
  }, [token])

  const login = async (username, password) => {
    const response = await authAPI.signin(username, password)
    localStorage.setItem('access_token', response.data.access)
    setToken(response.data.access)
    setUser(response.data.user)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    setToken(null)
    setUser(null)
  }

  const signup = async (username, email, password, confirmPassword) => {
    await authAPI.signup(username, email, password, confirmPassword)
  }

  return (
    <AuthContext.Provider value={{ user, loading, token, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => React.useContext(AuthContext)
