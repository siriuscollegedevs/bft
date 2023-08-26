from rest_framework import permissions
from sirius.general_functions import get_user

class IsAdministrator(permissions.BasePermission):
    def has_permission(self, request, _):
        return get_user(request).role == 'administrator'

class ManegerWithObjects(permissions.BasePermission):
    def has_permission(self, request, _):
        if get_user(request).role == 'manager':
            return request.method == 'GET'
        return False

class IsManeger(permissions.BasePermission):
    def has_permission(self, request, _):
        return get_user(request).role == 'maneger'

class IsSpecialist(permissions.BasePermission):
    def has_permission(self, request, _):
        return get_user(request).role == 'specialist'