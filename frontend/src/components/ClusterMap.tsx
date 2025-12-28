// frontend/src/components/ClusterMap.tsx
import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Distance helper (km)
const getDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

type Farmer = {
  location: {
    coordinates: [number, number]; // [lng, lat]
  };
  user?: {
    name?: string;
  };
  totalStubble: number;
};

export default function ClusterMap({
  center,
  farmers,
}: {
  center: [number, number]; // [lat, lng]
  farmers: Farmer[];
}) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShouldRender(true), 200);
    return () => clearTimeout(timer);
  }, []);

  if (!shouldRender) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted animate-pulse">
        <p className="text-xs text-muted-foreground">Initializing Map...</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={10}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        // attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Hub radius */}
      <Circle
        center={center}
        radius={50000}
        pathOptions={{ color: '#10b981', fillOpacity: 0.08 }}
      />

      {/* Hub marker */}
      <Marker position={center}>
        <Popup>
          <strong>Cluster Hub</strong>
          <br />
          Central aggregation point
        </Popup>
      </Marker>

      {/* Farmers + distance lines */}
      {farmers.map((farmer, index) => {
        const farmerLatLng: [number, number] = [
          farmer.location.coordinates[1],
          farmer.location.coordinates[0],
        ];

        const distanceKm = getDistanceKm(
          center[0],
          center[1],
          farmerLatLng[0],
          farmerLatLng[1]
        ).toFixed(2);

        return (
          <div key={index}>
            {/* Line */}
            <Polyline
              positions={[center, farmerLatLng]}
              pathOptions={{
                color: '#2563eb',
                weight: 1.5,
                opacity: 0.6,
                dashArray: '6,6',
              }}
            />

            {/* Farmer point */}
            <Circle
              center={farmerLatLng}
              radius={800}
              pathOptions={{ color: '#2563eb', fillOpacity: 0.4 }}
            >
              <Popup>
                <strong>{farmer.user?.name || 'Farmer'}</strong>
                <br />
                Stubble: {farmer.totalStubble} tons
                <br />
                Distance to hub: <b>{distanceKm} km</b>
              </Popup>
            </Circle>
          </div>
        );
      })}
    </MapContainer>
  );
}
