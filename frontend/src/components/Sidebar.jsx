import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <NavLink to="/">Spotilite</NavLink>
      </div>
      <nav className={styles.nav}>
        <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : '')}>Home</NavLink>
        <NavLink to="/songs" className={({ isActive }) => (isActive ? styles.active : '')}>Songs</NavLink>
        <NavLink to="/artists" className={({ isActive }) => (isActive ? styles.active : '')}>Artists</NavLink>
        <NavLink to="/albums" className={({ isActive }) => (isActive ? styles.active : '')}>Albums</NavLink>
        <NavLink to="/playlists" className={({ isActive }) => (isActive ? styles.active : '')}>Playlists</NavLink>
      </nav>
    </div>
  )
}
