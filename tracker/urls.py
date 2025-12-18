from django.urls import path
from . import views

urlpatterns = [
    path('tasks/',views.task_list,name="task_list"),
    path('tasks/<int:pk>/',views.task_detail, name = "task_detail"),
    path('pendingtasks/', views.pending_list, name="pending_list"),
    path('tasks/new',views.new_task,name="new_task")
]
