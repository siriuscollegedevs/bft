from rest_framework import serializers
from drf_spectacular.utils import extend_schema_serializer, OpenApiExample
from sirius.config import NAMES_LEN, STATUS_LEN
from .config import RECORD_TYPES, RECORD_API_STATUSES


class UUIDMixin(serializers.Serializer):
    id = serializers.UUIDField(read_only=True)


class RequestSerializer(UUIDMixin, serializers.Serializer):
    timestamp = serializers.DateTimeField(required=False)
    code = serializers.CharField(max_length=50, allow_blank=True, allow_null=True, required=False)
    object_ids = serializers.ListField(child=serializers.UUIDField(), allow_empty=False)


class RecordSerializer(UUIDMixin, serializers.Serializer):
    timestamp = serializers.DateTimeField(read_only=True)
    action = serializers.CharField(read_only=True)
    modified_by = serializers.CharField(read_only=True)
    type = serializers.CharField()
    first_name = serializers.CharField(max_length=NAMES_LEN, required=False, allow_blank=True)
    surname_name = serializers.CharField(max_length=NAMES_LEN, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=NAMES_LEN)
    car_number = serializers.CharField(required=False, allow_blank=True)
    car_brand = serializers.CharField(required=False, allow_blank=True)
    car_model = serializers.CharField(required=False, allow_blank=True)
    from_date = serializers.DateField()
    to_date = serializers.DateField()
    note = serializers.CharField(required=False, allow_blank=True)

    def __init__(self, *args, **kwargs):
        fields = kwargs.pop('fields', None)
        self.record_type = kwargs.pop('record_type', None)
        super().__init__(*args, **kwargs)

        if fields is not None:
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)

    def validate_type(self, value):
        if value in RECORD_TYPES or (value is None):
            return value
        raise serializers.ValidationError

    def validate(self, data):
        required_fields = ['type', 'from_date']
        if not self.record_type:
            return data
        elif self.record_type == 'human':
            if all(map(lambda x: data.get(x, ''), ['first_name', 'last_name'] + required_fields)):
                return data
            else:
                raise serializers.ValidationError("first_name or last_name is empty value or no required fields")
        elif self.record_type == 'car':
            if all(map(lambda x: data.get(x, ''), ['car_number'] + required_fields)):
                return data
            else:
                raise serializers.ValidationError("car_number is empty value or no required fields")


class ChangeStatusSerializer(serializers.Serializer):
    status = serializers.CharField(max_length=STATUS_LEN)
    reason = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    def validate_status(self, value):
        if value in RECORD_API_STATUSES:
            return value
        raise serializers.ValidationError

    def validate(self, data):
        if data['status'] == 'canceled':
            if data.get('reason', ''):
                return data
            else:
                raise serializers.ValidationError("status 'cancelad' with no reason")
        return data
