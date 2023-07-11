from rest_framework import serializers
from drf_spectacular.utils import extend_schema_serializer, OpenApiExample


class UUIDMixin(serializers.Serializer):
    id = serializers.UUIDField(required=False)

class ObjectSerializer(UUIDMixin, serializers.Serializer):
    name = serializers.CharField(max_length=60)

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
    name = serializers.CharField(max_length=40)
    timestamp = serializers.DateTimeField()
    modified_by = serializers.CharField(max_length=40)
    action = serializers.CharField(max_length=10)

class AccountSerializer(UUIDMixin, serializers.Serializer):
    role = serializers.CharField(max_length=20)
    first_name = serializers.CharField(max_length=30, required=False)
    surname = serializers.CharField(max_length=30, required=False)
    last_name = serializers.CharField(max_length=30)
    username = serializers.CharField(max_length=30)
    modified_by = serializers.CharField(max_length=40, required=False)
    action = serializers.CharField(max_length=20, required=False)
    password = serializers.CharField(trim_whitespace=False, max_length=128, required=False)
    timestamp = serializers.DateTimeField(required=False)

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
            else:
                raise serializers.ValidationError
        return value

    def validate_id(self, value):
        if self.request_type == 'post':
            if value:
                raise serializers.ValidationError
            else:
                return value
        return value
    
class ChangePasswordSerializer(serializers.Serializer):
    status = serializers.CharField(max_length=50)
    current_password = serializers.CharField(max_length=70, required=False)
    new_password = serializers.CharField(max_length=70, trim_whitespace=False)
