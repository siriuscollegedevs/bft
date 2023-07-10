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
