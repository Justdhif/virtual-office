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

  // Transition tracking: Only lerp target when store value changes programmatically
  // (e.g. clicking an agent or clicking Reset). Never fight manual user pan/grab!
  const isTransitioningRef = useRef(false);
  const prevTargetRef = useRef<[number, number, number]>(cameraTarget);

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

  // Track programmatic target changes (select agent, reset camera)
  useEffect(() => {
    const [px, py, pz] = prevTargetRef.current;
    const [tx, ty, tz] = cameraTarget;
    if (Math.abs(px - tx) > 0.001 || Math.abs(py - ty) > 0.001 || Math.abs(pz - tz) > 0.001) {
      prevTargetRef.current = cameraTarget;
      isTransitioningRef.current = true;
    }
  }, [cameraTarget]);

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
    if (controlsRef.current && isTransitioningRef.current) {
      const currentTarget = controlsRef.current.target;
      const dx = Math.abs(currentTarget.x - cameraTarget[0]);
      const dy = Math.abs(currentTarget.y - cameraTarget[1]);
      const dz = Math.abs(currentTarget.z - cameraTarget[2]);

      // Smoothly glide to the new target
      if (dx > 0.005 || dy > 0.005 || dz > 0.005) {
        currentTarget.x = THREE.MathUtils.lerp(currentTarget.x, cameraTarget[0], 0.1);
        currentTarget.y = THREE.MathUtils.lerp(currentTarget.y, cameraTarget[1], 0.1);
        currentTarget.z = THREE.MathUtils.lerp(currentTarget.z, cameraTarget[2], 0.1);
        controlsRef.current.update();
      } else {
        // Snapped to destination - end transition so user can freely grab without pushback
        currentTarget.x = cameraTarget[0];
        currentTarget.y = cameraTarget[1];
        currentTarget.z = cameraTarget[2];
        controlsRef.current.update();
        isTransitioningRef.current = false;
      }
    }
  });

  const isGrabMode = cameraMode === "grab";

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
      enableRotate={!isGrabMode}     // STRICTLY DISABLE ROTATION IN GRAB MODE - fixes wobble/rotate shaking
      screenSpacePanning={true}     // Direct, responsive 2-finger panning on mobile
      panSpeed={1.25}
      rotateSpeed={0.85}
      zoomSpeed={1.2}
      onStart={() => {
        // If user initiates manual interaction, immediately abort programmatic target lerp
        isTransitioningRef.current = false;
      }}
      onEnd={() => {
        // Keep target ref synced with manual pan position so subsequent actions don't snap back
        if (controlsRef.current) {
          const t = controlsRef.current.target;
          prevTargetRef.current = [t.x, t.y, t.z];
        }
      }}
      mouseButtons={
        isGrabMode
          ? {
              LEFT: THREE.MOUSE.PAN,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: THREE.MOUSE.PAN,
            }
          : {
              LEFT: THREE.MOUSE.ROTATE,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: THREE.MOUSE.PAN,
            }
      }
      touches={
        isGrabMode
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
