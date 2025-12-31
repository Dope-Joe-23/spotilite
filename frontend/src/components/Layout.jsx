import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from './Sidebar'
import styles from './Layout.module.css'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.mainContent}>
        <div className={styles.topbar}>
          {user ? (
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          ) : (
            <button onClick={() => navigate('/signin')} className={styles.loginButton}>
              Sign In
            </button>
          )}
        </div>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  )
}
