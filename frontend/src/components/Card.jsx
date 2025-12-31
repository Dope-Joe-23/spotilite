import React from 'react'
import styles from './Card.module.css'

export default function Card({ item }) {
  // Use a placeholder image if no image is available
  const imageUrl = item.thumbnail || item.picture || item.banner_image || 'https://via.placeholder.com/150'

  return (
    <div className={styles.card}>
      <img src={imageUrl} alt={item.name || item.title} className={styles.cardImage} />
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{item.name || item.title}</h3>
        {item.artist && <p className={styles.cardText}>{item.artist.name}</p>}
      </div>
    </div>
  )
}
