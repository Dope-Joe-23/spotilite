from rest_framework import serializers
from .models import Song, Artist, Album, Playlist

class SongSerializer(serializers.ModelSerializer):
    artist = serializers.StringRelatedField()
    album = serializers.StringRelatedField()

    class Meta:
        model = Song
        fields = '__all__'

class ArtistSerializer(serializers.ModelSerializer):
    ...

    class Meta:
        model = Artist
        fields = "__all__"
        
class AlbumSerializer(serializers.ModelSerializer):
    artist = serializers.StringRelatedField()

    class Meta:
        model = Album
        fields = "__all__"

class PlaylistSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True, read_only=True)
    class Meta:
        model = Playlist
        fields = "__all__"
        