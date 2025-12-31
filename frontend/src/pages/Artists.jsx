import { useArtists } from '../hooks/useData'
import styles from './Artists.module.css'

export default function Artists() {
  const { artists, loading, error } = useArtists()

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
      </div>
    )
  }

  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.artistsPage}>
      <h1>Artists</h1>
      <div className={styles.artistsGrid}>
        {artists.map((artist) => (
          <div key={artist.id} className={styles.artistCard}>
            <img src={artist.picture} alt={artist.name} />
            <h3>{artist.name}</h3>
            <p>Artist</p>
          </div>
        ))}
      </div>
    </div>
  )
}
