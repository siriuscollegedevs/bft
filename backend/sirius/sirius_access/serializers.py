from rest_framework import serializers
from drf_spectacular.utils import extend_schema_serializer, OpenApiExample
from .config import ACCOUNT_TYPES, ACTION_ACCOUNT_LEN, ACCOUNT_TYPE_LEN
from sirius.config import DEFAULT_ACTION_LEN, DEFAULT_LEN, NAMES_LEN

class UUIDMixin(serializers.Serializer):
    id = serializers.UUIDField(read_only=True)

class ObjectSerializer(UUIDMixin, serializers.Serializer):
    name = serializers.CharField(max_length=DEFAULT_LEN)

@extend_schema_serializer(
    examples = [
         OpenApiExample(
            'Valid example 1',
            value={
                'version': 1,
                'name': 'ГМЦ',
                'timestamp' : "2019-09-08 09:12:12.473393",
                'modified_by' : 'katya',
                'action' : 'created'
            })])
class ObjectHistorySerializer(serializers.Serializer):
    version = serializers.IntegerField()
    name = serializers.CharField(max_length=DEFAULT_LEN)
    timestamp = serializers.DateTimeField()
    modified_by = serializers.CharField(max_length=DEFAULT_LEN)
    action = serializers.CharField(max_length=DEFAULT_ACTION_LEN)

class AccountSerializer(UUIDMixin, serializers.Serializer):
    role = serializers.CharField(required=False)
    first_name = serializers.CharField(max_length=NAMES_LEN, allow_null=True)
    surname = serializers.CharField(max_length=NAMES_LEN, required=False, allow_blank=True, allow_null=True)
    last_name = serializers.CharField(max_length=NAMES_LEN, allow_null=True)
    username = serializers.CharField(required=False)
    modified_by = serializers.CharField(max_length=DEFAULT_LEN, read_only=True)
    action = serializers.CharField(max_length=ACTION_ACCOUNT_LEN, read_only=True)
    password = serializers.CharField(trim_whitespace=False, max_length=128, write_only=True, allow_null=True)
    timestamp = serializers.DateTimeField(read_only=True)

    def __init__(self, *args, **kwargs):
        fields = kwargs.pop('fields', None)
        self.request_type = kwargs.pop('request_type', None)

        super().__init__(*args, **kwargs)

        if fields is not None:
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)
    
    def validate_password(self, value):
        if self.request_type == 'post':
            if value:
                return value 
            raise serializers.ValidationError
        return value

    def validate_role(self, value):
        if value not in ACCOUNT_TYPES:
            return serializers.ValidationError
        elif self.request_type == 'post':
            if value:
                return value
            else:
                return serializers.ValidationError
        return value
    
    def validate_username(self, value):
        if self.request_type == 'post':
            if value:
                return value 
            raise serializers.ValidationError
        return value

class ChangePasswordSerializer(serializers.Serializer):
    status = serializers.CharField(max_length=ACCOUNT_TYPE_LEN)
    current_password = serializers.CharField(max_length=DEFAULT_LEN, required=False, allow_blank=True)
    new_password = serializers.CharField(max_length=DEFAULT_LEN, trim_whitespace=False)

    def validate_status(self, value):
        if value in ACCOUNT_TYPES:
            return value
        return serializers.ValidationError
