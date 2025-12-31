from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    songViewSet, artistViewSet, albumViewSet, playlistViewSet, 
    SignInView, SignUpView, UserInfoView, 
    api_root
)

# API Router
router = DefaultRouter()
router.register(r'playlists', playlistViewSet, basename='playlist')
router.register(r'songs', songViewSet, basename='song')
router.register(r'artists', artistViewSet, basename='artist')
router.register(r'albums', albumViewSet, basename='album')

# App Routes
urlpatterns = [
    # API Endpoints
    path('api/signup/', SignUpView.as_view(), name="api-signup"),
    path('api/signin/', SignInView.as_view(), name="api-signin"),
    path('api/user-info/', UserInfoView.as_view(), name="user-info"),
    path('api/', api_root, name='api-root'),
    path('api/', include(router.urls)),
]
