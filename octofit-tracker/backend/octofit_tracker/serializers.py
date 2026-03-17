from rest_framework import serializers

from .models import Activity, Leaderboard, Team, UserProfile, Workout


class TeamSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = Team
        fields = ["id", "name", "city"]


class UserProfileSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = UserProfile
        fields = ["id", "name", "email", "superhero", "team"]


class WorkoutSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = Workout
        fields = ["id", "title", "focus_area", "intensity"]


class ActivitySerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = Activity
        fields = [
            "id",
            "user",
            "workout",
            "team",
            "duration_minutes",
            "calories_burned",
            "recorded_at",
        ]


class LeaderboardSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = Leaderboard
        fields = ["id", "user", "team", "points", "rank"]
