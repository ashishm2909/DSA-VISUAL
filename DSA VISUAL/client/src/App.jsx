import { Routes, Route, useNavigate, useParams, useLocation, NavLink, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import LessonView from "./components/LessonView.jsx";
import Home from "./components/Home.jsx";
import Roadmap from "./components/Roadmap.jsx";
import LessonMap from "./components/LessonMap.jsx";
import Footer from "./components/Footer.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import { fetchLessons } from "./api.js";

const LOGO = (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <rect x="0.75" y="0.75" width="26.5" height="26.5" rx="8" className="mark-frame" strokeWidth="1.5" />
    <path d="M9 9 L19 9 L14 19 Z" className="mark-link" strokeWidth="1.4" />
    <circle cx="9" cy="9" r="2.6" className="mark-accent" />
    <circle cx="19" cy="9" r="2.6" className="mark-node" />
    <circle cx="14" cy="19" r="2.6" className="mark-node" />
  </svg>
);

export default function App() {
  const [catalog, setCatalog] = useState(null);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("dsa-theme") || "dark");
  const location = useLocation();

  useEffect(() => {
    fetchLessons().then(setCatalog).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("dsa-theme", theme);
  }, [theme]);

  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  const lessonMatch = location.pathname.match(/^\/lesson\/(.+)$/);
  const current =
    lessonMatch && catalog
      ? catalog.categories.flatMap((c) => c.lessons).find((l) => l.id === lessonMatch[1])
      : null;

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand" aria-label="DSA Visual home">
          {LOGO}
          <span className="brand-text"><b>DSA Visual</b><span className="brand-sub">learn by watching</span></span>
        </Link>

        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>Home</NavLink>
          <NavLink to="/map" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>Map</NavLink>
          <Link to="/#visualizers" className="nav-link">Visualizers</Link>
          <NavLink to="/roadmap" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>Roadmap</NavLink>
        </nav>

        <div className="topbar-right">
          {current && <span className="topbar-lesson">{current.title}</span>}
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      <main className="main">
        {error && <div className="banner error">Could not reach the server: {error}</div>}
        <Routes>
          <Route path="/" element={<Home catalog={catalog} />} />
          <Route path="/map" element={<LessonMap catalog={catalog} />} />
          <Route path="/roadmap" element={<Roadmap catalog={catalog} />} />
          <Route path="/lesson/:id" element={<LessonViewWrapper catalog={catalog} />} />
        </Routes>
      </main>

      <Footer catalog={catalog} />
    </div>
  );
}

function LessonViewWrapper({ catalog }) {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!catalog) return <div className="loading">Loading…</div>;
  if (!catalog.categories.flatMap((c) => c.lessons).some((l) => l.id === id)) {
    return (
      <div className="loading">
        Unknown lesson. <button onClick={() => navigate("/")}>Go home</button>
      </div>
    );
  }
  return <LessonView lessonId={id} defaultGraph={catalog.defaultGraph} catalog={catalog} />;
}
