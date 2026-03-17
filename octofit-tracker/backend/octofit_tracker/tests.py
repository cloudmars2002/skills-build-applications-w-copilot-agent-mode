from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Activity, Leaderboard, Team, UserProfile, Workout


class OctofitApiTests(APITestCase):
    def setUp(self):
        self.team = Team.objects.create(name="marvel team", city="New York")
        self.user = UserProfile.objects.create(
            name="Peter Parker",
            email="spiderman@octofit.dev",
            superhero="Spider-Man",
            team=self.team,
        )
        self.workout = Workout.objects.create(
            title="Skyline Sprint",
            focus_area="Cardio",
            intensity="High",
        )
        self.activity = Activity.objects.create(
            user=self.user,
            team=self.team,
            workout=self.workout,
            duration_minutes=35,
            calories_burned=420,
        )
        self.board = Leaderboard.objects.create(
            user=self.user,
            team=self.team,
            points=980,
            rank=1,
        )

    def test_api_root_works(self):
        response = self.client.get(reverse("api-root"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("teams", response.json())
        self.assertIn("users", response.json())
        self.assertIn("activities", response.json())
        self.assertIn("leaderboard", response.json())
        self.assertIn("workouts", response.json())

    def test_collections_endpoints_respond(self):
        urls = [
            "/api/teams/",
            "/api/users/",
            "/api/activities/",
            "/api/leaderboard/",
            "/api/workouts/",
        ]
        for url in urls:
            response = self.client.get(url)
            self.assertEqual(response.status_code, status.HTTP_200_OK, msg=url)

    def test_collections_have_data(self):
        self.assertEqual(Team.objects.count(), 1)
        self.assertEqual(UserProfile.objects.count(), 1)
        self.assertEqual(Workout.objects.count(), 1)
        self.assertEqual(Activity.objects.count(), 1)
        self.assertEqual(Leaderboard.objects.count(), 1)
