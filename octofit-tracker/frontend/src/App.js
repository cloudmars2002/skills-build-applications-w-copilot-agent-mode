import { Navigate, NavLink, Route, Routes } from 'react-router-dom';

import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

const tabs = [
  { path: '/activities', label: 'Activities' },
  { path: '/leaderboard', label: 'Leaderboard' },
  { path: '/teams', label: 'Teams' },
  { path: '/users', label: 'Users' },
  { path: '/workouts', label: 'Workouts' },
];

function App() {
  return (
    <main className="container py-4 py-md-5">
      <header className="mb-4">
        <h1 className="display-6 fw-bold mb-2">OctoFit Tracker</h1>
        <p className="text-secondary mb-0">Django REST API 연동 대시보드</p>
      </header>

      <nav className="nav nav-pills mb-4 flex-wrap gap-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : 'border border-secondary-subtle'}`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <section className="card shadow-sm border-0">
        <div className="card-body">
          <Routes>
            <Route path="/" element={<Navigate to="/activities" replace />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/users" element={<Users />} />
            <Route path="/workouts" element={<Workouts />} />
          </Routes>
        </div>
      </section>
    </main>
  );
}

export default App;
