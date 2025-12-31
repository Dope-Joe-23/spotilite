import { usePlaylists } from '../hooks/useData'

export default function Playlists() {
  const { playlists, loading, error } = usePlaylists()

  if (loading) return <div>Loading playlists...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="playlists-page">
      <h1>My Playlists</h1>
      <div className="playlists-grid">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="playlist-card">
            <h3>{playlist.title}</h3>
            <p>{playlist.description}</p>
            <p>{playlist.songs?.length} songs</p>
          </div>
        ))}
      </div>
    </div>
  )
}
