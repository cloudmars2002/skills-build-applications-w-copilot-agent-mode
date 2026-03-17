import { useEffect, useState } from 'react';

const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const BACKEND_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://127.0.0.1:8000';
const TEAMS_API_URL = `${BACKEND_BASE_URL}/api/teams/`;

function normalizeApiItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  return [];
}

function Teams() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadTeams() {
      try {
        console.log('[Teams] API endpoint:', TEAMS_API_URL);
        const response = await fetch(TEAMS_API_URL);
        if (!response.ok) {
          throw new Error(`Teams API failed: ${response.status}`);
        }
        const data = await response.json();
        console.log('[Teams] API response:', data);
        const normalized = normalizeApiItems(data);
        console.log('[Teams] normalized items:', normalized);
        setItems(normalized);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTeams();
  }, []);

  if (loading) return <p className="mb-0">Teams 로딩 중...</p>;
  if (error) return <p className="text-danger mb-0">{error}</p>;

  return (
    <div>
      <h2 className="h4 mb-3">Teams</h2>
      <ul className="list-group">
        {items.map((item) => (
          <li className="list-group-item" key={item.id}>
            <strong>{item.name}</strong> <span className="text-secondary">({item.city})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Teams;
