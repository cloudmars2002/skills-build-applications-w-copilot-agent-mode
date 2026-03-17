import { useEffect, useState } from 'react';

const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const BACKEND_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://127.0.0.1:8000';
const USERS_API_URL = `${BACKEND_BASE_URL}/api/users/`;
const TEAMS_API_URL = `${BACKEND_BASE_URL}/api/teams/`;

function normalizeApiItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  return [];
}

function Users() {
  const [items, setItems] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    superhero: '',
    team: '',
  });

  useEffect(() => {
    async function loadUsers() {
      try {
        console.log('[Users] API endpoint:', USERS_API_URL);
        console.log('[Users] Teams API endpoint:', TEAMS_API_URL);

        const [usersResponse, teamsResponse] = await Promise.all([
          fetch(USERS_API_URL),
          fetch(TEAMS_API_URL),
        ]);

        if (!usersResponse.ok) {
          throw new Error(`Users API failed: ${usersResponse.status}`);
        }
        if (!teamsResponse.ok) {
          throw new Error(`Teams API failed: ${teamsResponse.status}`);
        }

        const data = await usersResponse.json();
        const teamsData = await teamsResponse.json();
        console.log('[Users] API response:', data);
        console.log('[Users] Teams API response:', teamsData);

        const normalized = normalizeApiItems(data);
        const normalizedTeams = normalizeApiItems(teamsData);

        console.log('[Users] normalized items:', normalized);
        console.log('[Users] normalized teams:', normalizedTeams);

        setItems(normalized);
        setTeams(normalizedTeams);

        if (normalizedTeams.length > 0) {
          setForm((prev) => ({ ...prev, team: String(normalizedTeams[0].id) }));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim().toLowerCase();
    const trimmedHero = form.superhero.trim();
    const selectedTeam = form.team;

    if (!trimmedName || !trimmedEmail || !trimmedHero || !selectedTeam) {
      setFormError('이름, 이메일, 슈퍼히어로, 팀은 모두 필수입니다.');
      return;
    }
    if (!emailRegex.test(trimmedEmail)) {
      setFormError('올바른 이메일 형식을 입력하세요.');
      return;
    }

    const duplicated = items.some((u) => String(u.email).toLowerCase() === trimmedEmail);
    if (duplicated) {
      setFormError('이미 등록된 이메일입니다. 다른 이메일을 사용하세요.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: trimmedName,
        email: trimmedEmail,
        superhero: trimmedHero,
        team: Number(selectedTeam),
      };

      console.log('[Users] signup payload:', payload);

      const response = await fetch(USERS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `회원가입 실패 (${response.status}) ${JSON.stringify(errorData)}`
        );
      }

      const created = await response.json();
      console.log('[Users] created user:', created);

      setItems((prev) => [...prev, created]);
      setForm({
        name: '',
        email: '',
        superhero: '',
        team: selectedTeam,
      });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="mb-0">Users 로딩 중...</p>;
  if (error) return <p className="text-danger mb-0">{error}</p>;

  return (
    <div>
      <h2 className="h4 mb-3">Users</h2>

      <form className="row g-2 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="이름"
            value={form.name}
            onChange={(e) => updateForm('name', e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="이메일"
            type="email"
            value={form.email}
            onChange={(e) => updateForm('email', e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            className="form-control"
            placeholder="슈퍼히어로"
            value={form.superhero}
            onChange={(e) => updateForm('superhero', e.target.value)}
          />
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
        <div className="col-md-2 d-grid">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? '가입 중...' : '회원가입'}
          </button>
        </div>
      </form>

      {formError ? <p className="text-danger">{formError}</p> : null}

      <ul className="list-group">
        {items.map((item) => (
          <li className="list-group-item" key={item.id}>
            <strong>{item.name}</strong> ({item.superhero}) | email: {item.email} | team:{' '}
            {item.team}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
