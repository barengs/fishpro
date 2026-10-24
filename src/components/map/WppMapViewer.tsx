import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Info, RotateCcw, Map, Eye } from "lucide-react";
import { WPP_REAL_POLYGONS, type WppPolygonGeo } from "./wppRealPolygons";
import { formatWeight, escapeHtml } from "../../utils";

export interface ShipVesselMarker {
  id: number;
  name: string;
  reg: string;
  wppCode?: string;
  quotaPct?: number | null;
  active?: boolean;
}

export interface WppMapViewerProps {
  role: "admin" | "regulator";
  selectedWpp?: string | null;
  onSelectWpp?: (wppCode: string) => void;
  vessels?: ShipVesselMarker[];
  catchesPerWpp?: Record<string, number>;
  onInspectVessel?: (ship: ShipVesselMarker) => void;
}

export function WppMapViewer({
  role,
  selectedWpp,
  onSelectWpp,
  vessels = [],
  catchesPerWpp = {},
  onInspectVessel,
}: WppMapViewerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonLayersRef = useRef<Record<string, L.Polygon>>({});
  const [hoveredWpp, setHoveredWpp] = useState<WppPolygonGeo | null>(null);
  const [mapTileStyle, setMapTileStyle] = useState<"standard" | "satellite">(
    "standard",
  );

  // Initial Map Setup (OpenStreetMap centered on Indonesia Archipelago)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center coordinates: Indonesia (-2.5 Latitude, 118.0 Longitude), Zoom: 5
    const map = L.map(mapContainerRef.current, {
      center: [-2.2, 118.0],
      zoom: 5,
      minZoom: 4,
      maxZoom: 11,
      zoomControl: true,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    // Fix default Leaflet icon paths
    delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Tile Layer Switcher (OpenStreetMap standard vs Satellite imagery)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing tile layer if any
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const tileUrl =
      mapTileStyle === "satellite"
        ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    const maxZoom = mapTileStyle === "satellite" ? 17 : 19;

    L.tileLayer(tileUrl, { maxZoom }).addTo(map);
  }, [mapTileStyle]);

  // Render 11 WPP Boundaries as Real Leaflet Polygons
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous polygons
    Object.values(polygonLayersRef.current).forEach((p) => map.removeLayer(p));
    polygonLayersRef.current = {};

    WPP_REAL_POLYGONS.forEach((wpp) => {
      const isSelected =
        selectedWpp?.replace(/^WPP\s*/i, "").trim() === wpp.code;
      const catchVolume =
        catchesPerWpp[wpp.code] || catchesPerWpp[`WPP ${wpp.code}`] || 0;

      const polygon = L.polygon(wpp.polygon, {
        color: isSelected ? "#0284c7" : "#0284c7",
        weight: isSelected ? 3 : 1.8,
        opacity: isSelected ? 1 : 0.85,
        fillColor: isSelected ? "#38bdf8" : "#0284c7",
        fillOpacity: isSelected ? 0.35 : 0.15,
        dashArray: isSelected ? undefined : "6, 6",
      });

      polygon.on("click", () => {
        onSelectWpp?.(`WPP ${wpp.code}`);
      });

      polygon.on("mouseover", () => {
        setHoveredWpp(wpp);
        polygon.setStyle({
          fillOpacity: 0.35,
          weight: 2.5,
          color: "#38bdf8",
        });
      });

      polygon.on("mouseout", () => {
        setHoveredWpp(null);
        if (selectedWpp?.replace(/^WPP\s*/i, "").trim() !== wpp.code) {
          polygon.setStyle({
            fillOpacity: 0.15,
            weight: 1.8,
            color: "#0284c7",
          });
        }
      });

      // Permanent WPP Label marker
      const labelIcon = L.divIcon({
        className: "custom-wpp-badge",
        html: `
          <div style="background:#091424;color:#ffffff;border:1.5px solid #0284c7;padding:2px 8px;border-radius:3px;font-size:11px;font-family:monospace;font-weight:bold;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.4);text-align:center;">
            WPP ${escapeHtml(wpp.code)}
            ${catchVolume > 0 ? `<div style="color:#38bdf8;font-size:9px;font-weight:bold;">${formatWeight(catchVolume)}</div>` : ""}
          </div>
        `,
        iconSize: [68, 26],
        iconAnchor: [34, 13],
      });

      L.marker(wpp.center, { icon: labelIcon, interactive: false }).addTo(map);

      polygon.addTo(map);
      polygonLayersRef.current[wpp.code] = polygon;
    });
  }, [selectedWpp, catchesPerWpp, onSelectWpp]);

  // Render Realtime Vessel Markers (Only in Regulator view)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || role !== "regulator") return;

    const vesselMarkers: L.CircleMarker[] = [];

    vessels.forEach((v) => {
      const code = (v.wppCode || "573").replace(/^WPP\s*/i, "").trim();
      const wpp =
        WPP_REAL_POLYGONS.find((w) => w.code === code) || WPP_REAL_POLYGONS[2];

      // Jitter offset around center for distinct vessel coordinates (offset slightly south to avoid overlapping center badge)
      const latOffset = ((v.id % 5) - 2) * 0.45 - 0.4;
      const lngOffset = (((v.id * 3) % 5) - 2) * 0.55;
      const vesselPos: [number, number] = [
        wpp.center[0] + latOffset,
        wpp.center[1] + lngOffset,
      ];

      const pct = v.quotaPct ?? 100;
      const markerColor =
        pct < 15 ? "#ef4444" : pct < 35 ? "#f59e0b" : "#10b981";

      const circle = L.circleMarker(vesselPos, {
        radius: 7,
        fillColor: markerColor,
        color: "#ffffff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      });

      const safeName = escapeHtml(v.name);
      const safeReg = escapeHtml(v.reg);

      circle.bindTooltip(
        `<strong>${safeName}</strong><br/>Reg: ${safeReg}<br/>Status Kuota: ${pct}% tersisa`,
        { direction: "top", offset: [0, -6] },
      );

      circle.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        onInspectVessel?.(v);
      });

      circle.addTo(map);
      vesselMarkers.push(circle);
    });

    return () => {
      vesselMarkers.forEach((m) => map.removeLayer(m));
    };
  }, [vessels, role, onInspectVessel]);

  // Reset map view to full archipelago
  const handleResetView = () => {
    mapInstanceRef.current?.setView([-2.2, 118.0], 5);
    setHoveredWpp(null);
  };

  return (
    <div className="surface-card border border-fco-border-subtle rounded-xs overflow-hidden shadow-2xs">
      {/* Real Leaflet Map Container */}
      <div className="relative w-full h-97.5 sm:h-112.5 bg-slate-900 overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Map Controls (Top-Right) */}
        <div className="absolute top-3 right-3 z-[1000] flex items-center gap-2 pointer-events-auto">
          {/* Layer Segmented Control */}
          <div className="inline-flex items-center rounded-xs border border-white/10 bg-[#0f172a]/90 backdrop-blur-md p-0.5 shadow-lg">
            <button
              type="button"
              onClick={() => setMapTileStyle("standard")}
              className={`h-7.5 px-3 rounded-xs text-xs cursor-pointer border-none transition-all flex items-center gap-1.5 ${
                mapTileStyle === "standard"
                  ? "bg-[#0284c7] text-white font-bold shadow-xs"
                  : "bg-transparent text-white/70 hover:text-white font-medium"
              }`}
            >
              <Map size={13} />
              <span>Peta Laut</span>
            </button>
            <button
              type="button"
              onClick={() => setMapTileStyle("satellite")}
              className={`h-7.5 px-3 rounded-xs text-xs cursor-pointer border-none transition-all flex items-center gap-1.5 ${
                mapTileStyle === "satellite"
                  ? "bg-[#0284c7] text-white font-bold shadow-xs"
                  : "bg-transparent text-white/70 hover:text-white font-medium"
              }`}
            >
              <Eye size={13} />
              <span>Satelit</span>
            </button>
          </div>

          {/* Reset View Button */}
          <button
            type="button"
            onClick={handleResetView}
            title="Pusatkan Peta Nusantara"
            className="h-8.5 px-3 rounded-xs border border-white/10 bg-[#0f172a]/90 hover:bg-[#1e293b] backdrop-blur-md text-white flex items-center gap-1.5 cursor-pointer transition-all shadow-lg text-xs font-semibold active:scale-95"
          >
            <RotateCcw size={13} className="text-white/80" />
            <span>Pusatkan</span>
          </button>
        </div>

        {/* Floating In-Map Legend (Bottom-Left) */}
        <div className="absolute bottom-3 left-3 z-[1000] px-3 py-1.5 rounded-xs bg-[#0f172a]/90 backdrop-blur-md border border-white/10 text-white shadow-lg pointer-events-auto flex items-center gap-2.5 text-2xs font-medium">
          {role === "regulator" ? (
            <>
              <span className="text-white/50 font-bold uppercase text-[10px]">
                Status Kuota:
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Aman</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Waspada</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span>Kritis</span>
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#0284c7] border border-cyan-400/50" />
                <span className="font-semibold text-white/90">
                  Batas 11 Wilayah WPP
                </span>
              </span>
              <span className="text-white/30 hidden sm:inline">·</span>
              <span className="text-white/60 hidden sm:inline">
                Klik zona untuk filter tabel
              </span>
            </>
          )}
        </div>

        {/* 3. Floating Detail Card on Top-Right of Map (Only visible on hover) */}
        {hoveredWpp && (
          <div className="absolute top-3 right-3 z-[1000] max-w-xs sm:max-w-sm p-3.5 rounded-xs bg-[#0f172a]/95 backdrop-blur-md border border-white/10 text-white shadow-2xl flex items-start gap-3 pointer-events-none transition-all duration-150 animate-in fade-in">
            <div className="w-8 h-8 rounded-xs bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
              <Info size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-cyan-400">
                  WPP {hoveredWpp.code}
                </span>
                <span className="text-2xs text-white/50 font-medium">
                  {hoveredWpp.ocean}
                </span>
              </div>
              <h4 className="m-0 text-xs font-bold text-white truncate mt-0.5">
                {hoveredWpp.name}
              </h4>
              <p className="m-0 text-2xs text-white/70 mt-1 leading-relaxed">
                {hoveredWpp.description}
              </p>

              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-2xs">
                <span>
                  Armada:{" "}
                  <strong className="text-white font-mono">
                    {
                      vessels.filter((v) =>
                        (v.wppCode || "573").includes(hoveredWpp.code),
                      ).length
                    }{" "}
                    kapal
                  </strong>
                </span>
                <span>
                  Total:{" "}
                  <strong className="text-cyan-300 font-mono">
                    {formatWeight(
                      catchesPerWpp[hoveredWpp.code] ||
                        catchesPerWpp[`WPP ${hoveredWpp.code}`] ||
                        0,
                    )}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
