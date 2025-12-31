import { useSongs } from '../hooks/useData'
import Card from '../components/Card'
import styles from './ListPage.module.css'

export default function Songs() {
  const { songs, loading, error } = useSongs()

  if (loading) return <div>Loading songs...</div>
  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.listPage}>
      <h1>Songs</h1>
      <div className={styles.grid}>
        {songs.map((song) => (
          <Card key={song.id} item={song} />
        ))}
      </div>
    </div>
  )
}
