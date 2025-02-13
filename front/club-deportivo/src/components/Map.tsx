"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Map.tsx
import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Importar los marcadores de Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Corregir el problema de los íconos en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src, 
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
})

interface MarkerData {
  lat: number;
  lng: number;
  title: string;
}

interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  markers: MarkerData[];
}

const Map = ({ center, zoom, markers }: MapProps) => {
  useEffect(() => {
    const map = L.map('map').setView([center.lat, center.lng], zoom)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    // Añadir todos los marcadores
    markers.forEach(marker => {
      L.marker([marker.lat, marker.lng])
        .bindPopup(marker.title)
        .addTo(map)
    })

    return () => {
      map.remove()
    }
  }, [center, zoom, markers])

  return <div id="map" style={{ height: '500px', width: '100%' }} />
}

export default Map