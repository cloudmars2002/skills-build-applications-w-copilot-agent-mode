from django.db import models


class Team(models.Model):
    name = models.CharField(max_length=64, unique=True)
    city = models.CharField(max_length=64, blank=True)

    class Meta:
        db_table = "teams"

    def __str__(self):
        return self.name


class UserProfile(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField(unique=True)
    superhero = models.CharField(max_length=120)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="users")

    class Meta:
        db_table = "users"

    def __str__(self):
        return f"{self.name} ({self.superhero})"


class Workout(models.Model):
    title = models.CharField(max_length=120)
    focus_area = models.CharField(max_length=120)
    intensity = models.CharField(max_length=32)

    class Meta:
        db_table = "workouts"

    def __str__(self):
        return self.title


class Activity(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="activities")
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name="activities")
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="activities")
    duration_minutes = models.PositiveIntegerField()
    calories_burned = models.PositiveIntegerField()
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "activities"

    def __str__(self):
        return f"{self.user.name} - {self.workout.title}"


class Leaderboard(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="leaderboard_rows")
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="leaderboard_rows")
    points = models.PositiveIntegerField(default=0)
    rank = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "leaderboard"
        ordering = ["rank", "-points"]

    def __str__(self):
        return f"#{self.rank} {self.user.name} ({self.points})"
