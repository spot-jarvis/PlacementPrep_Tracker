from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import CompanyViewSet, RoleViewSet, TopicViewSet, StudyTaskViewSet

from . import views

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'roles', RoleViewSet)
router.register(r'topics', TopicViewSet)
router.register(r'tasks', StudyTaskViewSet, basename='tasks')

urlpatterns = [
    path('', include(router.urls)),
    path('accounts/login/', views.login_view, name='api_login'),
    path('accounts/logout/', views.log_out, name='api_logout'),
    path('accounts/signup/', views.sign_up, name='api_signup'),
    path('csrf/', views.get_csrf_token, name='api_csrf'),
]
