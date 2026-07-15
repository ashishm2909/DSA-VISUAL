import { NavLink } from "react-router-dom";

const LOGO = (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <rect x="0.75" y="0.75" width="26.5" height="26.5" rx="8" className="mark-frame" strokeWidth="1.5" />
    <path d="M9 9 L19 9 L14 19 Z" className="mark-link" strokeWidth="1.4" />
    <circle cx="9" cy="9" r="2.6" className="mark-accent" />
    <circle cx="19" cy="9" r="2.6" className="mark-node" />
    <circle cx="14" cy="19" r="2.6" className="mark-node" />
  </svg>
);

export default function Footer({ catalog }) {
  const categories = catalog?.categories || [];
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <NavLink to="/" className="brand">
            {LOGO}
            <span className="brand-text"><b>DSA Visual</b><span className="brand-sub">Instrument</span></span>
          </NavLink>
          <p className="footer-tag">
            A precision instrument for learning data structures &amp; algorithms — every step
            animated, explained, and synced to the code.
          </p>
          <div className="footer-pill"><span className="dot-live" /> All visualizers run live</div>
          <NavLink to="/roadmap" className="footer-pill">⌘ Learning Roadmap</NavLink>
        </div>

        <div className="footer-cols">
          {categories.map((cat) => (
            <div className="footer-col" key={cat.id}>
              <div className="footer-col-title">{cat.title}</div>
              <ul>
                {cat.lessons.slice(0, 5).map((l) => (
                  <li key={l.id}><NavLink to={`/lesson/${l.id}`}>{l.title}</NavLink></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} DSA Visual</span>
        <span className="footer-meta">Crafted as a learning instrument · React · Vite · Three.js</span>
      </div>
    </footer>
  );
}
