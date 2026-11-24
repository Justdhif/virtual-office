"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OfficeEnvironment } from "./OfficeEnvironment";
import { AgentCharacter } from "./AgentCharacter";
import { CameraController } from "./CameraController";
import { useOfficeStore } from "@/store/useOfficeStore";

export function OfficeCanvas() {
  const agents = useOfficeStore((s) => s.agents);
  const virtualTime = useOfficeStore((s) => s.virtualTime);

  // Dynamic day/night cycle
  const isDaytime = virtualTime >= 390 && virtualTime < 1050;
  const isSunset = virtualTime >= 1050 && virtualTime < 1170;
  const isNight = virtualTime >= 1170 || virtualTime < 390;
  const isSleepTime = virtualTime >= 1320 || virtualTime < 390;
  const isEarlyMorning = virtualTime >= 390 && virtualTime < 480;
  const isLateAfternoon = virtualTime >= 900 && virtualTime < 1050;

  // Sky colors - more gradient and atmospheric
  const skyColor = isDaytime
    ? (isEarlyMorning ? "#bfdbfe" : isLateAfternoon ? "#dde8ff" : "#dbeafe")
    : isSunset
    ? "#f97316"
    : "#060d1f";

  const ambientIntensity = isDaytime ? 1.4 : isSunset ? 1.1 : 0.4;
  const sunIntensity = isDaytime ? 2.0 : isSunset ? 1.4 : 0.15;
  const sunColor = isDaytime
    ? (isEarlyMorning ? "#fde68a" : "#fffdf7")
    : isSunset
    ? "#fb923c"
    : "#93c5fd";
  const officeLightIntensity = isNight ? 0.5 : isDaytime ? 0.9 : 0.75;
  const officeLightColor = isNight ? "#dbeafe" : "#fffbeb";

  return (
    <div className="w-full h-full relative" style={{ background: "#060d1f" }}>
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: 3, // ACESFilmicToneMapping
          toneMappingExposure: 1.1,
        }}
        camera={{ position: [3, 19, 21], fov: 44 }}
      >
        {/* Sky gradient */}
        <color attach="background" args={[skyColor]} />

        {/* Atmospheric fog - pushed back to support wide zoom-out */}
        <fog attach="fog" args={[skyColor, 55, 110]} />

        {/* === LIGHTING SETUP === */}

        {/* Ambient fill light */}
        <ambientLight intensity={ambientIntensity} color="#f0f4ff" />

        {/* Primary sun/moon directional */}
        <directionalLight
          position={[14, 25, -12]}
          intensity={sunIntensity}
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-bias={-0.0001}
          shadow-camera-near={0.5}
          shadow-camera-far={80}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
          color={sunColor}
        />

        {/* Secondary soft fill from opposite side */}
        <directionalLight
          position={[-12, 18, 14]}
          intensity={sunIntensity * 0.35}
          color={isNight ? "#60a5fa" : "#e0eaff"}
        />

        {/* Rim/backlight for depth */}
        <directionalLight
          position={[0, 8, -20]}
          intensity={sunIntensity * 0.15}
          color={isNight ? "#1d4ed8" : "#bfdbfe"}
        />

        {/* === OFFICE INTERIOR CEILING LIGHTS (Premium LED panel fixtures) === */}
        {/* Director suite */}
        <pointLight position={[-6.8, 4.2, -5.4]} intensity={officeLightIntensity * 1.1} color={officeLightColor} distance={8} decay={2} />
        {/* Research lab south */}
        <pointLight position={[-6.8, 4.2, 5.4]} intensity={officeLightIntensity} color={officeLightColor} distance={8} decay={2} />
        {/* Writing studio */}
        <pointLight position={[6.8, 4.2, 5.4]} intensity={officeLightIntensity} color="#fffbf0" distance={8} decay={2} />
        {/* Library lounge */}
        <pointLight position={[6.8, 4.2, -5.4]} intensity={officeLightIntensity * 1.05} color="#fef3c7" distance={8} decay={2} />
        {/* Central conference */}
        <pointLight position={[0, 5.0, 0]} intensity={officeLightIntensity * 1.3} color="#ffffff" distance={10} decay={2} />

        {/* Additional accent lights for premium feel */}
        <pointLight position={[-6.8, 3.0, -8.5]} intensity={officeLightIntensity * 0.4} color="#bae6fd" distance={4} decay={2} />
        <pointLight position={[6.8, 3.0, -8.5]} intensity={officeLightIntensity * 0.3} color="#fde68a" distance={4} decay={2} />

        {/* === DORMITORY LIGHTS === */}
        <pointLight
          position={[17.5, 3.8, -4.5]}
          intensity={isSleepTime ? 0.2 : 0.8}
          color="#fed7aa"
          distance={10}
          decay={2}
        />
        <pointLight
          position={[17.9, 3.8, 4.5]}
          intensity={isSleepTime ? 0.1 : 0.55}
          color="#fef3c7"
          distance={10}
          decay={2}
        />

        {/* === KITCHEN WING LIGHTS === */}
        <pointLight position={[-17.75, 3.8, -4.0]} intensity={officeLightIntensity * 0.8} color="#f0fdf4" distance={8} decay={2} />
        <pointLight position={[-17.75, 3.8, 6.0]} intensity={officeLightIntensity * 0.6} color="#e0f2fe" distance={6} decay={2} />

        <Suspense fallback={null}>
          <OfficeEnvironment />
          {agents.map((agent) => (
            <AgentCharacter key={agent.id} agent={agent} />
          ))}
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  );
}
