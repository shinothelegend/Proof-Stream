"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring } from "framer-motion";

export function SnapCursorProvider({ children }: { children?: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const nearestElemRef = useRef<HTMLElement | null>(null);

  // Springs for 20px cursor position (stiffness 400, damping 30)
  const cursorX = useSpring(-100, { stiffness: 400, damping: 30 });
  const cursorY = useSpring(-100, { stiffness: 400, damping: 30 });

  useEffect(() => {
    // Check if touch device (pointer: coarse) or reduced motion
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isTouch || prefersReducedMotion) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    const onPointerMove = (e: PointerEvent) => {
      const snapTargets = document.querySelectorAll<HTMLElement>("[data-snap]");
      let minDistance = Infinity;
      let targetX = e.clientX;
      let targetY = e.clientY;
      let closestElem: HTMLElement | null = null;

      snapTargets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Calculate point on rect closest to pointer
        const clampedX = Math.max(rect.left, Math.min(e.clientX, rect.right));
        const clampedY = Math.max(rect.top, Math.min(e.clientY, rect.bottom));
        const dist = Math.hypot(e.clientX - clampedX, e.clientY - clampedY);

        if (dist < minDistance) {
          minDistance = dist;
          closestElem = el;
          if (dist <= 24) {
            // Magnetic attraction: pull cursor toward the edge/center
            const pullFactor = 1 - dist / 24;
            targetX = e.clientX + (clampedX - e.clientX) * pullFactor * 0.7;
            targetY = e.clientY + (clampedY - e.clientY) * pullFactor * 0.7;
          }
        }
      });

      // Update springs
      cursorX.set(targetX);
      cursorY.set(targetY);

      // Within 24px of a data-snap element: activate cursor sprite
      if (minDistance <= 24) {
        setVisible(true);

        // Apply <= 4px lean on closest element
        if (closestElem && closestElem !== nearestElemRef.current) {
          if (nearestElemRef.current) {
            (nearestElemRef.current as HTMLElement).style.transform = "";
          }
          nearestElemRef.current = closestElem;
        }

        if (closestElem) {
          const rect = (closestElem as HTMLElement).getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const leanX = Math.max(-4, Math.min(4, ((e.clientX - centerX) / (rect.width / 2 || 1)) * 4));
          const leanY = Math.max(-4, Math.min(4, ((e.clientY - centerY) / (rect.height / 2 || 1)) * 4));
          (closestElem as HTMLElement).style.transform = `translate3d(${leanX.toFixed(1)}px, ${leanY.toFixed(1)}px, 0)`;
        }
      } else {
        setVisible(false);
        if (nearestElemRef.current) {
          (nearestElemRef.current as HTMLElement).style.transform = "";
          nearestElemRef.current = null;
        }
      }
    };

    const onPointerLeaveWindow = () => {
      setVisible(false);
      if (nearestElemRef.current) {
        (nearestElemRef.current as HTMLElement).style.transform = "";
        nearestElemRef.current = null;
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeaveWindow);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeaveWindow);
      if (nearestElemRef.current) {
        (nearestElemRef.current as HTMLElement).style.transform = "";
      }
    };
  }, [cursorX, cursorY]);

  if (!enabled) return <>{children}</>;

  return (
    <>
      {children}
      {/* 20px Pixel Amber Arrow Cursor Sprite */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-150"
        style={{
          x: cursorX,
          y: cursorY,
          opacity: visible ? 1 : 0,
          transform: "translate(-2px, -2px)",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 16 16"
          shapeRendering="crispEdges"
          style={{ imageRendering: "pixelated" }}
        >
          {/* Pixelated amber arrow with dark border */}
          <path
            d="M0 0 L0 12 L3 9 L6 15 L8 14 L5 8 L10 8 Z"
            fill="var(--color-accent)"
            stroke="#0E0E12"
            strokeWidth="1"
          />
        </svg>
      </motion.div>
    </>
  );
}
