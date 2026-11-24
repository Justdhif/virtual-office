"use client";

import React from "react";

// Premium Ergonomic Mesh Office Chair (Identical for Workstations & Meeting Table)
export function ErgonomicOfficeChair({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* 5-Star Wheeled Base */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.03, 5]} />
        <meshStandardMaterial color="#020617" metalness={0.9} />
      </mesh>
      {/* Hydraulic Chrome Lift Stem */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.35, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Contoured Seat Cushion */}
      <mesh position={[0, 0.46, 0]} castShadow>
        <boxGeometry args={[0.52, 0.09, 0.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
      {/* Mesh Backrest */}
      <mesh position={[0, 0.82, 0.23]} rotation={[-0.1, 0, 0]} castShadow>
        <boxGeometry args={[0.48, 0.65, 0.06]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      {/* Dual Armrests */}
      <mesh position={[-0.27, 0.62, 0.05]}>
        <boxGeometry args={[0.05, 0.22, 0.3]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0.27, 0.62, 0.05]}>
        <boxGeometry args={[0.05, 0.22, 0.3]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  );
}

// Desk with Dual Monitors, Ergonomic Chair, Lamp, and Coffee Mug
export function Workstation({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  screenGlow = "#06b6d4",
  agentName = "",
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  screenGlow?: string;
  agentName?: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Desk Tabletop (Warm Walnut Finish) */}
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 0.08, 0.95]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.35} />
      </mesh>

      {/* Desk Bevel Edge Strip */}
      <mesh position={[0, 0.72, 0.48]}>
        <boxGeometry args={[1.92, 0.082, 0.02]} />
        <meshStandardMaterial color="#332211" metalness={0.2} />
      </mesh>

      {/* Metal Frame & Cable Trough */}
      <mesh position={[-0.85, 0.36, 0]}>
        <boxGeometry args={[0.08, 0.72, 0.8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.85, 0.36, 0]}>
        <boxGeometry args={[0.08, 0.72, 0.8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.45, -0.38]}>
        <boxGeometry args={[1.6, 0.3, 0.02]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Monitor 1 (Main Curved Wide Screen) */}
      <group position={[-0.28, 0.76, -0.22]}>
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.18, 0.02, 0.16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.22, -0.05]}>
          <cylinderGeometry args={[0.018, 0.022, 0.3]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.72, 0.42, 0.03]} />
          <meshStandardMaterial color="#020617" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.3, 0.016]}>
          <planeGeometry args={[0.68, 0.38]} />
          <meshBasicMaterial color={screenGlow} />
        </mesh>
      </group>

      {/* Monitor 2 (Vertical Code/Document Screen) */}
      <group position={[0.42, 0.76, -0.18]} rotation={[0, -0.25, 0]}>
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.15, 0.02, 0.14]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.24, -0.05]}>
          <cylinderGeometry args={[0.018, 0.022, 0.32]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <boxGeometry args={[0.38, 0.58, 0.03]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
        <mesh position={[0, 0.32, 0.016]}>
          <planeGeometry args={[0.35, 0.55]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Modern Backlit Keyboard & Mousepad */}
      <mesh position={[-0.05, 0.765, 0.18]}>
        <boxGeometry args={[0.7, 0.005, 0.28]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      <mesh position={[-0.1, 0.77, 0.18]}>
        <boxGeometry args={[0.42, 0.01, 0.14]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.18, 0.77, 0.18]}>
        <boxGeometry args={[0.07, 0.015, 0.11]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Ceramic Coffee Mug */}
      <group position={[-0.7, 0.76, 0.15]}>
        <mesh position={[0, 0.06, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.04, 0.1, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
          <meshStandardMaterial color="#3d2314" roughness={0.1} />
        </mesh>
      </group>

      {/* Desk Pen Holder & Sticky Notes */}
      <mesh position={[0.72, 0.81, -0.15]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.1, 16]} />
        <meshStandardMaterial color="#0ea5e9" metalness={0.6} />
      </mesh>
      <mesh position={[0.72, 0.765, 0.1]}>
        <boxGeometry args={[0.08, 0.015, 0.08]} />
        <meshStandardMaterial color="#fef08a" />
      </mesh>

      {/* Waste Basket beside desk */}
      <mesh position={[1.1, 0.2, 0.15]} castShadow>
        <cylinderGeometry args={[0.16, 0.12, 0.38, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Matching Ergonomic Mesh Chair */}
      <ErgonomicOfficeChair position={[0, 0, 0.62]} rotation={[0, 0, 0]} />
    </group>
  );
}

// Slim Modern Aluminum Laptop with Glowing Screen
export function OfficeLaptop({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  screenColor = "#06b6d4",
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  screenColor?: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Base Chassis / Keyboard */}
      <mesh position={[0, 0.008, 0]} castShadow>
        <boxGeometry args={[0.42, 0.016, 0.28]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Keyboard Bed */}
      <mesh position={[0, 0.017, -0.02]}>
        <boxGeometry args={[0.36, 0.003, 0.16]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Trackpad */}
      <mesh position={[0, 0.017, 0.08]}>
        <boxGeometry args={[0.12, 0.002, 0.07]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Screen Lid (Opened at 105 degrees) */}
      <group position={[0, 0.016, -0.14]} rotation={[-0.32, 0, 0]}>
        {/* Back Aluminum Cover */}
        <mesh position={[0, 0.13, 0]} castShadow>
          <boxGeometry args={[0.42, 0.26, 0.012]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Glowing Display */}
        <mesh position={[0, 0.13, 0.008]}>
          <planeGeometry args={[0.39, 0.23]} />
          <meshBasicMaterial color={screenColor} />
        </mesh>
      </group>
    </group>
  );
}

// Conference Table with 8 Dedicated Laptops & 8 Matching Ergonomic Mesh Chairs
export function ConferenceTable({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Heavy Oval Tabletop */}
      <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.09, 2.0]} />
        <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.3} />
      </mesh>
      {/* Center Cable Port / Brass Inset */}
      <mesh position={[0, 0.786, 0]}>
        <boxGeometry args={[2.4, 0.005, 0.35]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.3} />
      </mesh>

      {/* 8 Dedicated Laptops on Table - 1 Exactly in Front of Each Chair & Facing Seated Employees */}
      {/* 1, 2, 3: South Row Laptops (Screen facing South directly into South employees' eyes) */}
      <OfficeLaptop position={[-1.1, 0.785, 0.62]} rotation={[0, 0, 0]} screenColor="#ef4444" />
      <OfficeLaptop position={[0.0, 0.785, 0.62]} rotation={[0, 0, 0]} screenColor="#14b8a6" />
      <OfficeLaptop position={[1.1, 0.785, 0.62]} rotation={[0, 0, 0]} screenColor="#ec4899" />

      {/* 4, 5, 6: North Row Laptops (Screen facing North directly into North employees' eyes) */}
      <OfficeLaptop position={[-1.1, 0.785, -0.62]} rotation={[0, Math.PI, 0]} screenColor="#06b6d4" />
      <OfficeLaptop position={[0.0, 0.785, -0.62]} rotation={[0, Math.PI, 0]} screenColor="#8b5cf6" />
      <OfficeLaptop position={[1.1, 0.785, -0.62]} rotation={[0, Math.PI, 0]} screenColor="#10b981" />

      {/* 7: West Head Laptop (Screen facing West directly into Sarah Adams's eyes) */}
      <OfficeLaptop position={[-1.38, 0.785, 0]} rotation={[0, -Math.PI / 2, 0]} screenColor="#3b82f6" />

      {/* 8: East Head Laptop (Screen facing East directly into Chloe Lin's eyes) */}
      <OfficeLaptop position={[1.38, 0.785, 0]} rotation={[0, Math.PI / 2, 0]} screenColor="#f59e0b" />

      {/* Twin Pillar Table Legs */}
      <mesh position={[-1.2, 0.36, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 0.7, 16]} />
        <meshStandardMaterial color="#020617" metalness={0.9} />
      </mesh>
      <mesh position={[1.2, 0.36, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 0.7, 16]} />
        <meshStandardMaterial color="#020617" metalness={0.9} />
      </mesh>

      {/* 8 Matching Ergonomic Mesh Chairs - All Facing Inward Toward Table */}
      {/* South Side Chairs (Facing North toward table) */}
      {[-1.1, 0, 1.1].map((x, i) => (
        <ErgonomicOfficeChair key={`chair-s-${i}`} position={[x, 0, 1.25]} rotation={[0, 0, 0]} />
      ))}
      {/* North Side Chairs (Facing South toward table) */}
      {[-1.1, 0, 1.1].map((x, i) => (
        <ErgonomicOfficeChair key={`chair-n-${i}`} position={[x, 0, -1.25]} rotation={[0, Math.PI, 0]} />
      ))}
      {/* West Head Chair (Facing East toward table) */}
      <ErgonomicOfficeChair position={[-2.15, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
      {/* East Head Chair (Facing West toward table) */}
      <ErgonomicOfficeChair position={[2.15, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
    </group>
  );
}

// Large Interactive Presentation Smart-Screen on wall
export function PresentationBoard({ position = [0, 0, 0], rotation = [0, 0, 0] }: { position?: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Outer Frame */}
      <mesh position={[0, 2.2, 0]}>
        <boxGeometry args={[3.2, 1.8, 0.08]} />
        <meshStandardMaterial color="#020617" metalness={0.9} />
      </mesh>
      {/* Glowing Screen with Simulated Research Visuals */}
      <mesh position={[0, 2.2, 0.045]}>
        <planeGeometry args={[3.05, 1.65]} />
        <meshStandardMaterial color="#091428" emissive="#0284c7" emissiveIntensity={0.2} />
      </mesh>
      {/* Screen Title Bar */}
      <mesh position={[0, 2.85, 0.05]}>
        <planeGeometry args={[2.8, 0.18]} />
        <meshBasicMaterial color="#0284c7" />
      </mesh>
      {/* Graph Bars simulation */}
      <mesh position={[-0.8, 2.1, 0.05]}>
        <boxGeometry args={[0.25, 0.6, 0.01]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[-0.4, 2.2, 0.05]}>
        <boxGeometry args={[0.25, 0.8, 0.01]} />
        <meshBasicMaterial color="#06b6d4" />
      </mesh>
      <mesh position={[0, 2.35, 0.05]}>
        <boxGeometry args={[0.25, 1.1, 0.01]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>
      <mesh position={[0.4, 2.45, 0.05]}>
        <boxGeometry args={[0.25, 1.3, 0.01]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
      {/* Stand Leg */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 1.4]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.2, 0.06, 0.6]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} />
      </mesh>
    </group>
  );
}

// Pantry / Coffee Station & Water Cooler
export function PantryCoffeeStation({ position = [0, 0, 0], rotation = [0, 0, 0] }: { position?: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Kitchen Counter Cabinet */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.9, 0.8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} />
      </mesh>
      {/* Marble Top */}
      <mesh position={[0, 0.92, 0]}>
        <boxGeometry args={[2.05, 0.05, 0.85]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.1} />
      </mesh>

      {/* Espresso Coffee Machine */}
      <group position={[-0.45, 1.15, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.45, 0.45, 0.35]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.15, 0.18]}>
          <boxGeometry args={[0.3, 0.08, 0.02]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>
        {/* Portafilter */}
        <mesh position={[0, -0.05, 0.18]}>
          <cylinderGeometry args={[0.04, 0.04, 0.06]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
      </group>

      {/* Row of Coffee Mugs */}
      {[-0.05, 0.15, 0.35].map((x, i) => (
        <mesh key={i} position={[x, 0.98, 0.1]} castShadow>
          <cylinderGeometry args={[0.04, 0.035, 0.08, 12]} />
          <meshStandardMaterial color={i === 0 ? "#ef4444" : i === 1 ? "#3b82f6" : "#f59e0b"} />
        </mesh>
      ))}

      {/* Office Water Dispenser Cooler */}
      <group position={[1.4, 0, 0]}>
        {/* Dispenser White Body */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.4, 1.0, 0.4]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        {/* Dispenser Taps (Red & Blue) */}
        <mesh position={[-0.06, 0.65, 0.21]}>
          <boxGeometry args={[0.04, 0.06, 0.04]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0.06, 0.65, 0.21]}>
          <boxGeometry args={[0.04, 0.06, 0.04]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
        {/* Blue 5-Gallon Water Bottle */}
        <mesh position={[0, 1.25, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.45, 16]} />
          <meshPhysicalMaterial color="#38bdf8" transmission={0.7} opacity={0.8} transparent roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

// Breakroom Lounge Sofa & Coffee Table
export function BreakroomLounge({ position = [0, 0, 0], rotation = [0, 0, 0] }: { position?: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* 3-Seater Modern Fabric Sofa */}
      <group position={[0, 0, 0]}>
        {/* Base / Cushion */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[1.8, 0.28, 0.75]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.65, -0.3]} castShadow>
          <boxGeometry args={[1.8, 0.48, 0.18]} />
          <meshStandardMaterial color="#172554" roughness={0.8} />
        </mesh>
        {/* Armrests */}
        <mesh position={[-0.92, 0.45, 0]} castShadow>
          <boxGeometry args={[0.16, 0.4, 0.75]} />
          <meshStandardMaterial color="#172554" />
        </mesh>
        <mesh position={[0.92, 0.45, 0]} castShadow>
          <boxGeometry args={[0.16, 0.4, 0.75]} />
          <meshStandardMaterial color="#172554" />
        </mesh>
      </group>

      {/* Glass Coffee Table with Magazine */}
      <group position={[0, 0, 0.85]}>
        <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.04, 0.55]} />
          <meshPhysicalMaterial color="#94a3b8" transmission={0.9} transparent opacity={0.6} />
        </mesh>
        <mesh position={[-0.45, 0.11, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.22]} />
          <meshStandardMaterial color="#020617" metalness={0.9} />
        </mesh>
        <mesh position={[0.45, 0.11, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.22]} />
          <meshStandardMaterial color="#020617" metalness={0.9} />
        </mesh>
        {/* Journal on table */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.22, 0.015, 0.28]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
      </group>
    </group>
  );
}

