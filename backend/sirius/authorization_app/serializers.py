from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework import serializers, exceptions


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(
        style={'input_type': 'password'},
        max_length=128,
        required=True,
    )


class CookieRefreshSerializer(TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs):
        attrs['refresh'] = self.context['request'].COOKIES.get('refresh')
        if attrs['refresh']:
            return super().validate(attrs)
        raise exceptions.ValidationError('No valid token found in cookie \'refresh\'.')
