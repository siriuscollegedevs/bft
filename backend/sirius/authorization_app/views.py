from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt import tokens, views as jwt_views
from .serializers import LoginSerializer, CookieRefreshSerializer
from django.contrib.auth import authenticate
from django.conf import settings
from django.middleware import csrf
from os import getenv
from dotenv import load_dotenv
from sirius_access.models import Account


load_dotenv()


def get_user_tokens(user):
    refresh = tokens.RefreshToken.for_user(user)
    return {
        "refresh_token": str(refresh),
        "access_token": str(refresh.access_token),
    }


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.data.get('username')
            password = serializer.data.get('password')
            user = authenticate(request=request, username=username, password=password)
            if user:
                tokens = get_user_tokens(user)
                res = Response()
                res.set_cookie(
                    key=settings.SIMPLE_JWT['AUTH_COOKIE_ACCESS'],
                    value=tokens['access_token'],
                    expires = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                    secure = settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly = settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite = settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                )
                res.set_cookie(
                    key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                    value=tokens['refresh_token'],
                    expires = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                    secure = settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly = settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite = settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                )
                res.data = {
                    "access": tokens['access_token'],
                    "access_exp": float(getenv('REFRESH_TOKEN_LIFETIME')),
                    "account_id": str(Account.objects.get(user=user).id)
                }
                res['X-CSRFToken'] = csrf.get_token(request)
                return res
            return Response(status=status.HTTP_401_UNAUTHORIZED, data={'error': 'Неверный логин или пароль.'})
        return Response(status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
            token = tokens.RefreshToken(refresh_token)
            token.blacklist()
            res = Response()
            res.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'], samesite='None')
            res.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_ACCESS'], samesite='None')
            res.delete_cookie('X-CSRFToken', samesite='None')
            res.delete_cookie('csrftoken', samesite='None')
            return res
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class CookieTokenRefreshView(jwt_views.TokenRefreshView):
    serializer_class = CookieRefreshSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get('refresh'):
            response.set_cookie(
                    key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                    value=response.data['refresh'],
                    expires = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                    secure = settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly = settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite = settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                )
            response.set_cookie(
                    key=settings.SIMPLE_JWT['AUTH_COOKIE_ACCESS'],
                    value=response.data['access'],
                    expires = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                    secure = settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly = settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite = settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                )
            del response.data['refresh']
        response['X-CSRFToken'] = request.COOKIES.get('csrftoken')
        return super().finalize_response(request, response, *args, **kwargs)


class ClearCookie(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        try:
            refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
            token = tokens.RefreshToken(refresh_token)
            token.blacklist()
            res = Response()
            res.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'], samesite='None')
            res.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_ACCESS'], samesite='None')
            res.delete_cookie('X-CSRFToken', samesite='None')
            res.delete_cookie('csrftoken', samesite='None')
            return res
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)
