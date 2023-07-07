from rest_framework import serializers

class UUIDMixin(serializers.Serializer):
    id = serializers.UUIDField(required=False)

class ObjectSerializer(UUIDMixin, serializers.Serializer):
    name = serializers.CharField(max_length=60)

class ObjectPutSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.CharField(max_length=60)

class ObjectHistorySerializer(serializers.Serializer):
    version = serializers.IntegerField()
    name = serializers.CharField(max_length=40)
    timestamp = serializers.DateTimeField()
    modified_by = serializers.CharField(max_length=40)
    action = serializers.CharField(max_length=10)
