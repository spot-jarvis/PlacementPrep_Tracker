from rest_framework import serializers
from .models import Company, Role, Topic, StudyTask

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

class RoleSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = Role
        fields = '__all__'

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = '__all__'

class StudyTaskSerializer(serializers.ModelSerializer):
    topic_name = serializers.SerializerMethodField()
    
    class Meta:
        model = StudyTask
        fields = '__all__'
        extra_kwargs = {
            'user': {'read_only': True}
        }

    def get_topic_name(self, obj):
        return obj.topic.name if obj.topic else "Uncategorized"
