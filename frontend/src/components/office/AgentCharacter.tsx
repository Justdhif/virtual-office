"use client";

import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { AgentVisual } from "@/types";
import { useOfficeStore } from "@/store/useOfficeStore";

const AGENT_QUOTES: Record<string, string[]> = {
  project_manager: [
    "Menunggu instruksi riset baru dari Director 📋",
    "Semua divisi AI siap berkolaborasi.",
    "Progres penulisan berjalan sesuai rencana.",
    "Bisa diskusi sebentar di meeting room? ☕",
  ],
  researcher: [
    "OpenAlex punya metadata 250M+ jurnal ilmiah 🔬",
    "Sedang mengecek publikasi terbaru 5 tahun terakhir.",
    "DOI jurnal ini sudah terverifikasi valid!",
    "Banyak artikel open-access yang relevan.",
  ],
  literature_analyst: [
    "Menemukan research gap yang sangat menjanjikan 📚",
    "Sedang menyusun matriks komparasi teori.",
    "Studi terdahulu belum membahas variabel ini.",
    "Landasan teorinya sudah cukup kokoh.",
  ],
  academic_writer: [
    "Transisi antar-paragraf harus tetap kohesif ✍️",
    "Draf Bab 1 sedang dirapikan.",
    "Menggunakan bahasa akademik formal standar.",
    "Menambahkan argumen penguat di Bab 2.",
  ],
  citation_specialist: [
    "Format sitasi APA 7th sudah sesuai pedoman 🔖",
    "Memastikan tidak ada sitasi tanpa DOI resmi.",
    "Semua in-text citation cocok dengan daftar pustaka.",
    "Daftar pustaka tersusun secara alfabetis.",
  ],
  data_analyst: [
    "Data sampel kuesioner berdistribusi normal 📊",
    "Sedang menghitung koefisien korelasi.",
    "Visualisasi chart akan memudahkan pembaca.",
    "Saya ambil kopi dulu di pantry ya ☕",
  ],
  academic_editor: [
    "Tata bahasa dan pemilihan diksi sudah dipoles 📝",
    "Menghilangkan kalimat yang berbelit-belit.",
    "Konsistensi istilah akademik sudah terjaga.",
    "Keterbacaan teks sekarang jauh lebih enak.",
  ],
  quality_reviewer: [
    "Semua klaim wajib memiliki rujukan ilmiah yang sah ⚖️",
    "Melakukan simulasi peer-review yang ketat.",
    "Metodologinya sudah konsisten dan dapat direplikasi.",
    "Kualitas draf siap dilaporkan ke Director.",
  ],
};

const MEETING_QUOTES: Record<string, string[]> = {
  project_manager: [
    "Selamat datang di rapat koordinasi tim riset!",
    "Mari kita review milestone masing-masing divisi.",
  ],
  researcher: [
    "Literatur OpenAlex & Crossref sudah siap diverifikasi.",
    "Ada 5 paper bereputasi tinggi yang sangat relevan.",
  ],
  literature_analyst: [
    "Matriks komparasi teori sudah saya susun.",
    "Research gap di penelitian ini sangat solid.",
  ],
  academic_writer: [
    "Draf Bab 1 dan tinjauan pustaka siap dikerjakan.",
    "Struktur argumen akademik sudah terarah.",
  ],
  citation_specialist: [
    "Daftar pustaka APA 7th siap kami format.",
    "Semua rujukan akan diverifikasi DOI resminya.",
  ],
  data_analyst: [
    "Model regresi dan korelasi siap diuji.",
    "Visualisasi data akan mendukung pembahasan.",
  ],
  academic_editor: [
    "Format dan keterbacaan akan kami poles maksimal.",
    "Konsistensi istilah akademik akan dijaga.",
  ],
  quality_reviewer: [
    "Audit integritas akademik siap kami kawal.",
    "Klaim tanpa rujukan akan kami eliminasi.",
  ],
};



