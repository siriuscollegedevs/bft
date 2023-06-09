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
                # account_history = AccountHistory.objects.get(user=user)
                res.data = {
                    "access": tokens['access_token'],
                    "refresh_exp": float(getenv('ACCESS_TOKEN_LIFETIME')),
                    "access_exp": float(getenv('REFRESH_TOKEN_LIFETIME')),
                    # "account_id": str(account_history.account.id)
                }
                res['X-CSRFToken'] = csrf.get_token(request)
                return res
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
            token = tokens.RefreshToken(refresh_token)
            token.blacklist()
            res = Response()
            res.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
            res.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_ACCESS'])
            res.delete_cookie('X-CSRFToken')
            res.delete_cookie('csrftoken')
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
            del response.data['refresh']
        response['X-CSRFToken'] = request.COOKIES.get('csrftoken')
        return super().finalize_response(request, response, *args, **kwargs)
