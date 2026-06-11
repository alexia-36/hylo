"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// emoji marker
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

function ChangeMapView({
  coords,
  zoom,
}: {
  coords: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!coords) return;

    map.flyTo(coords, zoom, {
      animate: true,
      duration: 1.2,
    });
  }, [coords, zoom, map]);

  return null;
}

export default function Map({ cityName }: { cityName: string }) {
  const [coords, setCoords] = useState<[number, number]>([51.505, -0.09]);

  const [zoom, setZoom] = useState(10);
  const [loading, setLoading] = useState(false);

  async function getCoords(city: string) {
    try {
      setLoading(true);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(city)}` +
          `&format=json` +
          `&limit=1` +
          `&addressdetails=1`,
      );

      const data = await res.json();

      if (!data?.length) return;

      const place = data[0];

      const lat = parseFloat(place.lat);
      const lon = parseFloat(place.lon);

      setCoords([lat, lon]);

      // zoom
      let newZoom = 10;

      switch (place.type) {
        case "country":
          newZoom = 4;
          break;
        case "state":
        case "administrative":
          newZoom = 6;
          break;
        case "city":
        case "town":
          newZoom = 11;
          break;
        case "village":
          newZoom = 13;
          break;
        default:
          newZoom = 10;
      }

      setZoom(newZoom);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (cityName) getCoords(cityName);
    }, 400);

    return () => clearTimeout(timer);
  }, [cityName]);

  return (
    <div className="relative w-full md:h-135 max-w-md overflow-hidden rounded-3xl border border-[rgb(45,213,255)] bg-[linear-gradient(135deg,rgba(5,30,45,0.96),rgba(10,55,65,0.92),rgba(0,20,30,0.88))] p-6 text-white backdrop-blur-md">
      <div className="relative z-10">
        <div className="mb-5 border-b border-white/20 pb-4">
          <p className="text-xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-teal-300 bg-clip-text text-transparent">
            Location Map
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 shadow-xl md:mt-13">
          <div className="h-64 md:h-80 w-full relative">
            {loading && (
              <div className="absolute inset-0 z-[999] bg-black/30 flex items-center justify-center text-cyan-200">
                Loading...
              </div>
            )}

            <MapContainer
              center={[51.505, -0.09]}
              zoom={5}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <Marker position={coords} icon={customIcon}>
                <Popup>{cityName}</Popup>
              </Marker>

              <ChangeMapView coords={coords} zoom={zoom} />
            </MapContainer>
          </div>
        </div>

        <div className="mt-4 px-4 py-3 rounded-xl bg-white/5">
          <p className="text-xs text-cyan-100/70 text-center">📍 {cityName}</p>
        </div>
      </div>
    </div>
  );
}
