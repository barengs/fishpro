import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Compass, Info, RotateCcw, Map, Eye } from "lucide-react";
import { WPP_REAL_POLYGONS, type WppPolygonGeo } from "./wppRealPolygons";
import { formatWeight } from "../../utils";

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
  const [activeWpp, setActiveWpp] = useState<WppPolygonGeo | null>(null);
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
        setActiveWpp(wpp);
      });

      polygon.on("mouseover", () => {
        setActiveWpp(wpp);
        polygon.setStyle({
          fillOpacity: 0.35,
          weight: 2.5,
          color: "#38bdf8",
        });
      });

      polygon.on("mouseout", () => {
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
            WPP ${wpp.code}
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

      // Jitter offset around center for distinct vessel coordinates
      const latOffset = ((v.id % 5) - 2) * 0.45;
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

      circle.bindTooltip(
        `<strong>${v.name}</strong><br/>Reg: ${v.reg}<br/>Status Kuota: ${pct}% tersisa`,
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
    setActiveWpp(null);
  };

  return (
    <div className="surface-card border border-fco-border-subtle rounded-xs overflow-hidden shadow-2xs">
      {/* 1. Clean Enterprise Header Toolbar */}
      <div className="p-3.5 px-5 border-b border-fco-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-fco-card-dark">
        {/* Title and Scope */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xs bg-blue-500/10 text-fco-blue flex items-center justify-center shrink-0">
            <Compass size={18} aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="m-0 text-sm font-bold text-strong">
                Peta Wilayah WPPNRI
              </h3>
              <span className="text-2xs font-mono font-bold px-2 py-0.5 rounded-xs bg-blue-500/10 text-fco-blue">
                {role === "admin" ? "Zonasi Kebijakan" : "Radar Pengawasan"}
              </span>
            </div>
            <p className="m-0 text-2xs text-soft mt-0.5">
              Wilayah Pengelolaan Perikanan Negara Republik Indonesia
              (Permen-KP)
            </p>
          </div>
        </div>

        {/* Action Controls & Legends */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Layer Segmented Control */}
          <div className="inline-flex rounded-xs border border-fco-border-subtle surface-inset p-0.5">
            <button
              type="button"
              onClick={() => setMapTileStyle("standard")}
              className={`h-7 px-3 rounded-xs text-xs font-semibold cursor-pointer border-none transition-colors flex items-center gap-1.5 ${
                mapTileStyle === "standard"
                  ? "bg-fco-blue text-white shadow-2xs"
                  : "bg-transparent text-soft hover:text-strong"
              }`}
            >
              <Map size={12} />
              <span>Peta Laut</span>
            </button>
            <button
              type="button"
              onClick={() => setMapTileStyle("satellite")}
              className={`h-7 px-3 rounded-xs text-xs font-semibold cursor-pointer border-none transition-colors flex items-center gap-1.5 ${
                mapTileStyle === "satellite"
                  ? "bg-fco-blue text-white shadow-2xs"
                  : "bg-transparent text-soft hover:text-strong"
              }`}
            >
              <Eye size={12} />
              <span>Satelit</span>
            </button>
          </div>

          {/* Reset View Button */}
          <button
            type="button"
            onClick={handleResetView}
            title="Pusatkan Peta Nusantara"
            className="h-8 px-3 rounded-xs border border-fco-border-subtle surface-card hover:surface-page text-strong flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs text-xs font-semibold"
          >
            <RotateCcw size={13} />
            <span>Pusatkan</span>
          </button>

          {/* Legend */}
          {role === "regulator" ? (
            <div className="hidden lg:flex items-center gap-3 pl-2.5 border-l border-fco-border-subtle text-2xs font-medium text-soft">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Aman</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Waspada</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>Kritis</span>
              </span>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2 pl-2.5 border-l border-fco-border-subtle text-2xs font-medium text-soft">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#0284c7]" />
                <span>Batas WPP</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Real Leaflet Map Container */}
        <div className="relative w-full h-97.5 sm:h-112.5 bg-slate-900 overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* 3. Floating Detail Card on Top-Right of Map */}
        {activeWpp && (
          <div className="absolute top-3 right-3 z-1000 max-w-xs sm:max-w-sm p-3.5 rounded-xs bg-[#0f172a]/95 backdrop-blur-md border border-white/10 text-white shadow-2xl flex items-start gap-3 pointer-events-auto">
            <div className="w-8 h-8 rounded-xs bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
              <Info size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-cyan-400">
                  WPP {activeWpp.code}
                </span>
                <span className="text-2xs text-white/50 font-medium">
                  {activeWpp.ocean}
                </span>
              </div>
              <h4 className="m-0 text-xs font-bold text-white truncate mt-0.5">
                {activeWpp.name}
              </h4>
              <p className="m-0 text-2xs text-white/70 mt-1 leading-relaxed">
                {activeWpp.description}
              </p>

              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-2xs">
                <span>
                  Armada:{" "}
                  <strong className="text-white font-mono">
                    {
                      vessels.filter((v) =>
                        (v.wppCode || "573").includes(activeWpp.code),
                      ).length
                    }{" "}
                    kapal
                  </strong>
                </span>
                <span>
                  Total:{" "}
                  <strong className="text-cyan-300 font-mono">
                    {formatWeight(
                      catchesPerWpp[activeWpp.code] ||
                        catchesPerWpp[`WPP ${activeWpp.code}`] ||
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
