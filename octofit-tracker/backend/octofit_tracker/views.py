from django.http import JsonResponse
from rest_framework import viewsets

from .models import Activity, Leaderboard, Team, UserProfile, Workout
from .serializers import (
    ActivitySerializer,
    LeaderboardSerializer,
    TeamSerializer,
    UserProfileSerializer,
    WorkoutSerializer,
)


def api_root(request):
    return JsonResponse(
        {
            "teams": "teams/",
            "users": "users/",
            "activities": "activities/",
            "leaderboard": "leaderboard/",
            "workouts": "workouts/",
        }
    )


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.order_by("id")
    serializer_class = TeamSerializer


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.select_related("team").order_by("id")
    serializer_class = UserProfileSerializer


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.select_related("user", "team", "workout").order_by("id")
    serializer_class = ActivitySerializer


class LeaderboardViewSet(viewsets.ModelViewSet):
    queryset = Leaderboard.objects.select_related("user", "team").order_by("rank", "-points")
    serializer_class = LeaderboardSerializer


class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.order_by("id")
    serializer_class = WorkoutSerializer
