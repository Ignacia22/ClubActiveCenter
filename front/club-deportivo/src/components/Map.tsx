// src/components/Map.tsx
'use client';

import React from 'react';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';

interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  markers?: Array<{
    lat: number;
    lng: number;
    title?: string;
  }>;
}

const Map: React.FC<MapProps> = ({ 
  center, 
  zoom = 12,
  markers = []
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-100">
        Error al cargar el mapa
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-100">
        Cargando...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerClassName="w-full h-[400px]"
      center={center}
      zoom={zoom}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
        scrollwheel: true,
        fullscreenControl: true,
      }}
    >
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={{ lat: marker.lat, lng: marker.lng }}
          title={marker.title}
        />
      ))}
    </GoogleMap>
  );
};

export default Map;