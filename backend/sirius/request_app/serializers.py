from rest_framework import serializers
from drf_spectacular.utils import extend_schema_serializer, OpenApiExample
from sirius.config import NAMES_LEN
from .config import RECORD_TYPES

class UUIDMixin(serializers.Serializer):
    id = serializers.UUIDField(read_only=True)

class RequestSerializer(UUIDMixin, serializers.Serializer):
    timestamp = serializers.DateTimeField(required=False)
    code = serializers.CharField(max_length=50, allow_blank=True)

class RecordSerializer(UUIDMixin, serializers.Serializer):
    timestamp = serializers.DateTimeField(required=False)
    action = serializers.CharField(required=False)
    modified_by = serializers.CharField(read_only=True)
    object_id = serializers.UUIDField(write_only=True)
    type = serializers.CharField()
    first_name = serializers.CharField(max_length=NAMES_LEN)
    surname_name = serializers.CharField(max_length=NAMES_LEN, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=NAMES_LEN)
    object = serializers.CharField(read_only=True)
    car_number = serializers.CharField(required=False)
    car_brand  = serializers.CharField(required=False)
    car_model = serializers.CharField(required=False)
    from_date = serializers.DateTimeField()
    to_date = serializers.DateTimeField(required=False)
    note = serializers.CharField(required=False, allow_blank=True)

    def validate_type(self, value):
        if value in RECORD_TYPES:
            return value
        raise serializers.ValidationError