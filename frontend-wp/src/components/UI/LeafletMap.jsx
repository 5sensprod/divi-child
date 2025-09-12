// src/components/UI/LeafletMap.jsx
import React, { useEffect, useRef } from "react";

const LeafletMap = ({
  center = [48.8566, 2.3522],
  zoom = 13,
  markers = [],
  className = "w-full h-full", // ← remplit son parent
  tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const resizeObserverRef = useRef(null);

  useEffect(() => {
    const initMap = async () => {
      if (typeof window !== "undefined" && !window.L) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        await new Promise((resolve) => {
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }
    };

    const createMap = async () => {
      await initMap();

      if (mapRef.current && window.L && !mapInstanceRef.current) {
        const map = window.L.map(mapRef.current, {
          center,
          zoom,
          zoomControl: true,
        });

        window.L.tileLayer(tileUrl, { attribution }).addTo(map);

        markers.forEach((m) => {
          const mk = window.L.marker(m.position).addTo(map);
          if (m.popup) mk.bindPopup(m.popup);
        });

        mapInstanceRef.current = map;

        // important : invalider la taille après le render + sur resize
        setTimeout(() => map.invalidateSize(), 0);
        resizeObserverRef.current = new ResizeObserver(() => {
          map.invalidateSize();
        });
        resizeObserverRef.current.observe(mapRef.current);
      }
    };

    createMap();

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, markers, tileUrl, attribution]);

  // plus de minHeight fixe : on laisse le parent décider
  return <div ref={mapRef} className={className} style={{ height: "100%" }} />;
};

export default LeafletMap;
