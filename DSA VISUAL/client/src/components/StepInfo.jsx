export default function StepInfo({ step, total, description }) {
  const pct = total ? Math.round(((step + 1) / total) * 100) : 0;
  return (
    <div className="stepinfo">
      <div className="stepinfo-head">
        <span className="step-count">Step {total ? step + 1 : 0}</span>
        <span className="step-total">/ {total || 0}</span>
        <span className="step-pct">{pct}%</span>
      </div>
      <div className="progress"><div className="progress-fill" style={{ width: pct + "%" }} /></div>
      <p className="step-desc">{description || "Run an operation to see the explanation appear here, step by step."}</p>
    </div>
  );
}