// Exact chair coordinates for 8 agents around the conference table (All facing inward to table)
const MEETING_SEATS: Record<string, { pos: [number, number, number]; rotY: number }> = {
  project_manager: { pos: [-2.15, 0, 0], rotY: Math.PI / 2 },      // West head (faces East into table)
  researcher: { pos: [-1.1, 0, -1.25], rotY: 0 },                  // North-West (faces South into table)
  literature_analyst: { pos: [0, 0, -1.25], rotY: 0 },             // North-Center (faces South into table)
  academic_writer: { pos: [1.1, 0, -1.25], rotY: 0 },              // North-East (faces South into table)
  citation_specialist: { pos: [2.15, 0, 0], rotY: -Math.PI / 2 },   // East head (faces West into table)
  data_analyst: { pos: [1.1, 0, 1.25], rotY: Math.PI },            // South-East (faces North into table)
  academic_editor: { pos: [0, 0, 1.25], rotY: Math.PI },           // South-Center (faces North into table)
  quality_reviewer: { pos: [-1.1, 0, 1.25], rotY: Math.PI },       // South-West (faces North into table)
};



// Destination coordinates for idle wandering during Jam Kerja
const IDLE_DESTINATIONS: Record<string, [number, number, number][]> = {
  project_manager: [
    [-6.8, 0, -5.38],
    [-2.15, 0, 0],
    [6.0, 0, -5.4],
  ],
  researcher: [
    [-8.0, 0, 5.38],
    [-9.6, 0, 5.6],
    [6.0, 0, -5.4],
    [-1.1, 0, -1.25],
  ],
  literature_analyst: [
    [-5.2, 0, 5.38],
    [-9.6, 0, 5.6],
    [0, 0, -1.25],
    [8.3, 0, -4.5],
  ],
  academic_writer: [
    [5.2, 0, 5.38],
    [9.6, 0, 5.6],
    [1.1, 0, -1.25],
    [6.0, 0, -5.4],
  ],
  citation_specialist: [
    [8.0, 0, 5.38],
    [9.6, 0, 5.6],
    [7.8, 0, -5.4],
    [2.15, 0, 0],
  ],
  data_analyst: [
    [0, 0, 5.38],
    [6.0, 0, -5.4],
    [8.3, 0, -4.5],
    [1.1, 0, 1.25],
  ],
  academic_editor: [
    [1.6, 0, -5.88],
    [6.0, 0, -5.4],
    [0, 0, 1.25],
    [9.6, 0, 5.6],
  ],
  quality_reviewer: [
    [-1.6, 0, -5.88],
    [-6.8, 0, -4.2],
    [-1.1, 0, 1.25],
    [7.8, 0, -5.4],
  ],
};

