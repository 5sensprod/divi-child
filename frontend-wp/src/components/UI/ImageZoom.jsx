// src/components/UI/ImageZoom.jsx
import { useState, useRef, useCallback } from "react";

const ImageZoom = ({ src, alt, zoomLevel = 2.5 }) => {
  const [isZooming, setIsZooming] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [bgPos, setBgPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const LENS_SIZE = 120;

  const handleMouseMove = useCallback((e) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Position de la loupe (centrée sur le curseur, clampée aux bords)
    const lensX = Math.max(LENS_SIZE / 2, Math.min(x, rect.width - LENS_SIZE / 2));
    const lensY = Math.max(LENS_SIZE / 2, Math.min(y, rect.height - LENS_SIZE / 2));

    // Position du background zoomé dans la loupe
    const bgX = ((x / rect.width) * 100).toFixed(2);
    const bgY = ((y / rect.height) * 100).toFixed(2);

    setLensPos({ x: lensX, y: lensY });
    setBgPos({ x: bgX, y: bgY });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative aspect-square bg-white rounded-lg shadow-lg overflow-hidden cursor-crosshair select-none"
      onMouseEnter={() => setIsZooming(true)}
      onMouseLeave={() => setIsZooming(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Image principale */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain"
        loading="eager"
        draggable={false}
      />

      {/* Loupe */}
      {isZooming && (
        <div
          className="absolute pointer-events-none rounded-full border-2 border-white shadow-xl overflow-hidden"
          style={{
            width: LENS_SIZE * 2,
            height: LENS_SIZE * 2,
            left: lensPos.x - LENS_SIZE,
            top: lensPos.y - LENS_SIZE,
            backgroundImage: `url(${src})`,
            backgroundSize: `${zoomLevel * 100}%`,
            backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
            backgroundRepeat: "no-repeat",
            backgroundColor: "white",
            zIndex: 10,
          }}
        />
      )}

      {/* Indicateur discret */}
      {!isZooming && (
        <div className="absolute bottom-2 right-2 bg-black/30 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 pointer-events-none">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
            <path d="M11 8v6M8 11h6" />
          </svg>
          Zoom
        </div>
      )}
    </div>
  );
};

export default ImageZoom;
