import { useAlbums } from '../hooks/useData'
import styles from './Albums.module.css'

export default function Albums() {
  const { albums, loading, error } = useAlbums()

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
      </div>
    )
  }
  
  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.albumsPage}>
      <h1>Albums</h1>
      <div className={styles.albumsGrid}>
        {albums.map((album) => (
          <div key={album.id} className={styles.albumCard}>
            <img src={album.cover_thumbnail} alt={album.title} />
            <h3>{album.title}</h3>
            <p>{album.artist?.name || 'Various Artists'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