// Generates an obstacle-free corridor route between start and destination
// Supporting transit across West Wing (Kitchen/Restroom), Central Office, and East Wing (Dormitory)
function generateWalkPath(
  start: [number, number, number],
  dest: [number, number, number]
): [number, number, number][] {
  const waypoints: [number, number, number][] = [];
  const startX = start[0], startZ = start[2];
  const destX = dest[0], destZ = dest[2];

  const isStartInDorm = startX > 12.2;
  const isDestInDorm = destX > 12.2;
  const isStartInWest = startX < -12.2;
  const isDestInWest = destX < -12.2;

  // CASE 1: Moving within West Wing (Kitchen & Restroom)
  if (isStartInWest && isDestInWest) {
    const startInRestroom = startZ > 3.2;
    const destInRestroom = destZ > 3.2;
    if (startInRestroom !== destInRestroom) {
      waypoints.push([-17.5, 0, startZ]);
      waypoints.push([-15.9, 0, startZ]);
      waypoints.push([-15.9, 0, 3.2]);
      waypoints.push([-17.5, 0, destZ]);
      waypoints.push([destX, 0, destZ]);
      return waypoints;
    }
    waypoints.push([-17.5, 0, startZ]);
    waypoints.push([-17.5, 0, destZ]);
    waypoints.push([destX, 0, destZ]);
    return waypoints;
  }

  // CASE 2: Moving within Dormitory
  if (isStartInDorm && isDestInDorm) {
    waypoints.push([17.5, 0, startZ]);
    waypoints.push([17.5, 0, destZ]);
    waypoints.push([destX, 0, destZ]);
    return waypoints;
  }

  // Intermediate node exiting origin wing into Office
  let officeEntryX = startX;
  let officeEntryZ = startZ;

  if (isStartInWest) {
    if (startZ > 3.2) {
      waypoints.push([-15.9, 0, startZ]);
      waypoints.push([-15.9, 0, 3.2]);
    }
    waypoints.push([-17.5, 0, 0]);
    waypoints.push([-13.8, 0, 0]);
    waypoints.push([-10.5, 0, 0]);
    officeEntryX = -10.5;
    officeEntryZ = 0;
  } else if (isStartInDorm) {
    waypoints.push([17.5, 0, startZ]);
    waypoints.push([17.5, 0, 0]);
    waypoints.push([13.8, 0, 0]);
    waypoints.push([10.5, 0, 0]);
    officeEntryX = 10.5;
    officeEntryZ = 0;
  }

  // If destination is in West Wing (Kitchen / Restroom)
  if (isDestInWest) {
    const targetCorridorZ = officeEntryZ < 0 ? -3.2 : 3.2;
    if (Math.abs(officeEntryZ) > 0.5) {
      waypoints.push([officeEntryX, 0, targetCorridorZ]);
      waypoints.push([-10.5, 0, targetCorridorZ]);
    }
    waypoints.push([-10.5, 0, 0]);
    waypoints.push([-13.8, 0, 0]);
    waypoints.push([-17.5, 0, 0]);

    if (destZ > 3.2) {
      waypoints.push([-15.9, 0, 0]);
      waypoints.push([-15.9, 0, 3.2]);
    }
    if (Math.abs(destZ) > 0.4) {
      waypoints.push([-17.5, 0, destZ]);
    }
    waypoints.push([destX, 0, destZ]);
    return waypoints;
  }

  // If destination is in Dormitory
  if (isDestInDorm) {
    const targetCorridorZ = officeEntryZ < 0 ? -3.2 : 3.2;
    if (Math.abs(officeEntryZ) > 0.5) {
      waypoints.push([officeEntryX, 0, targetCorridorZ]);
      waypoints.push([10.5, 0, targetCorridorZ]);
    }
    waypoints.push([10.5, 0, 0]);
    waypoints.push([13.8, 0, 0]);
    waypoints.push([17.5, 0, 0]);
    if (Math.abs(destZ) > 0.4) {
      waypoints.push([17.5, 0, destZ]);
    }
    waypoints.push([destX, 0, destZ]);
    return waypoints;
  }

  // Moving within Office
  let curZ = officeEntryZ;
  if (officeEntryZ <= -4.5) {
    waypoints.push([officeEntryX, 0, -3.2]);
    curZ = -3.2;
  } else if (officeEntryZ >= 4.5) {
    waypoints.push([officeEntryX, 0, 3.2]);
    curZ = 3.2;
  }

  const destCorridorZ = destZ < 0 ? -3.2 : 3.2;
  if (Math.abs(curZ - destCorridorZ) > 1.0) {
    const connectorX = officeEntryX <= 0 ? -3.6 : 3.6;
    waypoints.push([connectorX, 0, curZ]);
    waypoints.push([connectorX, 0, destCorridorZ]);
    curZ = destCorridorZ;
  }

  if (Math.abs(officeEntryX - destX) > 0.4) {
    waypoints.push([destX, 0, curZ]);
  }

  waypoints.push([destX, 0, destZ]);
  return waypoints;
}

// Reusable scratch vectors to avoid per-frame GC allocations (Performance Optimization)
const _vTarget = new THREE.Vector3();
const _vDir = new THREE.Vector3();
const _vTemp = new THREE.Vector3();

