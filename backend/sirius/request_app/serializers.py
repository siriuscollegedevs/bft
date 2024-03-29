from rest_framework import serializers
from drf_spectacular.utils import extend_schema_serializer, OpenApiExample
from sirius.config import NAMES_LEN, STATUS_LEN
from .config import RECORD_TYPES, RECORD_API_STATUSES


class UUIDMixin(serializers.Serializer):
    id = serializers.UUIDField(read_only=True)


class RequestSerializer(UUIDMixin, serializers.Serializer):
    timestamp = serializers.DateTimeField(required=False)
    code = serializers.CharField(read_only=True)
    object_ids = serializers.ListField(child=serializers.UUIDField(), allow_empty=False)


class PostRequestSerializer(UUIDMixin, serializers.Serializer):
    timestamp = serializers.DateField()
    code = serializers.IntegerField()


class RecordSerializer(UUIDMixin, serializers.Serializer):
    timestamp = serializers.DateTimeField(read_only=True)
    action = serializers.CharField(read_only=True)
    modified_by = serializers.CharField(read_only=True)
    type = serializers.CharField()
    first_name = serializers.CharField(max_length=NAMES_LEN, required=False, allow_blank=True, default="")
    surname = serializers.CharField(max_length=NAMES_LEN, required=False, allow_blank=True, default="")
    last_name = serializers.CharField(max_length=NAMES_LEN, required=False, allow_blank=True, default="")
    car_number = serializers.CharField(required=False, allow_blank=True, default="")
    car_brand = serializers.CharField(required=False, allow_blank=True, default="")
    car_model = serializers.CharField(required=False, allow_blank=True, default="")
    from_date = serializers.DateField()
    to_date = serializers.DateField()
    note = serializers.CharField(required=False, allow_blank=True, default="")

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
        if not self.record_type:
            return data
        elif self.record_type == 'human':
            if all(map(lambda x: data.get(x, ''), ['first_name', 'last_name'])):
                return data
            else:
                raise serializers.ValidationError("first_name or last_name is empty value")
        elif self.record_type == 'car':
            if data.get('car_number', ''):
                return data
            else:
                raise serializers.ValidationError("car_number is empty value")


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
                raise serializers.ValidationError("status 'canceled' with no reason")
        return data


class RequestSearchSerializer(serializers.Serializer):
    request_id = serializers.UUIDField()
    code = serializers.IntegerField()
    id = serializers.UUIDField()
    type = serializers.CharField()
    objects = serializers.ListField(child=serializers.CharField())
    first_name = serializers.CharField(max_length=NAMES_LEN, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=NAMES_LEN, required=False, allow_blank=True)
    surname = serializers.CharField(max_length=NAMES_LEN, required=False, allow_blank=True)
    car_number = serializers.CharField(required=False, allow_blank=True)
    car_brand = serializers.CharField(required=False, allow_blank=True)
    car_model = serializers.CharField(required=False, allow_blank=True)
    from_date = serializers.DateField()
    to_date = serializers.DateField()
    note = serializers.CharField(required=False, allow_blank=True)
