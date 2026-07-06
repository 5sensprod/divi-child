// src/components/UI/ImageLightbox.jsx
import { useState, useEffect, useCallback } from "react";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageLightboxSkeleton } from "./LoadingSkeleton";

const ImageLightbox = ({ images = [], currentIndex = 0, onClose, loading = false }) => {
  const [index, setIndex] = useState(currentIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    setIndex(currentIndex);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setImageLoading(true);
  }, [currentIndex]);

  useEffect(() => {
    setImageLoading(true);
  }, [index]);

  const prev = useCallback(() => {
    if (!images.length) return;
    setIndex((i) => (i - 1 + images.length) % images.length);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [images.length]);

  const next = useCallback(() => {
    if (!images.length) return;
    setIndex((i) => (i + 1) % images.length);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [images.length]);

  // Clavier
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, prev, next]);

  // Bloquer le scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (loading || !images.length) {
    return <ImageLightboxSkeleton onClose={onClose} />;
  }

  const handleWheel = (e) => {
    e.preventDefault();
    setZoom((z) => Math.min(4, Math.max(1, z - e.deltaY * 0.001)));
  };

  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const toggleZoom = () => {
    if (zoom > 1) { setZoom(1); setPan({ x: 0, y: 0 }); }
    else setZoom(2.5);
  };

  return (
    <div
      className="fixed inset-0 z-[2000] bg-black/95 flex flex-col animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
        <span className="text-white/50 text-sm">
          {index + 1} / {images.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleZoom}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title={zoom > 1 ? "Dézoom" : "Zoom"}
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Image principale */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden relative"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in" }}
      >
        {imageLoading && (
          <div className="absolute h-[70vh] w-[70vw] max-w-5xl rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 animate-pulse" />
        )}
        <img
          src={images[index]?.src}
          alt={images[index]?.alt || ""}
          onClick={toggleZoom}
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
          draggable={false}
          className={`transition-opacity duration-200 ${imageLoading ? "opacity-0" : "opacity-100"}`}
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transition: isDragging ? "none" : "transform 0.2s ease, opacity 0.2s ease",
            maxWidth: "90vw",
            maxHeight: "80vh",
            objectFit: "contain",
            userSelect: "none",
          }}
        />
      </div>

      {/* Navigation */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 px-4 py-3 flex-shrink-0">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => { setIndex(i); setZoom(1); setPan({ x: 0, y: 0 }); }}
              className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${
                i === index ? "border-white scale-110" : "border-white/20 hover:border-white/50"
              }`}
            >
              <img src={img.src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Hint zoom */}
      <p className="text-center text-white/30 text-xs pb-2 flex-shrink-0">
        Scroll ou clic pour zoomer · Échap pour fermer
      </p>
    </div>
  );
};

export default ImageLightbox;
