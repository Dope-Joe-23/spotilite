import { useState, useEffect } from 'react'
import { songsAPI, artistsAPI, albumsAPI, playlistsAPI } from '../api/client'

export const useSongs = () => {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await songsAPI.list()
        setSongs(response.data)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchSongs()
  }, [])

  return { songs, loading, error }
}

export const useArtists = () => {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await artistsAPI.list()
        setArtists(response.data)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchArtists()
  }, [])

  return { artists, loading, error }
}

export const useAlbums = () => {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await albumsAPI.list()
        setAlbums(response.data)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAlbums()
  }, [])

  return { albums, loading, error }
}

export const usePlaylists = () => {
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await playlistsAPI.list()
        setPlaylists(response.data)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPlaylists()
  }, [])

  return { playlists, loading, error, setPlaylists }
}
