import React from "react";

function GrainBackground({
  children,
  className = "",
  intensity = 0.45, // 0 to 1 (opacity of the grain layer)
  blend = "multiply", // multiply | overlay | soft-light | screen
}) {
  const opacity = Math.max(0, Math.min(1, intensity));

  return (
    <>
      <div className=" absolute top-0 ">
        <div className={`relative h-screen w-full ${className}`}>
          {/* Your page content */}
          <div className="relative z-10 h-full w-full">{children}</div>

          {/* Grain overlay using SVG turbulence */}
          <svg
            className={`pointer-events-none fixed inset-0 z-0 h-full w-full mix-blend-${blend}`}
            style={{ opacity }}
            aria-hidden
          >
            <filter id="grainFilter">
              {/*
           
          */}
              <feTurbulence
                type="fractalNoise"
                baseFrequency={0.9}
                numOctaves={4}
                stitchTiles="stitch"
              />
              {/* Optional: add a small contrast bump */}
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grainFilter)" />
          </svg>
        </div>
      </div>
    </>
  );
}
export default GrainBackground;
