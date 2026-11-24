"use client";

import React from "react";
import {
  Workstation,
  Bookshelf,
  ConferenceTable,
  PottedPlant,
  PantryCoffeeStation,
  BreakroomLounge,
  PresentationBoard,
  DormBed,
  DormTVLounge,
  DormWardrobe,
  DormRefreshmentBar,
  KitchenCounterWithStoveAndSink,
  KitchenDiningTable,
  BathroomRestroom,
  ReadingLoungeChair,
  LibraryStudyTable,
} from "./Furniture";
import { Html } from "@react-three/drei";

function RoomSign({ text, position }: { text: string; position: [number, number, number] }) {
  return (
    <group position={position}>
      <Html position={[0, 0, 0]} center distanceFactor={16} zIndexRange={[10, 0]}>
        <div
          className="px-3 py-1 rounded-lg text-[8px] font-bold tracking-widest uppercase whitespace-nowrap pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(2,6,23,0.95) 0%, rgba(15,23,42,0.9) 100%)",
            border: "1px solid rgba(34,211,238,0.3)",
            color: "#22d3ee",
            backdropFilter: "blur(12px)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4), 0 0 12px rgba(34,211,238,0.1)",
            letterSpacing: "0.12em",
          }}
        >
          {text}
        </div>
      </Html>
    </group>
  );
}

