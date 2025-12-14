from django.urls import path
from . import views

urlpatterns = [
    path('tasks/',views.task_list,name="task_list"),
    path('pendingtasks/', views.pending_list, name="pending_list")
]
