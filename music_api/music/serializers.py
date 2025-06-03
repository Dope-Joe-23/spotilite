from rest_framework import serializers
from .models import Song, Artist, Album

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