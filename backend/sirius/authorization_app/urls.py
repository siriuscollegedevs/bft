from django.urls import path
from .views import LoginView, LogoutView, CookieTokenRefreshView, ClearCookie


urlpatterns = [
    path('login', LoginView.as_view(), name='login'),
    path('logout', LogoutView.as_view(), name='logout'),
    path('refresh', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('clear', ClearCookie.as_view(), name='clear_cookie')
]
