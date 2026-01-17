from django.shortcuts import render, redirect, get_object_or_404
from django.http import Http404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .models import StudyTask
from .forms import StudyTaskForm
from django.utils import timezone
# Create your views here.
def home(request):
    qs = StudyTask.objects.all()
    if request.user.is_authenticated:
        qs = qs.filter(user = request.user)
    pending_task_count = qs.filter(completed = False).count()
    completed_task_count = qs.filter(completed = True).count()
    upcoming_deadlines_count = qs.filter(
        target_date__isnull = False,
        target_date__gte = timezone.now().date(),
        target_date__lte = timezone.now().date() +timezone.timedelta(days=7),
    ).count()

    return render(request,"tracker/home.html",{
        "pending_task_count" : pending_task_count,
        "completed_task_count" : completed_task_count,
        "upcoming_deadlines_count":upcoming_deadlines_count

    })

@login_required
def task_list(request):
    tasks = StudyTask.objects.filter(user=request.user).order_by("completed", "target_date")
    return render(request,"tracker/task_lists.html",{
        "tasks" : tasks
    })
@login_required
def pending_list(request):
    tasks = StudyTask.objects.filter(user = request.user,completed = False).order_by("target_date")
    return render(request,"tracker/pending_list.html",{
        "tasks" : tasks
    })

@login_required
def new_task(request):
    if request.method == "POST":
        form = StudyTaskForm(request.POST)
        if form.is_valid():
            task = form.save(commit=False)
            task.user = request.user
            task.save()
            return redirect("task_list")
    else:
        form = StudyTaskForm()
    return render(request, "tracker/task_form.html", {
        "form": form
    })

@login_required
def task_detail (request,pk):
    task = get_object_or_404(StudyTask, id=pk)
    return render(request,"tracker/task_detail.html",{
        "task" : task
    })

@login_required
def task_edit(request,pk):
    task = get_object_or_404(StudyTask,id = pk, user = request.user)
    if request.method == "POST":
        form = StudyTaskForm(request.POST,instance=task)
        if form.is_valid():
            form.save()
            return redirect("task_detail",pk = task.pk)
    else:
        form = StudyTaskForm(instance=task)
    return render(request,"tracker/task_form.html",{
        "form" : form
    })
@login_required
def task_delete(request,pk):
    task = get_object_or_404(StudyTask,id=pk)
    if request.method == "POST":
        task.delete()
        return redirect("task_list")
    return render(request,"tracker/task_confirm_delete.html",{
        "task" :task
    })

from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.http import JsonResponse
import json

@ensure_csrf_cookie
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")
        except:
            username = request.POST.get("username")
            password = request.POST.get("password")
            
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            if request.headers.get('Content-Type') == 'application/json' or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({"status": "success", "username": user.username})
            return redirect('task_list')
        else:
            if request.headers.get('Content-Type') == 'application/json' or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({"status": "error", "message": "Invalid credentials"}, status=400)
            messages.error(request, "Invalid username or password")
            return render(request, 'tracker/login.html', {'username': username})

    return render(request, 'tracker/login.html')

def log_out(request):
    logout(request)
    if request.headers.get('Content-Type') == 'application/json' or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({"status": "success"})
    return redirect("login_view")

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({"status": "token set"})

def sign_up(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("login_view")
    else:
        form = UserCreationForm()
    
    return render(request, "tracker/signup.html",{
        "form" : form
    })