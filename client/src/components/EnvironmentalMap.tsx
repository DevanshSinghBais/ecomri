import { MapView } from "@/components/Map";
import { useCallback } from "react";

type MapStation = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: "normal" | "watch" | "anomaly" | "high-risk";
  latest: { turbidity: number; oxygen: number };
};

const statusColor: Record<MapStation["status"], string> = {
  normal: "#3E7A5C",
  watch: "#C08A2E",
  anomaly: "#C1622B",
  "high-risk": "#A6342B",
};

export function EnvironmentalMap({
  stations,
  onStationSelect,
}: {
  stations: MapStation[];
  onStationSelect: (stationId: string) => void;
}) {
  const onMapReady = useCallback(
    (map: google.maps.Map) => {
      map.setOptions({
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#e5e1d6" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#4a5450" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#fbf9f4" }] },
          { featureType: "poi", stylers: [{ visibility: "off" }] },
          { featureType: "road", elementType: "geometry", stylers: [{ color: "#faf7ef" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#aebfc0" }] },
        ],
      });

      const bounds = new window.google.maps.LatLngBounds();
      stations.forEach(station => {
        const position = { lat: station.latitude, lng: station.longitude };
        bounds.extend(position);
        const marker = new window.google.maps.Marker({
          map,
          position,
          title: `${station.id} · ${station.name}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: station.status === "high-risk" ? 11 : 8,
            fillColor: statusColor[station.status],
            fillOpacity: 1,
            strokeColor: "#FBF9F4",
            strokeWeight: 2,
          },
        });
        const pulse = new window.google.maps.Circle({
          map,
          center: position,
          radius: station.status === "high-risk" ? 3100 : station.status === "anomaly" ? 1900 : 0,
          fillColor: statusColor[station.status],
          fillOpacity: 0.11,
          strokeOpacity: 0,
        });
        marker.addListener("click", () => onStationSelect(station.id));
        pulse.addListener("click", () => onStationSelect(station.id));
      });
      map.fitBounds(bounds, 56);
    },
    [stations, onStationSelect],
  );

  return (
    <div className="h-[380px] overflow-hidden border border-[#d9d2c6] bg-[#e5e1d6] md:h-full">
      <MapView
        className="!h-full"
        initialCenter={{ lat: 46.85, lng: -121.76 }}
        initialZoom={11}
        onMapReady={onMapReady}
      />
    </div>
  );
}
