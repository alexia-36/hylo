"use client";

import { useEffect } from "react";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  places: {
    name: string;
    latitude: number;
    longitude: number;
  }[];
};

const customIcon = L.divIcon({
  html: `
    <div style="
      font-size:30px;
      transform: translate(-50%, -100%);
      filter: drop-shadow(0 0 8px rgba(34,211,238,.55));
    ">
      📍
    </div>
  `,
  className: "",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

function FitBounds({ places }: Props) {
  const map = useMap();

  useEffect(() => {
    if (places.length === 0) return;

    const bounds = L.latLngBounds(
      places.map((place) => [place.latitude, place.longitude]),
    );

    map.fitBounds(bounds, {
      padding: [50, 50],
    });
  }, [places, map]);

  return null;
}

export default function ProfileMap({ places }: Props) {
  if (places.length === 0) {
    return (
      <div className="rounded-3xl border border-cyan-500/20 bg-white/5 backdrop-blur-md p-6">
        <h2 className="mb-4 text-xl font-bold text-white">
          Visited Places Map
        </h2>

        <p className="text-white/70">No visited places yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-white/5 backdrop-blur-md p-6">
      <h2 className="mb-4 text-xl font-bold text-white">Visited Places Map</h2>

      <div className="overflow-hidden rounded-2xl border border-white/10 shadow-xl">
        <div className="h-[500px] w-full">
          <MapContainer
            center={[20, 0]}
            zoom={2}
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}" />

            <FitBounds places={places} />

            {places.map((place) => (
              <Marker
                key={`${place.name}-${place.latitude}-${place.longitude}`}
                position={[place.latitude, place.longitude]}
                icon={customIcon}
              >
                <Popup>{place.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <p className="mt-3 text-sm text-white/60">
        {places.length} visited places
      </p>
    </div>
  );
}
