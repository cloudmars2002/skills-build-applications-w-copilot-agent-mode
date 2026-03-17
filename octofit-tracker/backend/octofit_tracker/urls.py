import os

from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    ActivityViewSet,
    LeaderboardViewSet,
    TeamViewSet,
    UserProfileViewSet,
    WorkoutViewSet,
    api_root as views_api_root,
)

codespace_name = os.environ.get('CODESPACE_NAME')
if codespace_name:
    base_url = f"https://{codespace_name}-8000.app.github.dev"
else:
    base_url = "http://localhost:8000"


def api_root(request):
    # Return absolute URLs to match codespace/public endpoint format.
    if request.path in ("/", "/api/"):
        return JsonResponse(
            {
                "teams": f"{base_url}/api/teams/",
                "users": f"{base_url}/api/users/",
                "activities": f"{base_url}/api/activities/",
                "leaderboard": f"{base_url}/api/leaderboard/",
                "workouts": f"{base_url}/api/workouts/",
            }
        )
    return views_api_root(request)

router = DefaultRouter()
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'users', UserProfileViewSet, basename='user')
router.register(r'activities', ActivityViewSet, basename='activity')
router.register(r'leaderboard', LeaderboardViewSet, basename='leaderboard')
router.register(r'workouts', WorkoutViewSet, basename='workout')

urlpatterns = [
    path('', api_root, name='root-api'),
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/', include(router.urls)),
]
