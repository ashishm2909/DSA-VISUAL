export default function PseudoCode({ lines, active }) {
  return (
    <div className="pseudo">
      <div className="panel-title">Pseudocode</div>
      <ol>
        {lines.map((line, i) => (
          <li key={i} className={i === active ? "active" : ""}>
            <span className="ln">{i}</span>
            <code>{line}</code>
          </li>
        ))}
      </ol>
    </div>
  );
}
