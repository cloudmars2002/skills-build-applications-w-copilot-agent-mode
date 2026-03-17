import { useEffect, useState } from 'react';

const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const BACKEND_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://127.0.0.1:8000';
const WORKOUTS_API_URL = `${BACKEND_BASE_URL}/api/workouts/`;

function normalizeApiItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  return [];
}

function Workouts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadWorkouts() {
      try {
        console.log('[Workouts] API endpoint:', WORKOUTS_API_URL);
        const response = await fetch(WORKOUTS_API_URL);
        if (!response.ok) {
          throw new Error(`Workouts API failed: ${response.status}`);
        }
        const data = await response.json();
        console.log('[Workouts] API response:', data);
        const normalized = normalizeApiItems(data);
        console.log('[Workouts] normalized items:', normalized);
        setItems(normalized);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadWorkouts();
  }, []);

  if (loading) return <p className="mb-0">Workouts 로딩 중...</p>;
  if (error) return <p className="text-danger mb-0">{error}</p>;

  return (
    <div>
      <h2 className="h4 mb-3">Workouts</h2>
      <ul className="list-group">
        {items.map((item) => (
          <li className="list-group-item" key={item.id}>
            <strong>{item.title}</strong> | focus: {item.focus_area} | intensity:{' '}
            {item.intensity}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Workouts;
