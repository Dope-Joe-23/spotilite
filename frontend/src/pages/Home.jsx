import { useAuth } from '../contexts/AuthContext'
import { useAlbums } from '../hooks/useData'
import { Link } from 'react-router-dom'
import styles from './Home.module.css'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Home() {
  const { user } = useAuth()
  const { albums, loading, error } = useAlbums()

  const featuredAlbums = albums.slice(0, 6)

  return (
    <div className={styles.homePage}>
      <div className={styles.header}>
        <h1>{getGreeting()}</h1>
        {user && <h2>Welcome back, {user.username}</h2>}
      </div>

      <div className={styles.content}>
        <h2>Featured Albums</h2>
        {loading && <p>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.grid}>
          {featuredAlbums.map((album) => (
            <Link to={`/albums/${album.id}`} key={album.id} className={styles.card}>
              <img src={album.cover_thumbnail} alt={album.title} />
              <h3>{album.title}</h3>
              <p>{album.artist?.name || 'Various Artists'}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
