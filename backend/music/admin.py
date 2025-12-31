from django.contrib import admin

from .models import Artist, Album, Song

@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):
    list_display = ("name", "created_at")
    search_fields = ("name",)

@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display = ("title", "artist", "release_date")
    list_filter = ("release_date",)
    search_fields = ("title", "artist__name")

@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', "album", "duration")
    list_filter = ("artist", "album")
    search_fields = ("title", "artist__name")
