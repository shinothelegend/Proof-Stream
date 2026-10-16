import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

export function PixelChest({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" className={className}>
      <rect x="2" y="3" width="12" height="3" fill="#FFC93C" />
      <rect x="1" y="6" width="14" height="7" fill="#C88800" />
      <rect x="7" y="6" width="2" height="3" fill="#000000" />
      <rect x="7" y="7" width="2" height="1" fill="#FFFFFF" />
    </svg>
  );
}

export function PixelScroll({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" className={className}>
      <rect x="3" y="2" width="10" height="12" fill="#FFFCF2" />
      <rect x="2" y="3" width="1" height="10" fill="#FFC93C" />
      <rect x="13" y="3" width="1" height="10" fill="#FFC93C" />
      <rect x="5" y="5" width="6" height="1" fill="#1A1A2E" />
      <rect x="5" y="7" width="6" height="1" fill="#1A1A2E" />
      <rect x="5" y="9" width="4" height="1" fill="#1A1A2E" />
    </svg>
  );
}

export function PixelShield({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" className={className}>
      <rect x="3" y="1" width="10" height="2" fill="#3CE87C" />
      <rect x="2" y="3" width="12" height="6" fill="#3CE87C" />
      <rect x="4" y="9" width="8" height="3" fill="#3CE87C" />
      <rect x="6" y="12" width="4" height="2" fill="#3CE87C" />
      <rect x="7" y="14" width="2" height="1" fill="#3CE87C" />
      <rect x="5" y="6" width="2" height="2" fill="#000000" />
      <rect x="7" y="8" width="4" height="2" fill="#000000" />
    </svg>
  );
}

export function PixelCartridge({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" className={className}>
      <rect x="2" y="1" width="12" height="14" fill="#FFC93C" />
      <rect x="4" y="3" width="8" height="6" fill="#0B0B14" />
      <rect x="5" y="10" width="6" height="1" fill="#000000" />
      <rect x="5" y="12" width="6" height="1" fill="#000000" />
    </svg>
  );
}

export function PixelFlag({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" className={className}>
      <rect x="3" y="2" width="1" height="12" fill="#F4F4FF" />
      <rect x="4" y="2" width="7" height="5" fill="#FF5C7A" />
      <rect x="6" y="3" width="3" height="3" fill="#FFFFFF" />
    </svg>
  );
}

export function PixelCamera({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" className={className}>
      <rect x="6" y="2" width="4" height="2" fill="#43E8FF" />
      <rect x="2" y="4" width="12" height="9" fill="#15152A" />
      <rect x="2" y="4" width="12" height="2" fill="#43E8FF" />
      <rect x="6" y="7" width="4" height="4" fill="#FFC93C" />
      <rect x="7" y="8" width="2" height="2" fill="#000000" />
    </svg>
  );
}
