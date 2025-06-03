from django.db import models

# Model for Artist
class Artist(models.Model):
    name = models.CharField(max_length=200)
    profile_pic = models.ImageField(upload_to="artist_pictures/")
    bio = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    

# Model for Album
class Album(models.Model):
    title = models.CharField(max_length=200)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name="albums")
    release_date = models.DateField()
    cover_thumbnail = models.ImageField(upload_to="album_thumbnails/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} by {self.artist.name}"
    
# Model for song 
class Song(models.Model):
    title = models.CharField(max_length=200)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name="songs")
    album = models.ForeignKey(Album, on_delete=models.SET_NULL, null=True, blank=True, related_name="songs")
    duration = models.TimeField()
    audio_file = models.FileField(upload_to="songs/")
    thumbnail = models.ImageField(upload_to="song_thumbnails/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