// Modern Tall Bookshelf with Academic Literature
export function Bookshelf({ position = [0, 0, 0], rotation = [0, 0, 0] }: { position?: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 2.8, 0.45]} />
        <meshStandardMaterial color="#3e2714" roughness={0.6} />
      </mesh>
      {[0.5, 1.1, 1.7, 2.3].map((y, idx) => (
        <group key={idx} position={[0, y, 0.06]}>
          <mesh position={[-0.45, 0, 0]}>
            <boxGeometry args={[0.26, 0.42, 0.32]} />
            <meshStandardMaterial color={idx % 2 === 0 ? "#0284c7" : "#059669"} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.34, 0.38, 0.32]} />
            <meshStandardMaterial color="#e11d48" />
          </mesh>
          <mesh position={[0.45, 0, 0]}>
            <boxGeometry args={[0.28, 0.44, 0.32]} />
            <meshStandardMaterial color="#d97706" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Lush Indoor Tropical Plant in Ceramic Planter
export function PottedPlant({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.18, 0.7, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow>
        <dodecahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial color="#15803d" roughness={0.5} />
      </mesh>
      <mesh position={[0.15, 1.15, -0.08]} castShadow>
        <dodecahedronGeometry args={[0.28, 1]} />
        <meshStandardMaterial color="#16a34a" roughness={0.5} />
      </mesh>
      <mesh position={[-0.12, 1.25, 0.06]} castShadow>
        <dodecahedronGeometry args={[0.22, 1]} />
        <meshStandardMaterial color="#22c55e" roughness={0.5} />
      </mesh>
    </group>
  );
}

// Comfortable Dormitory Bed with Custom Signature Color Blanket & Bedside Nightstand
export function DormBed({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  blanketColor = "#3b82f6",
  agentName = "",
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  blanketColor?: string;
  agentName?: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Raised Hardwood Bedframe Base */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.05, 0.26, 2.05]} />
        <meshStandardMaterial color="#451a03" roughness={0.65} />
      </mesh>
      {/* Bed Headboard */}
      <mesh position={[0, 0.55, -0.98]} castShadow>
        <boxGeometry args={[1.12, 0.72, 0.1]} />
        <meshStandardMaterial color="#291204" roughness={0.6} />
      </mesh>
      {/* Soft White Mattress */}
      <mesh position={[0, 0.36, 0.04]} castShadow>
        <boxGeometry args={[0.96, 0.18, 1.92]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} />
      </mesh>
      {/* Fluffy Pillow */}
      <mesh position={[0, 0.48, -0.65]} rotation={[0.08, 0, 0]} castShadow>
        <boxGeometry args={[0.62, 0.12, 0.36]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      {/* Signature Folded Duvet Runner at Foot of Bed */}
      <mesh position={[0, 0.47, 0.65]} castShadow>
        <boxGeometry args={[0.98, 0.05, 0.58]} />
        <meshStandardMaterial color={blanketColor} roughness={0.75} />
      </mesh>

      {/* Bedside Nightstand */}
      <group position={[0.74, 0, -0.65]}>
        <mesh position={[0, 0.24, 0]} castShadow>
          <boxGeometry args={[0.4, 0.48, 0.42]} />
          <meshStandardMaterial color="#291204" roughness={0.6} />
        </mesh>
        {/* Nightstand Drawer Handle */}
        <mesh position={[-0.21, 0.28, 0]}>
          <boxGeometry args={[0.02, 0.04, 0.12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
        {/* Soft Bedside Night Lamp */}
        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.06, 16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.14]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.13, 0.15, 0.15, 16]} />
          <meshStandardMaterial
            color="#fef08a"
            roughness={0.3}
            emissive="#fef08a"
            emissiveIntensity={0.6}
            transparent
            opacity={0.9}
          />
        </mesh>
        <pointLight position={[0, 0.72, 0]} intensity={0.4} color="#fef08a" distance={3.2} />
      </group>
    </group>
  );
}

