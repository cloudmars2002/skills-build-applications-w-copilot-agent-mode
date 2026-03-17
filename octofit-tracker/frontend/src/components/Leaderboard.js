import { useEffect, useState } from 'react';

const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const BACKEND_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://127.0.0.1:8000';
const LEADERBOARD_API_URL = `${BACKEND_BASE_URL}/api/leaderboard/`;

function normalizeApiItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  return [];
}

function Leaderboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        console.log('[Leaderboard] API endpoint:', LEADERBOARD_API_URL);
        const response = await fetch(LEADERBOARD_API_URL);
        if (!response.ok) {
          throw new Error(`Leaderboard API failed: ${response.status}`);
        }
        const data = await response.json();
        console.log('[Leaderboard] API response:', data);
        const rows = normalizeApiItems(data);
        console.log('[Leaderboard] normalized items:', rows);
        setItems(rows.sort((a, b) => a.rank - b.rank));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, []);

  if (loading) return <p className="mb-0">Leaderboard 로딩 중...</p>;
  if (error) return <p className="text-danger mb-0">{error}</p>;

  return (
    <div>
      <h2 className="h4 mb-3">Leaderboard</h2>
      <ol className="list-group list-group-numbered">
        {items.map((item) => (
          <li className="list-group-item" key={item.id}>
            rank: <strong>{item.rank}</strong> | user: <strong>{item.user}</strong> |
            team: {item.team} | points: {item.points}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Leaderboard;
