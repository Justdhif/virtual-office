"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useOfficeStore } from "@/store/useOfficeStore";

export function CameraController() {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const cameraTarget = useOfficeStore((s) => s.cameraTarget);
  const cameraMode = useOfficeStore((s) => s.cameraMode);
  const zoomAction = useOfficeStore((s) => s.zoomAction);
  const prevZoomAction = useRef(zoomAction);

  useEffect(() => {
    // Initial camera positioning: Wider view on mobile to capture whole office
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (isMobile) {
      camera.position.set(0, 24, 28);
    } else {
      camera.position.set(0, 16, 19);
    }
    camera.lookAt(0, 0, 0);
  }, [camera]);

  // Handle programmatically triggered smooth zoom-in & zoom-out
  useEffect(() => {
    if (controlsRef.current && zoomAction !== prevZoomAction.current) {
      const diff = zoomAction - prevZoomAction.current;
      prevZoomAction.current = zoomAction;
      if (diff > 0) {
        controlsRef.current.dollyIn(1.22);
      } else {
        controlsRef.current.dollyOut(1.22);
      }
      controlsRef.current.update();
    }
  }, [zoomAction]);

  useFrame(() => {
    if (controlsRef.current) {
      const currentTarget = controlsRef.current.target;
      const dx = Math.abs(currentTarget.x - cameraTarget[0]);
      const dy = Math.abs(currentTarget.y - cameraTarget[1]);
      const dz = Math.abs(currentTarget.z - cameraTarget[2]);

      // Only perform target lerp and matrix update when transitioning
      if (dx > 0.002 || dy > 0.002 || dz > 0.002) {
        currentTarget.x = THREE.MathUtils.lerp(currentTarget.x, cameraTarget[0], 0.08);
        currentTarget.y = THREE.MathUtils.lerp(currentTarget.y, cameraTarget[1], 0.08);
        currentTarget.z = THREE.MathUtils.lerp(currentTarget.z, cameraTarget[2], 0.08);
        controlsRef.current.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2.12} // Prevent camera going below floor
      minPolarAngle={Math.PI / 8}   // Prevent disorientation from top-dead-center
      minDistance={2.2}              // Allow deep zoom-in to inspect agents & desks
      maxDistance={60}               // Allow deep zoom-out so office shrinks nicely on mobile
      enablePan={true}
      screenSpacePanning={true}     // Direct, responsive 2-finger panning on mobile
      panSpeed={1.2}
      rotateSpeed={0.85}
      zoomSpeed={1.2}
      mouseButtons={
        cameraMode === "grab"
          ? {
              LEFT: THREE.MOUSE.PAN,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: THREE.MOUSE.ROTATE,
            }
          : {
              LEFT: THREE.MOUSE.ROTATE,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: THREE.MOUSE.PAN,
            }
      }
      touches={
        cameraMode === "grab"
          ? {
              ONE: THREE.TOUCH.PAN,
              TWO: THREE.TOUCH.DOLLY_PAN,
            }
          : {
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN,
            }
      }
    />
  );
}