export function OfficeEnvironment() {
  return (
    <group>
      {/* ======================================================== */}
      {/* 1. FLOORING & BRIGHT SCANDINAVIAN HARDWOOD               */}
      {/* ======================================================== */}
      {/* Foundation Baseboard Slab */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[26, 22]} />
        <meshStandardMaterial color="#0a0e1a" roughness={0.9} />
      </mesh>

      {/* Main Floor: Bright Scandinavian Natural Blonde Oak Parquet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[24, 20]} />
        <meshStandardMaterial color="#1a1f2e" roughness={0.15} metalness={0.3} />
      </mesh>

      {/* Center Walkway Corridors (Clean Light Stone / Terrazzo Tile) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow>
        <planeGeometry args={[3.2, 20]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.4} />
      </mesh>
      {/* North Corridor & South Corridor Walkways */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, -2.8]} receiveShadow>
        <planeGeometry args={[24, 2.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 2.8]} receiveShadow>
        <planeGeometry args={[24, 2.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.4} />
      </mesh>

      {/* Conference Room Area Rug (Plush Navy / Indigo) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]} receiveShadow>
        <circleGeometry args={[2.9, 32]} />
        <meshStandardMaterial color="#0c1a4a" roughness={0.8} />
      </mesh>

      {/* Director Executive Suite Rug (Sage Forest Green) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-6.8, 0.005, -5.2]} receiveShadow>
        <planeGeometry args={[5.2, 4.4]} />
        <meshStandardMaterial color="#071a0e" roughness={0.85} />
      </mesh>

      {/* Academic Reading & Library Lounge Flooring (Warm Walnut Parquet & Emerald Rug) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7.8, 0.005, -6.5]} receiveShadow>
        <planeGeometry args={[6.8, 5.8]} />
        <meshStandardMaterial color="#1a0a00" roughness={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7.8, 0.007, -6.5]} receiveShadow>
        <planeGeometry args={[4.5, 3.8]} />
        <meshStandardMaterial color="#064e3b" roughness={0.8} />
      </mesh>

      {/* West Wing Foundation: Communal Kitchen & Restroom Suite Floor */}
      {/* Kitchen & Dining Floor (Polished Slate Gray Tile) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-17.75, -0.01, -2.9]} receiveShadow>
        <planeGeometry args={[11.5, 12.2]} />
        <meshStandardMaterial color="#0d1117" roughness={0.08} metalness={0.2} />
      </mesh>
      {/* Restroom Floor (Polished Sky Blue Tile) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-17.75, -0.01, 6.1]} receiveShadow>
        <planeGeometry args={[11.5, 5.8]} />
        <meshStandardMaterial color="#e0f2fe" roughness={0.15} />
      </mesh>
      {/* Connecting Hallway Walkway from Office Corridor to Kitchen */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-14.0, 0.002, 0]} receiveShadow>
        <planeGeometry args={[4.0, 2.8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.4} />
      </mesh>

      {/* Dormitory Suite Foundation & Luxury Warm Oak Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[17.75, -0.01, 0]} receiveShadow>
        <planeGeometry args={[11.5, 18.0]} />
        <meshStandardMaterial color="#1a1208" roughness={0.3} metalness={0.05} />
      </mesh>
      {/* Connecting Hallway Walkway from Office Corridor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[14.0, 0.002, 0]} receiveShadow>
        <planeGeometry args={[4.0, 2.8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.4} />
      </mesh>

      {/* ======================================================== */}
      {/* 2. BRIGHT WALLS & DAYLIGHT PANORAMIC WINDOWS             */}
      {/* ======================================================== */}
      {/* North Wall with Bright Daylight Windows */}
      <mesh position={[0, 1.8, -10]} receiveShadow>
        <boxGeometry args={[24, 3.6, 0.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} />
      </mesh>

      {/* Baseboard trim along North wall */}
      <mesh position={[0, 0.15, -9.88]}>
        <boxGeometry args={[24, 0.3, 0.04]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Panoramic Windows with Sky View & Sunlight */}
      {[-7, -3, 3, 7].map((x, idx) => (
        <group key={`win-${idx}`} position={[x, 2.0, -9.88]}>
          {/* Glass Pane looking at sky */}
          <mesh>
            <planeGeometry args={[2.6, 2.2]} />
            <meshBasicMaterial color="#1e3a8a" />
          </mesh>
          {/* Frame */}
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[2.7, 0.06, 0.02]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[0.06, 2.3, 0.02]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
        </group>
      ))}

      {/* West Partition Wall with Open Corridor Doorway to Communal Kitchen & Restroom */}
      {/* North Section of West Wall */}
      <mesh position={[-12, 1.8, -5.8]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[8.4, 3.6, 0.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} />
      </mesh>
      {/* South Section of West Wall */}
      <mesh position={[-12, 1.8, 5.8]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[8.4, 3.6, 0.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} />
      </mesh>
      {/* Top Header Beam Above West Doorway */}
      <mesh position={[-12, 3.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[3.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Doorway Frame Trims */}
      <mesh position={[-12, 1.4, -1.6]}>
        <boxGeometry args={[0.22, 2.8, 0.08]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      <mesh position={[-12, 1.4, 1.6]}>
        <boxGeometry args={[0.22, 2.8, 0.08]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      {/* Room Sign for Communal Kitchen Suite */}
      <RoomSign text="COMMUNAL KITCHEN & RESTROOM" position={[-12, 2.65, 0]} />

      {/* ======================================================== */}
      {/* COMMUNAL KITCHEN & RESTROOM SUITE OUTER WALLS & WINDOWS  */}
      {/* ======================================================== */}
      {/* North Wall of Kitchen */}
      <mesh position={[-17.75, 1.8, -9.0]} receiveShadow>
        <boxGeometry args={[11.5, 3.6, 0.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} />
      </mesh>
      {/* South Wall of Restroom */}
      <mesh position={[-17.75, 1.8, 9.0]} receiveShadow>
        <boxGeometry args={[11.5, 3.6, 0.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} />
      </mesh>
      {/* West Outer Wall of Kitchen & Restroom */}
      <mesh position={[-23.5, 1.8, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[18.0, 3.6, 0.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} />
      </mesh>
      {/* Panoramic Scenic Windows on West Wall */}
      {[-5.0, 5.0].map((z, idx) => (
        <group key={`kitchen-win-${idx}`} position={[-23.38, 2.0, z]} rotation={[0, Math.PI / 2, 0]}>
          <mesh>
            <planeGeometry args={[2.8, 2.0]} />
            <meshBasicMaterial color="#1e3a8a" />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[2.9, 0.06, 0.02]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[0.06, 2.1, 0.02]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
        </group>
      ))}

      {/* Dividing Wall separating Kitchen and Restroom at Z = 3.2 */}
      <mesh position={[-20.2, 1.8, 3.2]} receiveShadow>
        <boxGeometry args={[6.6, 3.6, 0.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} />
      </mesh>
      <mesh position={[-13.5, 1.8, 3.2]} receiveShadow>
        <boxGeometry args={[3.0, 3.6, 0.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} />
      </mesh>
      {/* Restroom Doorway Header Beam */}
      <mesh position={[-15.9, 3.2, 3.2]}>
        <boxGeometry args={[1.8, 0.8, 0.2]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Restroom Door Sign */}
      <RoomSign text="RESTROOM & WASHROOM" position={[-15.9, 2.65, 3.2]} />

      {/* East Partition Wall with Open Corridor Doorway to Dormitory */}
      {/* North Section of East Wall */}
      <mesh position={[12, 1.8, -5.8]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[8.4, 3.6, 0.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} />
      </mesh>
      {/* South Section of East Wall */}
      <mesh position={[12, 1.8, 5.8]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[8.4, 3.6, 0.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} />
      </mesh>
      {/* Top Header Beam Above Doorway */}
      <mesh position={[12, 3.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[3.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Doorway Frame Trims */}
      <mesh position={[12, 1.4, -1.6]}>
        <boxGeometry args={[0.22, 2.8, 0.08]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      <mesh position={[12, 1.4, 1.6]}>
        <boxGeometry args={[0.22, 2.8, 0.08]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      {/* Room Sign for Dormitory Suite */}
      <RoomSign text="STAFF DORMITORY & REST SUITE" position={[12, 2.65, 0]} />

      {/* ======================================================== */}
      {/* DORMITORY SUITE OUTER WALLS & WINDOWS                     */}
      {/* ======================================================== */}
      {/* North Wall of Dormitory */}
      <mesh position={[17.75, 1.8, -9.0]} receiveShadow>
        <boxGeometry args={[11.5, 3.6, 0.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} />
      </mesh>
      {/* South Wall of Dormitory */}
      <mesh position={[17.75, 1.8, 9.0]} receiveShadow>
        <boxGeometry args={[11.5, 3.6, 0.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} />
      </mesh>
      {/* East Outer Wall of Dormitory */}
      <mesh position={[23.5, 1.8, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[18.0, 3.6, 0.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} />
      </mesh>
      {/* Panoramic Scenic Windows on East Wall */}
      {[-5.0, 5.0].map((z, idx) => (
        <group key={`dorm-win-${idx}`} position={[23.38, 2.0, z]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh>
            <planeGeometry args={[2.8, 2.0]} />
            <meshBasicMaterial color="#1e3a8a" />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[2.9, 0.06, 0.02]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[0.06, 2.1, 0.02]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
        </group>
      ))}

      {/* ======================================================== */}
      {/* 3. ARCHITECTURAL TEMPERED GLASS PARTITIONS               */}
      {/* ======================================================== */}
      {/* Partition: Director Suite (North-West) */}
      <group position={[-4.2, 1.1, -6.5]}>
        <mesh>
          <boxGeometry args={[0.08, 2.2, 5.5]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            transmission={0.92}
            opacity={0.45}
            transparent
            roughness={0.1}
            emissive="#38bdf8"
            emissiveIntensity={0.02}
          />
        </mesh>
        <mesh position={[0, -1.05, 0]}>
          <boxGeometry args={[0.12, 0.1, 5.5]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>
      </group>
      <RoomSign text="DIRECTOR EXECUTIVE SUITE" position={[-6.8, 2.7, -4.0]} />

      {/* Partition: Pantry / Breakroom (North-East) */}
      <group position={[4.2, 1.1, -6.5]}>
        <mesh>
          <boxGeometry args={[0.08, 2.2, 5.5]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            transmission={0.92}
            opacity={0.45}
            transparent
            roughness={0.1}
            emissive="#38bdf8"
            emissiveIntensity={0.02}
          />
        </mesh>
        <mesh position={[0, -1.05, 0]}>
          <boxGeometry args={[0.12, 0.1, 5.5]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>
      </group>
      <RoomSign text="ACADEMIC READING & LIBRARY LOUNGE" position={[6.8, 2.7, -4.0]} />

      {/* Partition: Research Lab (South-West) */}
      <group position={[-4.2, 1.1, 6.5]}>
        <mesh>
          <boxGeometry args={[0.08, 2.2, 5.5]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            transmission={0.92}
            opacity={0.45}
            transparent
            roughness={0.1}
            emissive="#38bdf8"
            emissiveIntensity={0.02}
          />
        </mesh>
        <mesh position={[0, -1.05, 0]}>
          <boxGeometry args={[0.12, 0.1, 5.5]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>
      </group>
      <RoomSign text="RESEARCH & LITERATURE LAB" position={[-6.8, 2.7, 4.0]} />

      {/* Partition: Writing & Quality Wing (South-East) */}
      <group position={[4.2, 1.1, 6.5]}>
        <mesh>
          <boxGeometry args={[0.08, 2.2, 5.5]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            transmission={0.92}
            opacity={0.45}
            transparent
            roughness={0.1}
            emissive="#38bdf8"
            emissiveIntensity={0.02}
          />
        </mesh>
        <mesh position={[0, -1.05, 0]}>
          <boxGeometry args={[0.12, 0.1, 5.5]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>
      </group>
      <RoomSign text="ACADEMIC WRITING & QC STUDIO" position={[6.8, 2.7, 4.0]} />

      <RoomSign text="CENTRAL CONFERENCE & COLLABORATION" position={[0, 2.7, -1.8]} />

      {/* ======================================================== */}
      {/* 4. WORKSTATIONS & FURNITURE                              */}
      {/* ======================================================== */}
      {/* 1. Project Manager Desk (Director Executive Suite) */}
      <Workstation position={[-6.8, 0, -6.0]} rotation={[0, 0, 0]} screenGlow="#0284c7" agentName="Sarah Adams" />

      {/* Large Smart Presentation Screen - Moved to Sarah Adams's Executive Suite */}
      <PresentationBoard position={[-6.8, 0, -9.6]} rotation={[0, 0, 0]} />

      {/* 2 & 3. Research Department Desks */}
      <Workstation position={[-8.0, 0, 6.0]} rotation={[0, Math.PI, 0]} screenGlow="#0891b2" agentName="Alex Rivera" />
      <Workstation position={[-5.2, 0, 6.0]} rotation={[0, Math.PI, 0]} screenGlow="#7c3aed" agentName="Elena Rostova" />

      {/* 4 & 5. Writing Department Desks */}
      <Workstation position={[5.2, 0, 6.0]} rotation={[0, Math.PI, 0]} screenGlow="#059669" agentName="Marcus Vance" />
      <Workstation position={[8.0, 0, 6.0]} rotation={[0, Math.PI, 0]} screenGlow="#d97706" agentName="Chloe Lin" />

      {/* 6. Data Analysis Desk */}
      <Workstation position={[0, 0, 6.0]} rotation={[0, Math.PI, 0]} screenGlow="#db2777" agentName="Liam Thorne" />

      {/* 7 & 8. Quality Control Workstations (North-Center) */}
      <Workstation position={[-1.6, 0, -6.5]} rotation={[0, 0, 0]} screenGlow="#e11d48" agentName="Beatrice Ramos" />
      <Workstation position={[1.6, 0, -6.5]} rotation={[0, 0, 0]} screenGlow="#0d9488" agentName="David Miller" />

      {/* Central Meeting Area with 8 Dedicated Laptops & 8 All-Inward Facing Chairs */}
      <ConferenceTable position={[0, 0, 0]} />

      {/* ======================================================== */}
      {/* 5. ACADEMIC READING & LIBRARY LOUNGE                     */}
      {/* ======================================================== */}
      {/* Study Table with Stacks of Books & Banker's Lamps */}
      <LibraryStudyTable position={[7.8, 0, -7.2]} rotation={[0, 0, 0]} />

      {/* Scandinavian Reading Lounge Armchairs */}
      <ReadingLoungeChair position={[5.8, 0, -4.8]} rotation={[0, 0.45, 0]} fabricColor="#0284c7" />
      <ReadingLoungeChair position={[9.8, 0, -4.8]} rotation={[0, -0.45, 0]} fabricColor="#d97706" />

      {/* Additional Library Bookshelf */}
      <Bookshelf position={[11.2, 0, -6.5]} rotation={[0, -Math.PI / 2, 0]} />

      {/* ======================================================== */}
      {/* 6. COMMUNAL KITCHEN & DINING HALL                        */}
      {/* ======================================================== */}
      {/* Chef's Kitchen Counter with Induction Stove, Sink, Oven & Refrigerator */}
      <KitchenCounterWithStoveAndSink position={[-17.8, 0, -8.2]} rotation={[0, 0, 0]} />

      {/* Communal Dining Table (Seats 6) with Plates and Fruit Bowl */}
      <KitchenDiningTable position={[-17.5, 0, -3.8]} rotation={[0, 0, 0]} />

      {/* Moved Breakroom Lounge Sofa & Coffee Table in Kitchen */}
      <BreakroomLounge position={[-15.0, 0, -0.2]} rotation={[0, -Math.PI / 2, 0]} />

      {/* Moved Pantry Coffee Station & Water Cooler in Kitchen */}
      <PantryCoffeeStation position={[-21.5, 0, -0.2]} rotation={[0, Math.PI / 2, 0]} />

      {/* Kitchen Room Sign */}
      <RoomSign text="COMMUNAL KITCHEN & DINING HALL" position={[-17.5, 2.7, -4.8]} />

      {/* ======================================================== */}
      {/* 7. EXECUTIVE RESTROOM & WASHROOM                         */}
      {/* ======================================================== */}
      <BathroomRestroom position={[-17.8, 0, 6.2]} rotation={[0, 0, 0]} />

      {/* Academic Bookshelves against outer walls */}
      <Bookshelf position={[-11.2, 0, 6.0]} rotation={[0, Math.PI / 2, 0]} />
      <Bookshelf position={[-11.2, 0, -6.0]} rotation={[0, Math.PI / 2, 0]} />
      <Bookshelf position={[11.2, 0, 6.0]} rotation={[0, -Math.PI / 2, 0]} />

      {/* Potted Indoor Plants moved to non-blocking perimeter corners */}
      <PottedPlant position={[-11.0, 0, -9.0]} />
      <PottedPlant position={[11.0, 0, -9.0]} />
      <PottedPlant position={[-11.0, 0, 9.0]} />
      <PottedPlant position={[11.0, 0, 9.0]} />
      <PottedPlant position={[-11.0, 0, 3.2]} />
      <PottedPlant position={[11.0, 0, 3.2]} />
      <PottedPlant position={[-4.2, 0, -3.8]} />
      <PottedPlant position={[4.2, 0, -3.8]} />

      {/* ======================================================== */}
      {/* 5. STAFF DORMITORY & REST SUITE INTERIOR                 */}
      {/* ======================================================== */}
      {/* TV Entertainment & Living Lounge */}
      <DormTVLounge position={[17.5, 0, -4.5]} />

      {/* Wardrobe Lockers at North-West of Dormitory */}
      <DormWardrobe position={[13.2, 0, -7.2]} rotation={[0, Math.PI / 2, 0]} />

      {/* Mini Tea & Refreshment Bar Counter */}
      <DormRefreshmentBar position={[13.2, 0, -3.8]} rotation={[0, Math.PI / 2, 0]} />

      {/* 8 Dedicated Platform Beds for Karyawan */}
      {/* East Row Beds (Facing West) */}
      <DormBed position={[21.4, 0, 1.5]} rotation={[0, -Math.PI / 2, 0]} blanketColor="#3b82f6" agentName="Sarah Adams" />
      <DormBed position={[21.4, 0, 3.5]} rotation={[0, -Math.PI / 2, 0]} blanketColor="#06b6d4" agentName="Alex Rivera" />
      <DormBed position={[21.4, 0, 5.5]} rotation={[0, -Math.PI / 2, 0]} blanketColor="#8b5cf6" agentName="Elena Rostova" />
      <DormBed position={[21.4, 0, 7.5]} rotation={[0, -Math.PI / 2, 0]} blanketColor="#10b981" agentName="Marcus Vance" />

      {/* West Row Beds (Facing East) */}
      <DormBed position={[14.4, 0, 1.5]} rotation={[0, Math.PI / 2, 0]} blanketColor="#f59e0b" agentName="Chloe Lin" />
      <DormBed position={[14.4, 0, 3.5]} rotation={[0, Math.PI / 2, 0]} blanketColor="#ec4899" agentName="Liam Thorne" />
      <DormBed position={[14.4, 0, 5.5]} rotation={[0, Math.PI / 2, 0]} blanketColor="#14b8a6" agentName="David Miller" />
      <DormBed position={[14.4, 0, 7.5]} rotation={[0, Math.PI / 2, 0]} blanketColor="#ef4444" agentName="Beatrice Ramos" />

      {/* Plush Center Runner Rug between Beds */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[17.9, 0.008, 4.5]} receiveShadow>
        <planeGeometry args={[2.6, 7.5]} />
        <meshStandardMaterial color="#334155" roughness={0.85} />
      </mesh>

      {/* Dormitory Indoor Corner Plants */}
      <PottedPlant position={[22.2, 0, -7.8]} />
      <PottedPlant position={[22.2, 0, 7.8]} />
      <PottedPlant position={[13.2, 0, 7.8]} />
    </group>
  );
}
