from django.contrib import admin

from .models import Activity, Leaderboard, Team, UserProfile, Workout


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "city")
    search_fields = ("name", "city")


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "email", "superhero", "team")
    search_fields = ("name", "email", "superhero")
    list_filter = ("team",)


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "focus_area", "intensity")
    search_fields = ("title", "focus_area", "intensity")


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "team",
        "workout",
        "duration_minutes",
        "calories_burned",
        "recorded_at",
    )
    list_filter = ("team", "workout")


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ("id", "rank", "user", "team", "points")
    list_filter = ("team",)
    ordering = ("rank", "-points")
