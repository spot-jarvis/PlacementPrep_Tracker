from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import CompanyViewSet, RoleViewSet, TopicViewSet, StudyTaskViewSet

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'roles', RoleViewSet)
router.register(r'topics', TopicViewSet)
router.register(r'tasks', StudyTaskViewSet, basename='tasks')

urlpatterns = [
    path('', include(router.urls)),
]
