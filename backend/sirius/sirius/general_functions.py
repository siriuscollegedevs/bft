from rest_framework_simplejwt.tokens import AccessToken
from sirius_access.models import Account
from django.contrib.auth.models import User



def get_user(request):
        access_token = request.META.get('HTTP_AUTHORIZATION', " ").split(' ')[1]
        token = AccessToken(access_token)
        user = User.objects.get(id=token.payload['user_id'])
        return Account.objects.get(user=user)

def check_administrator(account):
    return account.get_last_version().role == 'Administrator'