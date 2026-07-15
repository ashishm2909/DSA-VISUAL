export default function PlaybackControls({ playing, onToggle, onStepBack, onStepForward, onReset, speed, onSpeed, disabled, canBack, canForward, voice, onToggleVoice, lang, onLang }) {
  const speechSupported = typeof window !== "undefined" && "speechSynthesis" in window;
  const LANGS = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "ta", name: "Tamil" },
    { code: "te", name: "Telugu" },
    { code: "bn", name: "Bengali" },
    { code: "mr", name: "Marathi" },
    { code: "gu", name: "Gujarati" },
    { code: "kn", name: "Kannada" },
    { code: "ml", name: "Malayalam" },
    { code: "pa", name: "Punjabi" },
  ];
  return (
    <div className="playback">
      <button onClick={onReset} disabled={disabled} title="Reset">⏮</button>
      <button onClick={onStepBack} disabled={disabled || !canBack} title="Step back">◀</button>
      <button className="play" onClick={onToggle} disabled={disabled} title="Play / Pause">
        {playing ? "⏸ Pause" : "▶ Play"}
      </button>
      <button onClick={onStepForward} disabled={disabled || !canForward} title="Step forward">▶</button>
      <button
        className={"voice-btn" + (voice ? " on" : "")}
        onClick={onToggleVoice}
        disabled={disabled || !speechSupported}
        title={speechSupported ? "Toggle voice narration" : "Voice not supported in this browser"}
      >
        {voice ? "Voice On" : "Voice"}
      </button>
      <label className="lang-select" title="Explanation language">
        <span className="lang-icon">Lang</span>
        <select value={lang} onChange={(e) => onLang(e.target.value)}>
          {LANGS.map((l) => (
            <option key={l.code} value={l.code}>{l.name}</option>
          ))}
        </select>
      </label>
      <label className="speed">
        Speed
        <input type="range" min="120" max="1500" step="20" value={1720 - speed} onChange={(e) => onSpeed(1720 - Number(e.target.value))} />
      </label>
    </div>
  );
}
