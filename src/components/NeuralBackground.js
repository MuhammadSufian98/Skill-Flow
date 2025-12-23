"use client";

import { useEffect, useRef } from "react";
import NET from "vanta/dist/vanta.net.min";
import * as THREE from "three";

export default function NeuralBackground() {
  const vantaRef = useRef(null);
  const effectRef = useRef(null);

  useEffect(() => {
    if (!effectRef.current) {
      effectRef.current = NET({
        el: vantaRef.current,
        THREE,

        mouseControls: true,
        touchControls: true,
        gyroControls: false,

        // Line color (cyan-pink leaning purple)
        color: 0xff5cf0,

        // Background base (deep purple, NOT black)
        backgroundColor: 0x1a0826,

        // Make it look more "top-down"
        points: 14.0,
        maxDistance: 22.0,
        spacing: 16.0,
      });
    }

    return () => {
      if (effectRef.current) {
        effectRef.current.destroy();
        effectRef.current = null;
      }
    };
  }, []);

  return <div ref={vantaRef} className="absolute inset-0 -z-20" />;
}
