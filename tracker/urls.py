from django.urls import path
from . import views

urlpatterns = [
    path('tasks/',views.task_list,name="task_list"),
    path('tasks/<int:pk>/',views.task_detail, name = "task_detail"),
    path('tasks/<int:pk>/edit/',views.task_edit, name = "task_edit"),
    path('tasks/<int:pk>/delete',views.task_delete,name = "task_delete"),
    path('pendingtasks/', views.pending_list, name="pending_list"),
    path('tasks/new',views.new_task,name="new_task")
]
