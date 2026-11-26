import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Info, RotateCcw, Map, Eye, Plus, Minus, X } from "lucide-react";
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

const DEFAULT_CENTER: [number, number] = [-2.2, 118.0];
const DEFAULT_ZOOM = 5;
const MIN_ZOOM = 4;
const MAX_ZOOM = 11;
const EMPTY_VESSELS: ShipVesselMarker[] = [];
const EMPTY_CATCHES_PER_WPP: Record<string, number> = {};

function normalizeWppCode(raw?: string | null): string {
  if (!raw) return "";
  return raw
    .toUpperCase()
    .replace(/WPPNRI|WPP|NRI|[-\s]/g, "")
    .trim();
}

export function WppMapViewer({
  role,
  selectedWpp,
  onSelectWpp,
  vessels = EMPTY_VESSELS,
  catchesPerWpp = EMPTY_CATCHES_PER_WPP,
  onInspectVessel,
}: WppMapViewerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonLayersRef = useRef<Record<string, L.Polygon>>({});
  const labelMarkersRef = useRef<L.Marker[]>([]);
  const onSelectWppRef = useRef(onSelectWpp);
  const onInspectVesselRef = useRef(onInspectVessel);
  const catchesPerWppRef = useRef(catchesPerWpp);
  const selectedCodeRef = useRef("");

  const [hoveredWpp, setHoveredWpp] = useState<WppPolygonGeo | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(DEFAULT_ZOOM);
  const [mapTileStyle, setMapTileStyle] = useState<"standard" | "satellite">(
    "standard",
  );

  const normalizedSelected = normalizeWppCode(selectedWpp);
  const catchesSignature = WPP_REAL_POLYGONS.map(
    (w) => catchesPerWpp[w.code] || catchesPerWpp[`WPP ${w.code}`] || 0,
  ).join(",");

  useEffect(() => {
    onSelectWppRef.current = onSelectWpp;
  }, [onSelectWpp]);

  useEffect(() => {
    onInspectVesselRef.current = onInspectVessel;
  }, [onInspectVessel]);

  useEffect(() => {
    catchesPerWppRef.current = catchesPerWpp;
  }, [catchesPerWpp]);

  useEffect(() => {
    selectedCodeRef.current = normalizedSelected;
  }, [normalizedSelected]);

  // Initial Map Setup (Centered on Indonesia Archipelago)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      zoomControl: false,
      attributionControl: false,
    });

    const handleZoomEnd = () => {
      setZoomLevel(map.getZoom());
    };
    map.on("zoomend", handleZoomEnd);

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
      map.off("zoomend", handleZoomEnd);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Tile Layer Switcher (OpenStreetMap standard vs Satellite imagery)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

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

  // Build 11 WPP Polygons & Label Markers once (rebuilds only when catch volumes update)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    Object.values(polygonLayersRef.current).forEach((p) => map.removeLayer(p));
    polygonLayersRef.current = {};
    labelMarkersRef.current.forEach((m) => map.removeLayer(m));
    labelMarkersRef.current = [];

    WPP_REAL_POLYGONS.forEach((wpp) => {
      const isSelected = selectedCodeRef.current === wpp.code;
      const catchesMap = catchesPerWppRef.current;
      const catchVolume =
        catchesMap[wpp.code] || catchesMap[`WPP ${wpp.code}`] || 0;

      const polygon = L.polygon(wpp.polygon, {
        color: isSelected ? "#ffffff" : wpp.borderColor,
        weight: isSelected ? 3.5 : 2,
        opacity: isSelected ? 1 : 0.9,
        fillColor: wpp.color,
        fillOpacity: isSelected ? 0.62 : 0.36,
      });

      polygon.on("click", () => {
        const currentSelected = selectedCodeRef.current;
        if (currentSelected === wpp.code) {
          map.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { duration: 0.4 });
        } else {
          map.flyTo(wpp.center, Math.max(map.getZoom(), 6), { duration: 0.45 });
        }
        onSelectWppRef.current?.(wpp.code);
      });

      polygon.on("mouseover", () => {
        setHoveredWpp(wpp);
        polygon.setStyle({
          fillOpacity: 0.65,
          weight: 3,
          color: "#ffffff",
        });
      });

      polygon.on("mouseout", () => {
        setHoveredWpp(null);
        const stillSelected = selectedCodeRef.current === wpp.code;
        polygon.setStyle({
          fillOpacity: stillSelected ? 0.62 : 0.36,
          weight: stillSelected ? 3.5 : 2,
          color: stillSelected ? "#ffffff" : wpp.borderColor,
        });
      });

      const labelIcon = L.divIcon({
        className: "custom-wpp-badge",
        html: `
          <div style="pointer-events:none;background:rgba(9, 20, 36, 0.92);backdrop-filter:blur(3px);color:#ffffff;border:1.5px solid ${wpp.color};padding:2.5px 7px;border-radius:6px;font-size:11px;font-family:Inter,system-ui,sans-serif;box-shadow:0 3px 8px rgba(0,0,0,0.45);text-align:center;min-width:64px;line-height:1.2;">
            <div style="color:${wpp.color};font-size:10.5px;font-weight:800;letter-spacing:0.3px;">WPP ${escapeHtml(wpp.code)}</div>
            <div style="font-size:9px;color:#93c5fd;font-style:italic;font-weight:600;white-space:nowrap;">${escapeHtml(wpp.ocean)}</div>
            ${catchVolume > 0 ? `<div style="color:#4ade80;font-size:8.5px;font-weight:750;margin-top:1px;">${formatWeight(catchVolume)}</div>` : ""}
          </div>
        `,
        iconSize: [80, 36],
        iconAnchor: [40, 18],
      });

      const marker = L.marker(wpp.center, {
        icon: labelIcon,
        interactive: false,
      }).addTo(map);
      labelMarkersRef.current.push(marker);

      polygon.addTo(map);
      polygonLayersRef.current[wpp.code] = polygon;
    });
  }, [catchesSignature]);

  // Update Polygon Highlight Styles smoothly when selectedWpp changes without tearing down layers
  useEffect(() => {
    WPP_REAL_POLYGONS.forEach((wpp) => {
      const polygon = polygonLayersRef.current[wpp.code];
      if (!polygon) return;
      const isSelected = normalizedSelected === wpp.code;
      polygon.setStyle({
        color: isSelected ? "#ffffff" : wpp.borderColor,
        weight: isSelected ? 3.5 : 2,
        opacity: isSelected ? 1 : 0.9,
        fillOpacity: isSelected ? 0.62 : 0.36,
      });
    });
  }, [normalizedSelected]);

  // Render Realtime Vessel Markers (Only in Regulator view)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || role !== "regulator") return;

    const vesselMarkers: L.CircleMarker[] = [];

    vessels.forEach((v) => {
      const code = normalizeWppCode(v.wppCode) || "573";
      const wpp =
        WPP_REAL_POLYGONS.find((w) => w.code === code) || WPP_REAL_POLYGONS[2];

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
        onInspectVesselRef.current?.(v);
      });

      circle.addTo(map);
      vesselMarkers.push(circle);
    });

    return () => {
      vesselMarkers.forEach((m) => map.removeLayer(m));
    };
  }, [vessels, role]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetView = () => {
    mapInstanceRef.current?.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, {
      duration: 0.45,
    });
    setHoveredWpp(null);
    if (normalizedSelected && onSelectWppRef.current) {
      onSelectWppRef.current("");
    }
  };

  const isSelectedPolygonInList = WPP_REAL_POLYGONS.some(
    (w) => w.code === normalizedSelected,
  );
  const hoveredCatchVolume = hoveredWpp
    ? catchesPerWpp[hoveredWpp.code] || catchesPerWpp[`WPP ${hoveredWpp.code}`] || 0
    : 0;

  return (
    <div className="relative isolate z-0 bg-white dark:bg-[#0f1729] border border-[#e6e9ef] dark:border-[#1f2a42] rounded-2xl overflow-hidden shadow-subtle">
      {/* Real Leaflet Map Container */}
      <div className="relative w-full h-[390px] sm:h-[450px] bg-slate-900 overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Custom Zoom Controls (Top-Left) matching UI language */}
        <div className="absolute top-3 left-3 z-20 flex flex-col rounded-xl border border-[#d9dee8] dark:border-[#2a3753] bg-white/95 dark:bg-[#0f1729]/95 backdrop-blur-md shadow-md overflow-hidden pointer-events-auto">
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoomLevel >= MAX_ZOOM}
            title="Perbesar peta"
            aria-label="Perbesar peta"
            className="w-9 h-9 border-0 bg-transparent hover:bg-[#f1f4f9] dark:hover:bg-[#141d33] text-[#0f172a] dark:text-[#e8edf7] flex items-center justify-center cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={16} strokeWidth={2} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoomLevel <= MIN_ZOOM}
            title="Perkecil peta"
            aria-label="Perkecil peta"
            className="w-9 h-9 border-0 border-t border-[#e6e9ef] dark:border-[#1f2a42] bg-transparent hover:bg-[#f1f4f9] dark:hover:bg-[#141d33] text-[#0f172a] dark:text-[#e8edf7] flex items-center justify-center cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Minus size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        {/* Floating Map Controls (Top-Right) */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2 pointer-events-auto">
          {/* Layer Segmented Control */}
          <div className="inline-flex items-center gap-1 rounded-xl border border-[#d9dee8] dark:border-[#2a3753] bg-white/95 dark:bg-[#0f1729]/95 backdrop-blur-md p-1 shadow-md">
            <button
              type="button"
              onClick={() => setMapTileStyle("standard")}
              aria-pressed={mapTileStyle === "standard"}
              className={`h-8 px-3 rounded-lg text-xs cursor-pointer border-0 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                mapTileStyle === "standard"
                  ? "bg-[#2563eb] hover:bg-[#1d4ed8] dark:bg-[#5b94ff] dark:hover:bg-[#78a7ff] text-white dark:text-[#0a101d] font-semibold"
                  : "bg-transparent text-[#475569] dark:text-[#98a6c0] hover:text-[#0f172a] dark:hover:text-white hover:bg-[#f1f4f9] dark:hover:bg-[#141d33] font-medium"
              }`}
            >
              <Map size={13} aria-hidden="true" />
              <span>Peta Laut</span>
            </button>
            <button
              type="button"
              onClick={() => setMapTileStyle("satellite")}
              aria-pressed={mapTileStyle === "satellite"}
              className={`h-8 px-3 rounded-lg text-xs cursor-pointer border-0 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                mapTileStyle === "satellite"
                  ? "bg-[#2563eb] hover:bg-[#1d4ed8] dark:bg-[#5b94ff] dark:hover:bg-[#78a7ff] text-white dark:text-[#0a101d] font-semibold"
                  : "bg-transparent text-[#475569] dark:text-[#98a6c0] hover:text-[#0f172a] dark:hover:text-white hover:bg-[#f1f4f9] dark:hover:bg-[#141d33] font-medium"
              }`}
            >
              <Eye size={13} aria-hidden="true" />
              <span>Satelit</span>
            </button>
          </div>

          {/* Reset View Button */}
          <button
            type="button"
            onClick={handleResetView}
            title="Pusatkan Peta Nusantara"
            className="h-[42px] px-3.5 rounded-xl border border-[#d9dee8] dark:border-[#2a3753] bg-white/95 dark:bg-[#0f1729]/95 hover:bg-[#f1f4f9] dark:hover:bg-[#141d33] backdrop-blur-md text-[#0f172a] dark:text-[#e8edf7] flex items-center gap-1.5 cursor-pointer transition-colors shadow-md text-xs font-semibold active:scale-95 whitespace-nowrap"
          >
            <RotateCcw size={13} className="text-[#64718a] dark:text-[#98a6c0]" aria-hidden="true" />
            <span>Pusatkan</span>
          </button>
        </div>

        {/* Floating In-Map Legend (Bottom-Left) */}
        <div className="absolute bottom-3 left-3 z-20 px-3 py-2 rounded-xl bg-white/95 dark:bg-[#0f1729]/95 backdrop-blur-md border border-[#d9dee8] dark:border-[#2a3753] text-[#0f172a] dark:text-[#e8edf7] shadow-md pointer-events-auto flex items-center gap-2.5 text-xs font-medium">
          {role === "regulator" ? (
            <>
              <span className="text-[#64718a] dark:text-[#98a6c0] font-semibold uppercase text-[10px]">
                Status Kuota:
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Aman</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Waspada</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>Kritis</span>
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#2563eb] border border-blue-400/50" />
                <span className="font-semibold">
                  Batas 11 Wilayah WPP
                </span>
              </span>
              {isSelectedPolygonInList ? (
                <>
                  <span className="text-[#cbd5e1] dark:text-[#334155]">·</span>
                  <button
                    type="button"
                    onClick={() => onSelectWppRef.current?.("")}
                    className="inline-flex items-center gap-1 border-0 bg-transparent p-0 text-xs font-semibold text-[#2563eb] dark:text-[#5b94ff] hover:underline cursor-pointer"
                  >
                    <span>Filter aktif: WPP {normalizedSelected}</span>
                    <X size={12} aria-hidden="true" />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-[#cbd5e1] dark:text-[#334155] hidden sm:inline">
                    ·
                  </span>
                  <span className="text-[#64718a] dark:text-[#98a6c0] hidden sm:inline">
                    Klik zona untuk filter tabel
                  </span>
                </>
              )}
            </>
          )}
        </div>

        {/* Floating Detail Card on Bottom-Right of Map (Never covers Top-Right buttons) */}
        {hoveredWpp && (
          <div className="hidden sm:flex absolute bottom-3 right-3 z-20 max-w-xs p-3.5 rounded-xl bg-white/95 dark:bg-[#0f1729]/95 backdrop-blur-md border border-[#d9dee8] dark:border-[#2a3753] text-[#0f172a] dark:text-[#e8edf7] shadow-popover items-start gap-3 pointer-events-none">
            <div className="w-8 h-8 rounded-lg bg-[#eef3ff] dark:bg-[#14264d] text-[#2563eb] dark:text-[#5b94ff] flex items-center justify-center shrink-0 mt-0.5">
              <Info size={16} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-[#2563eb] dark:text-[#5b94ff]">
                  WPP {hoveredWpp.code}
                </span>
                <span className="text-[11px] text-[#64718a] dark:text-[#98a6c0] font-medium truncate">
                  {hoveredWpp.ocean}
                </span>
              </div>
              <h4 className="m-0 text-xs font-bold text-ink dark:text-[#e8edf7] truncate mt-0.5">
                {hoveredWpp.name}
              </h4>
              <p className="m-0 text-[11px] text-[#64718a] dark:text-[#98a6c0] mt-1 leading-relaxed">
                {hoveredWpp.description}
              </p>

              {role === "regulator" ? (
                <div className="mt-2 pt-2 border-t border-[#e6e9ef] dark:border-[#1f2a42] flex items-center justify-between text-[11px]">
                  <span className="text-[#64718a] dark:text-[#98a6c0]">
                    Armada:{" "}
                    <strong className="text-[#0f172a] dark:text-white font-mono">
                      {
                        vessels.filter(
                          (v) =>
                            (normalizeWppCode(v.wppCode) || "573") ===
                            hoveredWpp.code,
                        ).length
                      }{" "}
                      kapal
                    </strong>
                  </span>
                  <span className="text-[#64718a] dark:text-[#98a6c0]">
                    Total:{" "}
                    <strong className="text-[#2563eb] dark:text-[#5b94ff] font-mono">
                      {formatWeight(hoveredCatchVolume)}
                    </strong>
                  </span>
                </div>
              ) : (
                <div className="mt-2 pt-2 border-t border-[#e6e9ef] dark:border-[#1f2a42] text-[11px] text-[#2563eb] dark:text-[#5b94ff] font-medium">
                  {hoveredCatchVolume > 0
                    ? `Total tangkapan: ${formatWeight(hoveredCatchVolume)}`
                    : normalizedSelected === hoveredWpp.code
                      ? "Klik lagi untuk menghapus filter tabel"
                      : "Klik zona untuk memfilter tabel WPP"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
