import { useState } from "react";
import LearningTree from "./LearningTree.jsx";
import PatternTreeMap from "./PatternTreeMap.jsx";

export default function LessonMap() {
  const [tab, setTab] = useState("path");

  return (
    <div className="map-page">
      <header className="map-head">
        <div className="eyebrow">DSA Roadmap</div>
        <h1>Learn DSA Like a Language</h1>
        <p className="map-lead">
          <b>Data Structures</b> are vocabulary, <b>Algorithms</b> are grammar, <b>Patterns</b> are
          speaking fluently. Follow the tree from Foundations to Expert — each concept builds on the
          previous one.
        </p>
      </header>

      <div className="map-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={tab === "path"}
          className={"map-tab" + (tab === "path" ? " on" : "")}
          onClick={() => setTab("path")}
        >
          🌱 Learning Path
        </button>
        <button
          role="tab"
          aria-selected={tab === "map"}
          className={"map-tab" + (tab === "map" ? " on" : "")}
          onClick={() => setTab("map")}
        >
          🕸 Patterns Map
        </button>
      </div>

      {tab === "path" ? <LearningTree /> : <PatternTreeMap />}
    </div>
  );
}
