from django.core.management.base import BaseCommand
from django.db import transaction

from octofit_tracker.models import Activity, Leaderboard, Team, UserProfile, Workout


class Command(BaseCommand):
    help = "octofit_db 데이터베이스에 테스트 데이터를 입력합니다."

    @transaction.atomic
    def handle(self, *args, **options):
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        UserProfile.objects.all().delete()
        Workout.objects.all().delete()
        Team.objects.all().delete()

        marvel = Team.objects.create(name="marvel team", city="New York")
        dc = Team.objects.create(name="dc team", city="Gotham")

        users = [
            UserProfile.objects.create(
                name="Peter Parker",
                email="spiderman@octofit.dev",
                superhero="Spider-Man",
                team=marvel,
            ),
            UserProfile.objects.create(
                name="Tony Stark",
                email="ironman@octofit.dev",
                superhero="Iron Man",
                team=marvel,
            ),
            UserProfile.objects.create(
                name="Bruce Wayne",
                email="batman@octofit.dev",
                superhero="Batman",
                team=dc,
            ),
            UserProfile.objects.create(
                name="Diana Prince",
                email="wonderwoman@octofit.dev",
                superhero="Wonder Woman",
                team=dc,
            ),
        ]

        workouts = [
            Workout.objects.create(
                title="Skyline Sprint",
                focus_area="Cardio",
                intensity="High",
            ),
            Workout.objects.create(
                title="Titan Strength",
                focus_area="Strength",
                intensity="Medium",
            ),
            Workout.objects.create(
                title="Stealth Mobility",
                focus_area="Mobility",
                intensity="Low",
            ),
        ]

        Activity.objects.bulk_create(
            [
                Activity(
                    user=users[0],
                    team=marvel,
                    workout=workouts[0],
                    duration_minutes=35,
                    calories_burned=420,
                ),
                Activity(
                    user=users[1],
                    team=marvel,
                    workout=workouts[1],
                    duration_minutes=45,
                    calories_burned=510,
                ),
                Activity(
                    user=users[2],
                    team=dc,
                    workout=workouts[1],
                    duration_minutes=40,
                    calories_burned=470,
                ),
                Activity(
                    user=users[3],
                    team=dc,
                    workout=workouts[2],
                    duration_minutes=30,
                    calories_burned=300,
                ),
            ]
        )

        rows = [
            Leaderboard(user=users[1], team=marvel, points=980, rank=1),
            Leaderboard(user=users[2], team=dc, points=940, rank=2),
            Leaderboard(user=users[0], team=marvel, points=910, rank=3),
            Leaderboard(user=users[3], team=dc, points=870, rank=4),
        ]
        Leaderboard.objects.bulk_create(rows)

        self.stdout.write(self.style.SUCCESS("테스트 데이터 적재가 완료되었습니다."))
