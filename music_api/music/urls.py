from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import songViewSet, artistViewSet, albumViewSet, SignInView, SignUpView, UserInfoView, api_root
router = DefaultRouter()
router.register(r'songs', songViewSet, basename='song')
router.register(r'artists', artistViewSet, basename='artist')
router.register(r'albums', albumViewSet, basename='album')


urlpatterns = [
    path('signup/', SignUpView.as_view(), name="api-signup"),
    path("signin/", SignInView.as_view(), name="api-signin"),
    path("user-info/", UserInfoView.as_view(), name="user-info"),
    path("", api_root, name='api-root'),
    path('', include(router.urls)),
]