// Dormitory Entertainment & Living Lounge (Large TV, Modular Couch, Coffee Table, Arc Lamp)
export function DormTVLounge({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Wall-Mounted 75" Smart Entertainment TV on North Dorm Wall */}
      <group position={[0, 2.0, -4.2]}>
        {/* TV Outer Bezel */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[3.2, 1.8, 0.08]} />
          <meshStandardMaterial color="#020617" metalness={0.9} />
        </mesh>
        {/* Glowing TV Screen with Vibrant Media Display */}
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[3.06, 1.66]} />
          <meshStandardMaterial color="#0b0f19" emissive="#38bdf8" emissiveIntensity={0.5} />
        </mesh>
        {/* Red Live / Channel Logo Bar */}
        <mesh position={[-1.2, 0.65, 0.05]}>
          <planeGeometry args={[0.4, 0.12]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        {/* Dynamic TV Glow into the room */}
        <pointLight position={[0, 0, 0.8]} intensity={1.2} color="#60a5fa" distance={6} />
      </group>

      {/* Floating Low TV Media Console */}
      <mesh position={[0, 0.28, -4.0]} castShadow>
        <boxGeometry args={[3.4, 0.48, 0.52]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
      {/* Soundbar */}
      <mesh position={[0, 0.55, -4.0]}>
        <boxGeometry args={[1.5, 0.06, 0.12]} />
        <meshStandardMaterial color="#020617" metalness={0.8} />
      </mesh>

      {/* Lounge Area Rug under Couch & Table */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -1.2]} receiveShadow>
        <planeGeometry args={[5.2, 4.2]} />
        <meshStandardMaterial color="#334155" roughness={0.85} />
      </mesh>

      {/* Modern U-Shaped Sectional Lounge Couch (Seats 4-5) */}
      <group position={[0, 0, 0]}>
        {/* Main Central Couch Base */}
        <mesh position={[0, 0.32, 0]} castShadow>
          <boxGeometry args={[2.5, 0.34, 0.88]} />
          <meshStandardMaterial color="#475569" roughness={0.7} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.72, 0.36]} castShadow>
          <boxGeometry args={[2.5, 0.52, 0.2]} />
          <meshStandardMaterial color="#334155" roughness={0.75} />
        </mesh>
        {/* Left Chaise Section */}
        <mesh position={[-1.45, 0.32, -0.6]} castShadow>
          <boxGeometry args={[0.82, 0.34, 2.08]} />
          <meshStandardMaterial color="#475569" roughness={0.7} />
        </mesh>
        <mesh position={[-1.8, 0.72, -0.6]} castShadow>
          <boxGeometry args={[0.2, 0.52, 2.08]} />
          <meshStandardMaterial color="#334155" roughness={0.75} />
        </mesh>
        {/* Right Chaise Section */}
        <mesh position={[1.45, 0.32, -0.6]} castShadow>
          <boxGeometry args={[0.82, 0.34, 2.08]} />
          <meshStandardMaterial color="#475569" roughness={0.7} />
        </mesh>
        <mesh position={[1.8, 0.72, -0.6]} castShadow>
          <boxGeometry args={[0.2, 0.52, 2.08]} />
          <meshStandardMaterial color="#334155" roughness={0.75} />
        </mesh>
      </group>

      {/* Coffee Table in Front of Couch */}
      <group position={[0, 0, -1.6]}>
        <mesh position={[0, 0.28, 0]} castShadow>
          <boxGeometry args={[1.5, 0.08, 0.85]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>
        {/* Metal Legs */}
        <mesh position={[-0.65, 0.14, -0.35]}>
          <cylinderGeometry args={[0.02, 0.02, 0.28]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
        <mesh position={[0.65, 0.14, -0.35]}>
          <cylinderGeometry args={[0.02, 0.02, 0.28]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
        <mesh position={[-0.65, 0.14, 0.35]}>
          <cylinderGeometry args={[0.02, 0.02, 0.28]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
        <mesh position={[0.65, 0.14, 0.35]}>
          <cylinderGeometry args={[0.02, 0.02, 0.28]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
        {/* Snack Bowl & Remote Control */}
        <mesh position={[-0.28, 0.35, 0]}>
          <cylinderGeometry args={[0.11, 0.07, 0.08, 16]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
        <mesh position={[0.25, 0.33, 0.05]}>
          <boxGeometry args={[0.07, 0.015, 0.18]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
      </group>

      {/* Modern Arc Floor Lamp */}
      <group position={[-2.3, 0, 0.2]}>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.04, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>
        <mesh position={[0, 1.1, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 2.2]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
        <mesh position={[0.25, 2.15, 0]} rotation={[0, 0, -0.35]}>
          <cylinderGeometry args={[0.18, 0.24, 0.26, 16]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.6} />
        </mesh>
        <pointLight position={[0.25, 2.1, 0]} intensity={0.7} color="#fef08a" distance={4.5} />
      </group>
    </group>
  );
}

// Dormitory Locker & Personal Wardrobe
export function DormWardrobe({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 2.8, 0.55]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.4, 0.28]}>
        <boxGeometry args={[0.015, 2.7, 0.01]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[-0.08, 1.35, 0.29]}>
        <boxGeometry args={[0.02, 0.24, 0.03]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
      </mesh>
      <mesh position={[0.08, 1.35, 0.29]}>
        <boxGeometry args={[0.02, 0.24, 0.03]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
      </mesh>
    </group>
  );
}

// Dormitory Refreshment & Tea Bar Counter
export function DormRefreshmentBar({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Credenza Cabinet Base */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.9, 0.55]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
      {/* Warm Walnut Wood Countertop */}
      <mesh position={[0, 0.92, 0]} castShadow>
        <boxGeometry args={[1.56, 0.05, 0.6]} />
        <meshStandardMaterial color="#78350f" roughness={0.3} />
      </mesh>
      {/* Electric Kettle */}
      <mesh position={[-0.45, 1.08, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 0.26, 16]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Ceramic Mugs */}
      <mesh position={[-0.15, 0.98, 0.05]}>
        <cylinderGeometry args={[0.045, 0.045, 0.1, 12]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.2} />
      </mesh>
      <mesh position={[0.02, 0.98, -0.05]}>
        <cylinderGeometry args={[0.045, 0.045, 0.1, 12]} />
        <meshStandardMaterial color="#f43f5e" roughness={0.2} />
      </mesh>
      {/* Glass Water Pitcher with Fresh Water */}
      <mesh position={[0.38, 1.1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.32, 16]} />
        <meshPhysicalMaterial color="#38bdf8" transmission={0.9} opacity={0.65} transparent roughness={0.1} />
      </mesh>
      {/* Small Ambient Glow Lamp above bar */}
      <pointLight position={[0, 1.4, 0]} intensity={0.4} color="#fde047" distance={2.5} />
    </group>
  );
}

// Modern Kitchen Counter with Stove, Oven, Range Hood, Sink, and Refrigerator
export function KitchenCounterWithStoveAndSink({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Lower Counter Cabinets */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.9, 0.75]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>
      {/* White Marble Countertop */}
      <mesh position={[0, 0.92, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.25, 0.05, 0.8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} />
      </mesh>

      {/* 4-Burner Glass Induction Cooktop & Oven */}
      <group position={[-1.1, 0, 0]}>
        {/* Cooktop Glass Surface */}
        <mesh position={[0, 0.95, 0]}>
          <boxGeometry args={[0.9, 0.015, 0.55]} />
          <meshStandardMaterial color="#020617" roughness={0.1} />
        </mesh>
        {/* Glowing Induction Burners */}
        {[-0.22, 0.22].map((x, i) =>
          [-0.14, 0.14].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, 0.96, z]}>
              <cylinderGeometry args={[0.09, 0.09, 0.005, 16]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.6} />
            </mesh>
          ))
        )}
        {/* Stainless Steel Range Hood Vent */}
        <mesh position={[0, 2.3, 0]} castShadow>
          <boxGeometry args={[0.95, 0.35, 0.6]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 2.7, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.7, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
        {/* Cooking Pan with Wooden Handle */}
        <mesh position={[-0.22, 0.99, -0.14]}>
          <cylinderGeometry args={[0.11, 0.09, 0.05, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        <mesh position={[-0.22, 1.01, 0.03]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.02, 0.015, 0.16]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
      </group>

      {/* Undermount Double Sink & Gooseneck Chrome Faucet */}
      <group position={[0.7, 0, 0]}>
        {/* Basin Inset */}
        <mesh position={[0, 0.93, 0]}>
          <boxGeometry args={[0.85, 0.02, 0.52]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Double Sink Dividers */}
        <mesh position={[-0.2, 0.88, 0]}>
          <boxGeometry args={[0.36, 0.1, 0.44]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
        <mesh position={[0.2, 0.88, 0]}>
          <boxGeometry args={[0.36, 0.1, 0.44]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
        {/* Gooseneck Faucet */}
        <mesh position={[0, 1.15, -0.22]}>
          <cylinderGeometry args={[0.015, 0.015, 0.35, 12]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0, 1.32, -0.14]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.18, 12]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* Cutting Board & Kitchen Accessories */}
      <mesh position={[-0.15, 0.95, 0.05]}>
        <boxGeometry args={[0.4, 0.02, 0.3]} />
        <meshStandardMaterial color="#b45309" roughness={0.4} />
      </mesh>
      {/* Knife Block */}
      <mesh position={[-0.15, 1.05, -0.24]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.12, 0.18, 0.15]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>

      {/* Large Stainless Steel French-Door Refrigerator */}
      <group position={[2.6, 0, 0.05]}>
        <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.0, 2.3, 0.85]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Fridge Handles */}
        <mesh position={[-0.04, 1.35, 0.44]}>
          <boxGeometry args={[0.02, 0.45, 0.03]} />
          <meshStandardMaterial color="#475569" metalness={0.9} />
        </mesh>
        <mesh position={[0.04, 1.35, 0.44]}>
          <boxGeometry args={[0.02, 0.45, 0.03]} />
          <meshStandardMaterial color="#475569" metalness={0.9} />
        </mesh>
        {/* Water / Ice Dispenser on Left Door */}
        <mesh position={[-0.24, 1.45, 0.435]}>
          <boxGeometry args={[0.18, 0.28, 0.015]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
      </group>
    </group>
  );
}

// Kitchen Dining Table with 6 Chairs, Plates, and Food
export function KitchenDiningTable({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Wooden Dining Table Top */}
      <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.06, 1.2]} />
        <meshStandardMaterial color="#78350f" roughness={0.35} />
      </mesh>
      {/* Table Legs */}
      {[
        [-1.15, 0.37, -0.5],
        [1.15, 0.37, -0.5],
        [-1.15, 0.37, 0.5],
        [1.15, 0.37, 0.5],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.03, 0.03, 0.74, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
      ))}

      {/* Fruit Centerpiece Bowl */}
      <mesh position={[0, 0.81, 0]}>
        <cylinderGeometry args={[0.16, 0.1, 0.08, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.86, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#ef4444" roughness={0.3} />
      </mesh>
      <mesh position={[0.06, 0.86, 0.03]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial color="#eab308" roughness={0.3} />
      </mesh>

      {/* 6 Place Settings with Plates and Mugs */}
      {[-0.75, 0, 0.75].map((x, i) => (
        <group key={`north-${i}`} position={[x, 0.78, -0.38]}>
          <mesh>
            <cylinderGeometry args={[0.12, 0.1, 0.02, 16]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0.16, 0.04, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.07, 12]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
        </group>
      ))}
      {[-0.75, 0, 0.75].map((x, i) => (
        <group key={`south-${i}`} position={[x, 0.78, 0.38]}>
          <mesh>
            <cylinderGeometry args={[0.12, 0.1, 0.02, 16]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0.16, 0.04, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.07, 12]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
        </group>
      ))}

      {/* 6 Dining Chairs */}
      {[-0.75, 0, 0.75].map((x, i) => (
        <group key={`chair-n-${i}`} position={[x, 0, -0.85]} rotation={[0, 0, 0]}>
          <mesh position={[0, 0.44, 0]} castShadow>
            <boxGeometry args={[0.42, 0.05, 0.42]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 0.78, -0.19]} castShadow>
            <boxGeometry args={[0.42, 0.48, 0.04]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          {[-0.18, 0.18].map((cx, k) =>
            [-0.18, 0.18].map((cz, l) => (
              <mesh key={`${k}-${l}`} position={[cx, 0.22, cz]}>
                <cylinderGeometry args={[0.015, 0.015, 0.44]} />
                <meshStandardMaterial color="#475569" metalness={0.8} />
              </mesh>
            ))
          )}
        </group>
      ))}
      {[-0.75, 0, 0.75].map((x, i) => (
        <group key={`chair-s-${i}`} position={[x, 0, 0.85]} rotation={[0, Math.PI, 0]}>
          <mesh position={[0, 0.44, 0]} castShadow>
            <boxGeometry args={[0.42, 0.05, 0.42]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 0.78, -0.19]} castShadow>
            <boxGeometry args={[0.42, 0.48, 0.04]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          {[-0.18, 0.18].map((cx, k) =>
            [-0.18, 0.18].map((cz, l) => (
              <mesh key={`${k}-${l}`} position={[cx, 0.22, cz]}>
                <cylinderGeometry args={[0.015, 0.015, 0.44]} />
                <meshStandardMaterial color="#475569" metalness={0.8} />
              </mesh>
            ))
          )}
        </group>
      ))}

      {/* Overhead Warm Dining Pendant Light */}
      <mesh position={[0, 2.6, 0]}>
        <cylinderGeometry args={[0.26, 0.38, 0.22, 16]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.6} />
      </mesh>
      <pointLight position={[0, 2.5, 0]} intensity={0.8} color="#fef08a" distance={4.5} />
    </group>
  );
}

// Executive Restroom & Bathroom Suite (Vanity, Sink, Mirror, Toilet Cubicle)
export function BathroomRestroom({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Polished White Tile Floor Inset */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]} receiveShadow>
        <planeGeometry args={[4.2, 4.4]} />
        <meshStandardMaterial color="#e0f2fe" roughness={0.15} />
      </mesh>

      {/* Restroom Dividing Partition Walls with Door Opening */}
      <mesh position={[-1.2, 1.4, -2.2]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 2.8, 0.1]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
      <mesh position={[1.2, 1.4, -2.2]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 2.8, 0.1]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
      {/* Lintel above doorway */}
      <mesh position={[0, 2.6, -2.2]}>
        <boxGeometry args={[0.9, 0.4, 0.1]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      {/* Bathroom Vanity Counter with Porcelain Sink */}
      <group position={[-1.1, 0, -0.6]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.86, 0.6]} />
          <meshStandardMaterial color="#334155" roughness={0.3} />
        </mesh>
        {/* White Marble Top */}
        <mesh position={[0, 0.89, 0]}>
          <boxGeometry args={[1.44, 0.04, 0.64]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} />
        </mesh>
        {/* Porcelain Sink Basin */}
        <mesh position={[0, 0.91, 0]}>
          <cylinderGeometry args={[0.22, 0.18, 0.12, 24]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.1} />
        </mesh>
        {/* Chrome Waterfall Faucet */}
        <mesh position={[0, 1.05, -0.18]}>
          <boxGeometry args={[0.04, 0.18, 0.08]} />
          <meshStandardMaterial color="#ffffff" metalness={0.95} roughness={0.05} />
        </mesh>
        {/* Illuminated Vanity Mirror */}
        <mesh position={[0, 1.68, -0.29]}>
          <boxGeometry args={[1.1, 0.95, 0.02]} />
          <meshStandardMaterial color="#bae6fd" roughness={0.05} metalness={0.9} />
        </mesh>
        {/* Soft Backlight for Mirror */}
        <pointLight position={[0, 1.7, -0.1]} intensity={0.5} color="#e0f2fe" distance={2.5} />
        {/* Soap Dispenser */}
        <mesh position={[0.38, 0.98, -0.05]}>
          <cylinderGeometry args={[0.035, 0.035, 0.12, 12]} />
          <meshPhysicalMaterial color="#38bdf8" transmission={0.7} transparent opacity={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Toilet Cubicle Divider (Frosted Glass / Slate Panel) */}
      <mesh position={[0.35, 1.1, 0.5]} castShadow>
        <boxGeometry args={[0.06, 2.2, 2.8]} />
        <meshStandardMaterial color="#64748b" roughness={0.4} />
      </mesh>

      {/* Modern Wall-Hung Toilet */}
      <group position={[1.2, 0, 0.8]}>
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[0.42, 0.42, 0.56]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        {/* Toilet Seat */}
        <mesh position={[0, 0.58, 0.04]} castShadow>
          <cylinderGeometry args={[0.2, 0.19, 0.06, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        {/* Dual-Flush Chrome Plate on Wall */}
        <mesh position={[0, 0.95, -0.27]}>
          <boxGeometry args={[0.2, 0.14, 0.02]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
        {/* Toilet Paper Roll Dispenser */}
        <mesh position={[-0.24, 0.65, 0.1]}>
          <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Hand Towel Holder & Clean Folded Towels */}
      <group position={[-1.75, 1.15, -0.6]}>
        <mesh>
          <cylinderGeometry args={[0.015, 0.015, 0.35, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.22, 0.28, 0.04]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
      </group>
    </group>
  );
}

// Scandinavian Reading Armchair with Ottoman, Reading Lamp & Side Table
export function ReadingLoungeChair({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  fabricColor = "#0284c7",
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  fabricColor?: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Plush Cushion Seat */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <boxGeometry args={[0.82, 0.26, 0.78]} />
        <meshStandardMaterial color={fabricColor} roughness={0.7} />
      </mesh>
      {/* High Curved Backrest */}
      <mesh position={[0, 0.88, -0.32]} rotation={[-0.15, 0, 0]} castShadow>
        <boxGeometry args={[0.8, 0.76, 0.16]} />
        <meshStandardMaterial color={fabricColor} roughness={0.75} />
      </mesh>
      {/* Armrests */}
      <mesh position={[-0.43, 0.55, 0]} castShadow>
        <boxGeometry args={[0.12, 0.32, 0.78]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.43, 0.55, 0]} castShadow>
        <boxGeometry args={[0.12, 0.32, 0.78]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Tapered Wood Legs */}
      {[
        [-0.34, 0.13, -0.3],
        [0.34, 0.13, -0.3],
        [-0.34, 0.13, 0.3],
        [0.34, 0.13, 0.3],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[0.08, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.015, 0.26, 12]} />
          <meshStandardMaterial color="#78350f" roughness={0.4} />
        </mesh>
      ))}

      {/* Side End Table with Open Book & Tea */}
      <group position={[0.72, 0, 0.1]}>
        <mesh position={[0, 0.44, 0]} castShadow>
          <cylinderGeometry args={[0.26, 0.26, 0.04, 24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.44]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
        {/* Open Academic Hardcover Book */}
        <mesh position={[0, 0.47, 0]} rotation={[0, 0.4, 0]}>
          <boxGeometry args={[0.24, 0.025, 0.18]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        {/* Tea Cup */}
        <mesh position={[0.12, 0.49, -0.08]}>
          <cylinderGeometry args={[0.04, 0.03, 0.06, 12]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
      </group>

      {/* Warm Arc Reading Floor Lamp */}
      <group position={[-0.75, 0, -0.2]}>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.03, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 1.9]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
        <mesh position={[0.2, 1.85, 0]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.12, 0.18, 0.18, 16]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.5} />
        </mesh>
        <pointLight position={[0.2, 1.8, 0]} intensity={0.5} color="#fef08a" distance={3.2} />
      </group>
    </group>
  );
}

