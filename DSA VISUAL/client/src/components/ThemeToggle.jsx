export default function ThemeToggle({ theme, onToggle, className = "" }) {
  const isDark = theme === "dark";
  return (
    <button className={"theme-toggle " + className} onClick={onToggle} aria-label="Toggle dark / light theme" title="Toggle theme">
      <span className="theme-dot" />
      <span className="theme-label">{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}
