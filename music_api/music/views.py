from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from django.core.exceptions import ValidationError
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny, IsAuthenticated

from .models import Song, Artist, Album
from .serializers import SongSerializer, ArtistSerializer, AlbumSerializer
from django.http import HttpResponse



class songViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class artistViewSet(viewsets.ModelViewSet):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class albumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        confirm_password = request.data.get("confirm_password")

        if not email or "@" not in email:
            return Response({"error": "Enter a valid email address"}, status=status.HTTP_400_BAD_REQUEST)
        email = email.lower()

        if password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)


        # Validate password strength
        try: 
            validate_password(password)
        except ValidationError as e:
            return Response({"error": e.messages}, status=status.HTTP_400_BAD_REQUEST)    

        # Check for duplicate username or email
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)
        

        # Create user atomically
        try:
            with transaction.atomic():
                user = User.objects.create_user(username=username, email=email, password=password)
                user.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": "An erro occurred during resistration."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


class SignInView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username_or_email = request.data.get("username")
        password = request.data.get("password")

        if "@" in username_or_email:
            try:
                user_obj = User.objects.get(email=username_or_email.lower())
                username = user_obj.username
            except User.DoesNotExist:
                return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

        else: 
            username = username_or_email

        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response( {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class UserInfoView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user = request.user
        data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
        }
        return Response(data, status=status.HTTP_200_OK)



def home(request):
   return render(request, 'index.html')

def signup_view(request):
    return render(request, "signup.html")

def signin_view(request):
    return render(request, "signin.html")

def songs_page(request, id):
    song = get_object_or_404(Song, id=id)
    return render(request, "songs_page.html", {"song": song})

def artists_page(request, id):
    artist = get_object_or_404(Artist, id=id)
    return render(request, "artists_page.html", {"artist": artist})

def albums_page(request, id):
    album = get_object_or_404(Album, id=id)
    songs = album.songs.all()
    return render(request, "albums_page.html", {"album": album, "songs": songs})

@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        "songs": reverse('song-list', request=request, format=format),
        "artists": reverse('artist-list', request=request, format=format),
        "albums": reverse('album-list', request=request, format=format)
    })