export function AgentCharacter({ agent }: { agent: AgentVisual }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  const selectedAgentId = useOfficeStore((s) => s.selectedAgentId);
  const selectAgent = useOfficeStore((s) => s.selectAgent);
  const isSelected = selectedAgentId === agent.id;

  // Navigation & Posture state
  const homeDeskPos = agent.position;
  const currentPos = useRef<THREE.Vector3>(new THREE.Vector3(...homeDeskPos));
  const waypointQueue = useRef<[number, number, number][]>([]);
  const isWalking = useRef(false);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);

  // Agent task-based & meeting movement handler
  useEffect(() => {
    // 1. If meeting is active, assemble at conference table
    if (agent.status === "meeting") {
      const meetingSeat = MEETING_SEATS[agent.id] || { pos: [0, 0, 0], rotY: 0 };
      const path = generateWalkPath(
        [currentPos.current.x, currentPos.current.y, currentPos.current.z],
        meetingSeat.pos
      );
      waypointQueue.current = path;
      isWalking.current = true;

      const quotes = MEETING_QUOTES[agent.id] || ["Rapat sedang berlangsung..."];
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      setTimeout(() => {
        setSpeechBubble(quote);
        setTimeout(() => setSpeechBubble(null), 6000);
      }, 3000);
      return;
    }

    // 2. If working or thinking, route to workstation desk
    if (agent.status === "working" || agent.status === "thinking") {
      const path = generateWalkPath(
        [currentPos.current.x, currentPos.current.y, currentPos.current.z],
        homeDeskPos
      );
      waypointQueue.current = path;
      isWalking.current = true;
      return;
    }

    // 3. If idle: stay mostly at desk, occasionally stroll nearby
    const intervalTime = 20000 + Math.random() * 25000;
    const interval = setInterval(() => {
      if (agent.status !== "idle") return;

      const destinations = IDLE_DESTINATIONS[agent.id] || [homeDeskPos];
      const randomDest = Math.random() < 0.65 ? homeDeskPos : destinations[Math.floor(Math.random() * destinations.length)];

      const path = generateWalkPath(
        [currentPos.current.x, currentPos.current.y, currentPos.current.z],
        randomDest
      );
      waypointQueue.current = path;
      isWalking.current = true;

      if (Math.random() < 0.3) {
        const quotes = AGENT_QUOTES[agent.id] || ["Siap menerima arahan Director."];
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        setSpeechBubble(quote);
        setTimeout(() => setSpeechBubble(null), 5000);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [agent.status, agent.id, agent.position[0], agent.position[1], agent.position[2]]);

  // Main animation frame loop
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // ==========================================================
    // 1. FOLLOW WAYPOINT QUEUE (COLLISION-FREE WALKING)
    // ==========================================================
    if (waypointQueue.current.length > 0) {
      isWalking.current = true;

      // Stand up to full height while walking
      groupRef.current.position.y = 0;
      groupRef.current.rotation.x = 0;
      groupRef.current.rotation.z = 0;

      const nextTarget = waypointQueue.current[0];
      _vTarget.set(nextTarget[0], nextTarget[1], nextTarget[2]);
      const dist = currentPos.current.distanceTo(_vTarget);

      if (dist < 0.15) {
        // Reached this waypoint, pop and proceed to next
        waypointQueue.current.shift();
        if (waypointQueue.current.length === 0) {
          currentPos.current.copy(_vTarget);
          groupRef.current.position.x = _vTarget.x;
          groupRef.current.position.z = _vTarget.z;
        }
      } else {
        // Move towards current waypoint without allocations
        _vDir.subVectors(_vTarget, currentPos.current).normalize();
        currentPos.current.addScaledVector(_vDir, Math.min(dist, delta * 2.1));
        groupRef.current.position.x = currentPos.current.x;
        groupRef.current.position.z = currentPos.current.z;

        // Turn body to face movement direction
        const angle = Math.atan2(_vDir.x, _vDir.z);
        groupRef.current.rotation.y = angle;

        // Walking leg swing & arm swing
        const walkCycle = t * 9;
        if (leftLegRef.current && rightLegRef.current) {
          leftLegRef.current.position.set(-0.12, 0.45, 0);
          rightLegRef.current.position.set(0.12, 0.45, 0);
          leftLegRef.current.rotation.set(Math.sin(walkCycle) * 0.6, 0, 0);
          rightLegRef.current.rotation.set(-Math.sin(walkCycle) * 0.6, 0, 0);
        }
        if (leftArmRef.current && rightArmRef.current) {
          leftArmRef.current.position.set(-0.26, 1.05, 0);
          rightArmRef.current.position.set(0.26, 1.05, 0);
          leftArmRef.current.rotation.set(-Math.sin(walkCycle) * 0.6, 0, 0);
          rightArmRef.current.rotation.set(Math.sin(walkCycle) * 0.6, 0, 0);
        }
        groupRef.current.position.y = Math.abs(Math.sin(walkCycle * 2)) * 0.04;
        if (headRef.current) {
          headRef.current.rotation.set(0, 0, 0);
        }
      }
    } else {
      // ==========================================================
      // 2. AT DESTINATION: POSTURES & ACTIVITIES
      // ==========================================================
      isWalking.current = false;

      const meetingSeat = MEETING_SEATS[agent.id];
      const isAtMeetingChair = meetingSeat && currentPos.current.distanceTo(_vTemp.set(meetingSeat.pos[0], meetingSeat.pos[1], meetingSeat.pos[2])) < 0.45;
      const isAtHomeDesk = currentPos.current.distanceTo(_vTemp.set(homeDeskPos[0], homeDeskPos[1], homeDeskPos[2])) < 0.45;

      // --- SCENARIO A: MEETING TABLE ---
      if (isAtMeetingChair && (agent.status === "meeting" || isAtMeetingChair)) {
        groupRef.current.rotation.x = 0;
        groupRef.current.rotation.z = 0;
        groupRef.current.rotation.y = meetingSeat.rotY;
        groupRef.current.position.set(meetingSeat.pos[0], -0.28, meetingSeat.pos[2]);

        if (leftLegRef.current && rightLegRef.current) {
          leftLegRef.current.position.set(-0.12, 0.55, 0.25);
          rightLegRef.current.position.set(0.12, 0.55, 0.25);
          leftLegRef.current.rotation.set(-Math.PI / 2, 0, 0);
          rightLegRef.current.rotation.set(-Math.PI / 2, 0, 0);
        }

        if (leftArmRef.current && rightArmRef.current) {
          leftArmRef.current.position.set(-0.24, 1.05, 0.16);
          rightArmRef.current.position.set(0.24, 1.05, 0.16);
          leftArmRef.current.rotation.set(Math.PI / 2.3 + Math.sin(t * 3) * 0.04, 0, -0.05);
          rightArmRef.current.rotation.set(Math.PI / 2.3 + Math.cos(t * 3) * 0.04, 0, 0.05);
        }

        if (headRef.current) {
          headRef.current.rotation.set(0.08, Math.sin(t * 1.2) * 0.2, 0);
        }
      }

      // --- SCENARIO E: SEATED AT WORKSTATION DESK ---
      else if (isAtHomeDesk) {
        groupRef.current.rotation.x = 0;
        groupRef.current.rotation.z = 0;
        groupRef.current.rotation.y = agent.rotation[1];
        groupRef.current.position.set(homeDeskPos[0], -0.28, homeDeskPos[2]);

        if (leftLegRef.current && rightLegRef.current) {
          leftLegRef.current.position.set(-0.12, 0.55, 0.25);
          rightLegRef.current.position.set(0.12, 0.55, 0.25);
          leftLegRef.current.rotation.set(-Math.PI / 2, 0, 0);
          rightLegRef.current.rotation.set(-Math.PI / 2, 0, 0);
        }

        if (leftArmRef.current && rightArmRef.current) {
          leftArmRef.current.position.set(-0.24, 1.05, 0.16);
          rightArmRef.current.position.set(0.24, 1.05, 0.16);

          if (agent.status === "working") {
            // Typing motion at keyboard
            leftArmRef.current.rotation.set(Math.PI / 2.3 + Math.sin(t * 14) * 0.08, 0, -0.1);
            rightArmRef.current.rotation.set(Math.PI / 2.3 + Math.cos(t * 14) * 0.08, 0, 0.1);
            if (headRef.current) {
              headRef.current.rotation.set(0.18 + Math.sin(t * 6) * 0.04, Math.sin(t * 1.5) * 0.15, 0);
            }
          } else if (agent.status === "thinking") {
            leftArmRef.current.rotation.set(0.4, 0, 0);
            rightArmRef.current.rotation.set(1.2, 0, 0.2);
            if (headRef.current) {
              headRef.current.rotation.set(-0.18, 0, 0);
            }
            if (haloRef.current) {
              haloRef.current.rotation.z = t * 2.5;
            }
          } else {
            // Idle relaxed posture at desk
            leftArmRef.current.rotation.set(Math.PI / 2.3 + Math.sin(t * 3) * 0.03, 0, -0.05);
            rightArmRef.current.rotation.set(Math.PI / 2.3 + Math.cos(t * 3) * 0.03, 0, 0.05);
            if (headRef.current) {
              headRef.current.rotation.set(0.12, Math.sin(t * 0.8) * 0.2, 0);
            }
          }
        }
      }

      // --- SCENARIO F: STANDING AT DESTINATION ---
      else {
        groupRef.current.position.y = 0;
        groupRef.current.rotation.x = 0;
        groupRef.current.rotation.z = 0;

        if (leftLegRef.current && rightLegRef.current) {
          leftLegRef.current.position.set(-0.12, 0.45, 0);
          rightLegRef.current.position.set(0.12, 0.45, 0);
          leftLegRef.current.rotation.set(0, 0, 0);
          rightLegRef.current.rotation.set(0, 0, 0);
        }

        if (leftArmRef.current && rightArmRef.current) {
          leftArmRef.current.position.set(-0.26, 1.05, 0);
          rightArmRef.current.position.set(0.26, 1.05, 0);
          leftArmRef.current.rotation.set(Math.sin(t * 2) * 0.08, 0, 0);
          rightArmRef.current.rotation.set(Math.cos(t * 2) * 0.08, 0, 0);
        }
        if (headRef.current) {
          headRef.current.rotation.set(0, Math.sin(t * 0.8) * 0.25, 0);
        }
      }
    }
  });

  return (
    <group
      ref={groupRef}
      position={homeDeskPos}
      rotation={agent.rotation}
      onClick={(e) => {
        e.stopPropagation();
        selectAgent(agent.id);
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      {/* Selection Highlight Ring - Double ring with glow */}
      {isSelected && (
        <group position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <ringGeometry args={[0.52, 0.60, 48]} />
            <meshBasicMaterial color={agent.color} side={THREE.DoubleSide} />
          </mesh>
          <mesh>
            <ringGeometry args={[0.65, 0.70, 48]} />
            <meshBasicMaterial color={agent.color} transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* Floating Name Pill */}
      <Html
        position={[0, 2.35, 0]}
        center
        distanceFactor={14}
        zIndexRange={[10, 0]}
      >
        <div
          className={`flex flex-col items-center pointer-events-none transition-all duration-300 ${
            isSelected ? "scale-110" : "scale-95 opacity-85"
          }`}
        >
          {/* Conversational Speech Bubble - more premium */}
          {speechBubble && (
            <div
              className="mb-2 px-3.5 py-2 rounded-xl text-xs text-white font-sans shadow-2xl max-w-xs text-center animate-in fade-in zoom-in-90 duration-300 relative"
              style={{
                background: "linear-gradient(135deg, rgba(15,23,42,0.97) 0%, rgba(30,41,59,0.95) 100%)",
                border: `1px solid ${agent.color}60`,
                boxShadow: `0 0 20px ${agent.color}30, 0 8px 32px rgba(0,0,0,0.5)`,
              }}
            >
              {speechBubble}
              <div
                className="w-2.5 h-2.5 transform rotate-45 mx-auto -mb-3 mt-1"
                style={{
                  background: "rgba(15,23,42,0.97)",
                  borderRight: `1px solid ${agent.color}60`,
                  borderBottom: `1px solid ${agent.color}60`,
                }}
              />
            </div>
          )}

          {/* Premium Name Pill */}
          <div
            className="px-3.5 py-1.5 rounded-full text-xs font-bold shadow-2xl whitespace-nowrap text-white flex items-center gap-2 tracking-wide"
            style={{
              background: `linear-gradient(135deg, ${agent.color}dd 0%, ${agent.color}99 100%)`,
              border: `1px solid ${agent.color}80`,
              boxShadow: `0 4px 20px ${agent.color}40, 0 2px 8px rgba(0,0,0,0.4)`,
              backdropFilter: "blur(12px)",
            }}
          >
            <span style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{agent.name.split(" ")[0]}</span>
            {agent.status === "working" && (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300"></span>
              </span>
            )}
            {agent.status === "thinking" && (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300"></span>
              </span>
            )}
            {agent.status === "meeting" && (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300"></span>
              </span>
            )}
          </div>
        </div>
      </Html>

      {/* Thinking Halo Effect - upgraded with double ring */}
      {agent.status === "thinking" && (
        <group>
          <mesh ref={haloRef} position={[0, 1.98, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.24, 0.30, 24]} />
            <meshBasicMaterial color="#f59e0b" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 1.98, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.35, 0.38, 24]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.3} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* Status point light above character */}
      <pointLight
        position={[0, 2.4, 0]}
        intensity={agent.status === "working" ? 0.6 : agent.status === "thinking" ? 0.5 : agent.status === "meeting" ? 0.4 : 0.1}
        color={agent.status === "working" ? "#4ade80" : agent.status === "thinking" ? "#fbbf24" : agent.status === "meeting" ? "#22d3ee" : "#94a3b8"}
        distance={2.5}
      />

      {/* === PREMIUM CHARACTER MODEL === */}

      {/* Shoes */}
      <mesh position={[-0.12, 0.09, 0.06]} castShadow>
        <boxGeometry args={[0.13, 0.09, 0.2]} />
        <meshStandardMaterial color="#111827" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[0.12, 0.09, 0.06]} castShadow>
        <boxGeometry args={[0.13, 0.09, 0.2]} />
        <meshStandardMaterial color="#111827" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Articulated Legs */}
      <mesh ref={leftLegRef} position={[-0.12, 0.45, 0]} castShadow>
        <boxGeometry args={[0.14, 0.62, 0.15]} />
        <meshStandardMaterial
          color={
            agent.id === "project_manager" ? "#1e293b" :
            agent.id === "researcher" ? "#292524" :
            agent.id === "literature_analyst" ? "#1e3a5f" :
            agent.id === "academic_writer" ? "#1a1a2e" :
            agent.id === "citation_specialist" ? "#232323" :
            agent.id === "data_analyst" ? "#1a2f1a" :
            agent.id === "academic_editor" ? "#2d1b4e" :
            "#3d1515"
          }
          roughness={0.6}
        />
      </mesh>
      <mesh ref={rightLegRef} position={[0.12, 0.45, 0]} castShadow>
        <boxGeometry args={[0.14, 0.62, 0.15]} />
        <meshStandardMaterial
          color={
            agent.id === "project_manager" ? "#1e293b" :
            agent.id === "researcher" ? "#292524" :
            agent.id === "literature_analyst" ? "#1e3a5f" :
            agent.id === "academic_writer" ? "#1a1a2e" :
            agent.id === "citation_specialist" ? "#232323" :
            agent.id === "data_analyst" ? "#1a2f1a" :
            agent.id === "academic_editor" ? "#2d1b4e" :
            "#3d1515"
          }
          roughness={0.6}
        />
      </mesh>

      {/* Torso - Professional Blazer */}
      <mesh position={[0, 1.08, 0]} castShadow>
        <boxGeometry args={[0.44, 0.60, 0.26]} />
        <meshStandardMaterial color={agent.color} roughness={0.45} />
      </mesh>

      {/* Shirt visible at center front */}
      <mesh position={[0, 1.05, 0.133]}>
        <boxGeometry args={[0.16, 0.42, 0.01]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>

      {/* Blazer Lapels */}
      <mesh position={[-0.07, 1.22, 0.128]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.09, 0.22, 0.015]} />
        <meshStandardMaterial color={agent.color} roughness={0.3} />
      </mesh>
      <mesh position={[0.07, 1.22, 0.128]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.09, 0.22, 0.015]} />
        <meshStandardMaterial color={agent.color} roughness={0.3} />
      </mesh>

      {/* White Shirt Collar */}
      <mesh position={[0, 1.34, 0.12]}>
        <boxGeometry args={[0.13, 0.12, 0.02]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>

      {/* Premium ID Badge with lanyard */}
      <mesh position={[0, 1.14, 0.138]}>
        <boxGeometry args={[0.07, 0.10, 0.008]} />
        <meshStandardMaterial color="#0284c7" metalness={0.3} roughness={0.2} />
      </mesh>
      {/* Badge photo area */}
      <mesh position={[0, 1.17, 0.143]}>
        <planeGeometry args={[0.04, 0.04]} />
        <meshBasicMaterial color="#fcd34d" />
      </mesh>

      {/* Articulated Arms */}
      <mesh ref={leftArmRef} position={[-0.26, 1.05, 0]} castShadow>
        <boxGeometry args={[0.11, 0.46, 0.11]} />
        <meshStandardMaterial color={agent.color} roughness={0.45} />
      </mesh>
      <mesh ref={rightArmRef} position={[0.26, 1.05, 0]} castShadow>
        <boxGeometry args={[0.11, 0.46, 0.11]} />
        <meshStandardMaterial color={agent.color} roughness={0.45} />
      </mesh>

      {/* Hands */}
      <mesh position={[-0.26, 0.78, 0]}>
        <boxGeometry args={[0.09, 0.1, 0.09]} />
        <meshStandardMaterial
          color={
            agent.id === "project_manager" ? "#FDBCB4" :
            agent.id === "researcher" ? "#C68642" :
            agent.id === "literature_analyst" ? "#FDBCB4" :
            agent.id === "academic_writer" ? "#8D5524" :
            agent.id === "citation_specialist" ? "#FFE0BD" :
            agent.id === "data_analyst" ? "#C68642" :
            agent.id === "academic_editor" ? "#FDBCB4" :
            "#8D5524"
          }
          roughness={0.5}
        />
      </mesh>
      <mesh position={[0.26, 0.78, 0]}>
        <boxGeometry args={[0.09, 0.1, 0.09]} />
        <meshStandardMaterial
          color={
            agent.id === "project_manager" ? "#FDBCB4" :
            agent.id === "researcher" ? "#C68642" :
            agent.id === "literature_analyst" ? "#FDBCB4" :
            agent.id === "academic_writer" ? "#8D5524" :
            agent.id === "citation_specialist" ? "#FFE0BD" :
            agent.id === "data_analyst" ? "#C68642" :
            agent.id === "academic_editor" ? "#FDBCB4" :
            "#8D5524"
          }
          roughness={0.5}
        />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.37, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.14, 12]} />
        <meshStandardMaterial
          color={
            agent.id === "project_manager" ? "#FDBCB4" :
            agent.id === "researcher" ? "#C68642" :
            agent.id === "literature_analyst" ? "#FDBCB4" :
            agent.id === "academic_writer" ? "#8D5524" :
            agent.id === "citation_specialist" ? "#FFE0BD" :
            agent.id === "data_analyst" ? "#C68642" :
            agent.id === "academic_editor" ? "#FDBCB4" :
            "#8D5524"
          }
          roughness={0.5}
        />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, 1.56, 0]} castShadow>
        <sphereGeometry args={[0.19, 20, 20]} />
        <meshStandardMaterial
          color={
            agent.id === "project_manager" ? "#FDBCB4" :
            agent.id === "researcher" ? "#C68642" :
            agent.id === "literature_analyst" ? "#FDBCB4" :
            agent.id === "academic_writer" ? "#8D5524" :
            agent.id === "citation_specialist" ? "#FFE0BD" :
            agent.id === "data_analyst" ? "#C68642" :
            agent.id === "academic_editor" ? "#FDBCB4" :
            "#8D5524"
          }
          roughness={0.4}
        />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.68, -0.03]} castShadow>
        <boxGeometry args={[0.30, 0.15, 0.28]} />
        <meshStandardMaterial
          color={
            agent.id === "project_manager" ? "#1a0a00" :
            agent.id === "researcher" ? "#2c1810" :
            agent.id === "literature_analyst" ? "#4a3728" :
            agent.id === "academic_writer" ? "#1a0a00" :
            agent.id === "citation_specialist" ? "#c8a84b" :
            agent.id === "data_analyst" ? "#1a1a1a" :
            agent.id === "academic_editor" ? "#c17f24" :
            "#2c1810"
          }
          roughness={0.8}
        />
      </mesh>
      {/* Side hair */}
      <mesh position={[0, 1.60, -0.08]}>
        <boxGeometry args={[0.30, 0.10, 0.12]} />
        <meshStandardMaterial
          color={
            agent.id === "project_manager" ? "#1a0a00" :
            agent.id === "researcher" ? "#2c1810" :
            agent.id === "literature_analyst" ? "#4a3728" :
            agent.id === "academic_writer" ? "#1a0a00" :
            agent.id === "citation_specialist" ? "#c8a84b" :
            agent.id === "data_analyst" ? "#1a1a1a" :
            agent.id === "academic_editor" ? "#c17f24" :
            "#2c1810"
          }
          roughness={0.8}
        />
      </mesh>

      {/* Eyes (small dark dots) */}
      <mesh position={[-0.07, 1.57, 0.17]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.07, 1.57, 0.17]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      {/* Eye whites */}
      <mesh position={[-0.07, 1.57, 0.165]}>
        <sphereGeometry args={[0.033, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.07, 1.57, 0.165]}>
        <sphereGeometry args={[0.033, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}
