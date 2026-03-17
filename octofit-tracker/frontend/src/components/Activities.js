import { useEffect, useState } from 'react';

const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const BACKEND_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://127.0.0.1:8000';
const ACTIVITIES_API_URL = `${BACKEND_BASE_URL}/api/activities/`;
const USERS_API_URL = `${BACKEND_BASE_URL}/api/users/`;
const TEAMS_API_URL = `${BACKEND_BASE_URL}/api/teams/`;
const WORKOUTS_API_URL = `${BACKEND_BASE_URL}/api/workouts/`;

function normalizeApiItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  return [];
}

function Activities() {
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    user: '',
    team: '',
    workout: '',
    duration_minutes: '',
    calories_burned: '',
  });

  useEffect(() => {
    async function loadActivities() {
      try {
        console.log('[Activities] API endpoint:', ACTIVITIES_API_URL);
        console.log('[Activities] Users API endpoint:', USERS_API_URL);
        console.log('[Activities] Teams API endpoint:', TEAMS_API_URL);
        console.log('[Activities] Workouts API endpoint:', WORKOUTS_API_URL);

        const [activitiesResponse, usersResponse, teamsResponse, workoutsResponse] =
          await Promise.all([
            fetch(ACTIVITIES_API_URL),
            fetch(USERS_API_URL),
            fetch(TEAMS_API_URL),
            fetch(WORKOUTS_API_URL),
          ]);

        if (!activitiesResponse.ok) {
          throw new Error(`Activities API failed: ${activitiesResponse.status}`);
        }
        if (!usersResponse.ok) {
          throw new Error(`Users API failed: ${usersResponse.status}`);
        }
        if (!teamsResponse.ok) {
          throw new Error(`Teams API failed: ${teamsResponse.status}`);
        }
        if (!workoutsResponse.ok) {
          throw new Error(`Workouts API failed: ${workoutsResponse.status}`);
        }

        const data = await activitiesResponse.json();
        const usersData = await usersResponse.json();
        const teamsData = await teamsResponse.json();
        const workoutsData = await workoutsResponse.json();

        console.log('[Activities] API response:', data);
        console.log('[Activities] Users API response:', usersData);
        console.log('[Activities] Teams API response:', teamsData);
        console.log('[Activities] Workouts API response:', workoutsData);

        const normalized = normalizeApiItems(data);
        const normalizedUsers = normalizeApiItems(usersData);
        const normalizedTeams = normalizeApiItems(teamsData);
        const normalizedWorkouts = normalizeApiItems(workoutsData);

        console.log('[Activities] normalized items:', normalized);
        console.log('[Activities] normalized users:', normalizedUsers);
        console.log('[Activities] normalized teams:', normalizedTeams);
        console.log('[Activities] normalized workouts:', normalizedWorkouts);

        setItems(normalized);
        setUsers(normalizedUsers);
        setTeams(normalizedTeams);
        setWorkouts(normalizedWorkouts);

        if (normalizedUsers.length && normalizedTeams.length && normalizedWorkouts.length) {
          setForm({
            user: String(normalizedUsers[0].id),
            team: String(normalizedTeams[0].id),
            workout: String(normalizedWorkouts[0].id),
            duration_minutes: '',
            calories_burned: '',
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, []);

  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleAddActivity(event) {
    event.preventDefault();
    setFormError('');

    const duration = Number(form.duration_minutes);
    const calories = Number(form.calories_burned);

    if (!form.user || !form.team || !form.workout) {
      setFormError('사용자, 팀, 운동은 모두 선택해야 합니다.');
      return;
    }
    if (!Number.isFinite(duration) || duration <= 0) {
      setFormError('운동 시간은 1 이상 숫자로 입력하세요.');
      return;
    }
    if (!Number.isFinite(calories) || calories <= 0) {
      setFormError('소모 칼로리는 1 이상 숫자로 입력하세요.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        user: Number(form.user),
        team: Number(form.team),
        workout: Number(form.workout),
        duration_minutes: duration,
        calories_burned: calories,
      };

      console.log('[Activities] add payload:', payload);

      const response = await fetch(ACTIVITIES_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `기타 활동 추가 실패 (${response.status}) ${JSON.stringify(errorData)}`
        );
      }

      const created = await response.json();
      console.log('[Activities] created activity:', created);

      setItems((prev) => [created, ...prev]);
      setForm((prev) => ({
        ...prev,
        duration_minutes: '',
        calories_burned: '',
      }));
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="mb-0">Activities 로딩 중...</p>;
  if (error) return <p className="text-danger mb-0">{error}</p>;

  return (
    <div>
      <h2 className="h4 mb-3">Activities</h2>

      <form className="row g-2 mb-4" onSubmit={handleAddActivity}>
        <div className="col-md-2">
          <select
            className="form-select"
            value={form.user}
            onChange={(e) => updateForm('user', e.target.value)}
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={form.team}
            onChange={(e) => updateForm('team', e.target.value)}
          >
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={form.workout}
            onChange={(e) => updateForm('workout', e.target.value)}
          >
            {workouts.map((workout) => (
              <option key={workout.id} value={workout.id}>
                {workout.title}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <input
            className="form-control"
            type="number"
            min="1"
            placeholder="시간(분)"
            value={form.duration_minutes}
            onChange={(e) => updateForm('duration_minutes', e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            className="form-control"
            type="number"
            min="1"
            placeholder="칼로리"
            value={form.calories_burned}
            onChange={(e) => updateForm('calories_burned', e.target.value)}
          />
        </div>
        <div className="col-md-2 d-grid">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? '추가 중...' : '기타 활동 추가'}
          </button>
        </div>
      </form>

      {formError ? <p className="text-danger">{formError}</p> : null}

      <ul className="list-group">
        {items.map((item) => (
          <li className="list-group-item" key={item.id}>
            user:{' '}
            <strong>{item.user}</strong> | workout: <strong>{item.workout}</strong> |
            duration: {item.duration_minutes} min | calories: {item.calories_burned}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Activities;