// Academic Library Study Table with Stacks of Books & Banker's Lamp
export function LibraryStudyTable({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Walnut Study Desk */}
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.06, 1.0]} />
        <meshStandardMaterial color="#451a03" roughness={0.4} />
      </mesh>
      {/* Desk Frame Legs */}
      {[
        [-1.0, 0.36, -0.42],
        [1.0, 0.36, -0.42],
        [-1.0, 0.36, 0.42],
        [1.0, 0.36, 0.42],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.025, 0.025, 0.72, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
      ))}

      {/* Classic Green Glass Banker's Lamps */}
      {[-0.5, 0.5].map((x, i) => (
        <group key={`lamp-${i}`} position={[x, 0.75, 0]}>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.07, 0.08, 0.03, 16]} />
            <meshStandardMaterial color="#d97706" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.32]} />
            <meshStandardMaterial color="#d97706" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.06, 0.18, 16]} />
            <meshStandardMaterial color="#059669" roughness={0.2} emissive="#10b981" emissiveIntensity={0.5} />
          </mesh>
          <pointLight position={[0, 0.3, 0]} intensity={0.5} color="#6ee7b7" distance={2.5} />
        </group>
      ))}

      {/* Stacks of Academic Books */}
      <group position={[-0.8, 0.75, 0.1]}>
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[0.22, 0.05, 0.3]} />
          <meshStandardMaterial color="#1e3a8a" />
        </mesh>
        <mesh position={[0.02, 0.08, 0]} rotation={[0, 0.1, 0]}>
          <boxGeometry args={[0.2, 0.045, 0.28]} />
          <meshStandardMaterial color="#831843" />
        </mesh>
        <mesh position={[-0.01, 0.12, 0.01]} rotation={[0, -0.15, 0]}>
          <boxGeometry args={[0.19, 0.04, 0.26]} />
          <meshStandardMaterial color="#065f46" />
        </mesh>
      </group>

      {/* Two Study Chairs */}
      <group position={[-0.5, 0, 0.7]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0.44, 0]} castShadow>
          <boxGeometry args={[0.42, 0.05, 0.42]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 0.78, -0.19]} castShadow>
          <boxGeometry args={[0.42, 0.48, 0.04]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>
      <group position={[0.5, 0, 0.7]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0.44, 0]} castShadow>
          <boxGeometry args={[0.42, 0.05, 0.42]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 0.78, -0.19]} castShadow>
          <boxGeometry args={[0.42, 0.48, 0.04]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>
    </group>
  );
}
