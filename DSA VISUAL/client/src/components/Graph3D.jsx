import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Html } from "@react-three/drei";

const COLORS = {
  default: "#3a3d47",
  compare: "#e8b14b",
  swap: "#f2547d",
  active: "#ff6a3d",
  sorted: "#34c98b",
  found: "#4ade80",
  visited: "#8b7fe8",
  inqueue: "#4cc9e0",
  current: "#ff8a5b",
  path: "#ff6a3d",
  pivot: "#e08a2e",
  left: "#4cc9e0",
  right: "#ff6a3d",
  done: "#34c98b",
};

const to3d = (x, y) => [(x - 220) / 220 * 4.4, -(y - 200) / 200 * 4.4, 0];
const HOT = new Set(["current", "compare", "swap", "active", "found", "inqueue"]);

function Edge({ a, b, status }) {
  const p1 = to3d(a.x, a.y);
  const p2 = to3d(b.x, b.y);
  const isPath = status === "path";
  const isCurrent = status === "current";
  const color = isPath ? "#ff6a3d" : isCurrent ? "#ff8a5b" : "#3a4254";
  const width = isPath || isCurrent ? 3.5 : 1.4;
  const opacity = isPath ? 1 : isCurrent ? 1 : 0.55;
  return (
    <Line points={[p1, p2]} color={color} lineWidth={width} transparent opacity={opacity} />
  );
}

function Node({ node }) {
  const [x, y, z] = to3d(node.x, node.y);
  const color = COLORS[node.status] || COLORS.default;
  const hot = HOT.has(node.status);
  return (
    <group position={[x, y, z]}>
      <mesh scale={hot ? 1.28 : 1}>
        <sphereGeometry args={[0.36, 48, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hot ? 0.65 : 0.16}
          roughness={0.3}
          metalness={0.15}
        />
      </mesh>
      <Html center style={{ pointerEvents: "none" }}>
        <div className={"g3-label" + (hot ? " on" : "")}>{node.label}</div>
      </Html>
      {node.order != null && (
        <Html center position={[0, -0.62, 0]} style={{ pointerEvents: "none" }}>
          <div className="g3-order">{node.order}</div>
        </Html>
      )}
    </group>
  );
}

export default function Graph3D({ nodes, edges, queue, stack }) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  return (
    <div className="g3-wrap">
      <div className="g3-canvas">
        <Canvas camera={{ position: [0, 0, 9.5], fov: 45 }} dpr={[1, 2]} resize={{ scroll: false }} style={{ width: "100%", height: "100%" }}>
          <color attach="background" args={["#0a0f1f"]} />
          <ambientLight intensity={0.75} />
          <directionalLight position={[5, 6, 8]} intensity={1.15} />
          <pointLight position={[-6, -4, 6]} intensity={0.6} color="#6366f1" />
          <group>
            {edges.map((e, i) => {
              const a = byId[e.from], b = byId[e.to];
              if (!a || !b) return null;
              return <Edge key={i} a={a} b={b} status={e.status} />;
            })}
            {nodes.map((n) => <Node key={n.id} node={n} />)}
          </group>
          <OrbitControls
            enablePan={false}
            enableDamping
            dampingFactor={0.12}
            minDistance={6}
            maxDistance={15}
          />
        </Canvas>
      </div>
      {(queue || stack) && (
        <div className="g3-aux">
          <span className="g3-aux-label">{queue ? "Queue" : "Stack"}</span>
          {(queue || stack).map((id, i) => (
            <span key={i} className="g3-chip">{byId[id]?.label ?? id}</span>
          ))}
          {(queue || stack).length === 0 && <span className="g3-chip muted">empty</span>}
        </div>
      )}
    </div>
  );
}
