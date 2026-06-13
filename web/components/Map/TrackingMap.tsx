"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Next.js
const iconDefaultProto = L.Icon.Default.prototype as unknown as { _getIconUrl?: string };
delete iconDefaultProto._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface TrackingMapProps {
  origin: string;
  destination: string;
  currentLocation: string;
  status: string;
  coordinates?: {
    origin: { lat: number; lng: number };
    destination: { lat: number; lng: number };
    current?: { lat: number; lng: number };
  };
}

// Simple geocoding helper
const getApproximateCoordinates = (location: string): { lat: number; lng: number } => {
  const cityMap: Record<string, { lat: number; lng: number }> = {
    "istanbul": { lat: 41.0082, lng: 28.9784 },
    "turkey": { lat: 39.9334, lng: 32.8597 },
    "new york": { lat: 40.7128, lng: -74.0060 },
    "london": { lat: 51.5074, lng: -0.1278 },
    "paris": { lat: 48.8566, lng: 2.3522 },
    "tokyo": { lat: 35.6762, lng: 139.6503 },
    "dubai": { lat: 25.2048, lng: 55.2708 },
    "los angeles": { lat: 34.0522, lng: -118.2437 },
    "chicago": { lat: 41.8781, lng: -87.6298 },
    "usa": { lat: 39.8283, lng: -98.5795 },
  };

  const lowerLocation = location.toLowerCase();
  for (const [key, coords] of Object.entries(cityMap)) {
    if (lowerLocation.includes(key)) {
      return coords;
    }
  }
  return { lat: 39.8283, lng: -98.5795 };
};

export default function TrackingMap({ origin, destination, currentLocation, status, coordinates }: TrackingMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Layer[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Initialize map only once
  useEffect(() => {
    // Wait for DOM to be ready and container to exist
    if (!mapContainerRef.current || mapRef.current) return;

    // Small delay to ensure DOM is fully painted
    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      // Get coordinates
      const originCoords = coordinates?.origin || getApproximateCoordinates(origin);
      const destCoords = coordinates?.destination || getApproximateCoordinates(destination);
      const currentCoords = coordinates?.current || getApproximateCoordinates(currentLocation);

      // Calculate bounds
      const bounds = L.latLngBounds([originCoords, destCoords]);
      if (currentCoords) bounds.extend(currentCoords);

      try {
        // Initialize map
        const map = L.map(mapContainerRef.current, {
          center: bounds.getCenter(),
          zoom: 3,
          zoomControl: true,
          fadeAnimation: true,
          zoomAnimation: true,
          markerZoomAnimation: true,
        });

        map.fitBounds(bounds, { padding: [50, 50] });

        // Add tile layer
        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
          minZoom: 3,
        }).addTo(map);

        mapRef.current = map;
        setIsReady(true);
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setIsReady(false);
      }
    };
  }, []); // Empty dependency array - initialize once

  // Add markers and routes when map is ready OR when props change
  useEffect(() => {
    if (!mapRef.current || !isReady) return;

    const map = mapRef.current;

    // Clear existing markers/layers
    markersRef.current.forEach(layer => {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });
    markersRef.current = [];

    // Get coordinates
    const originCoords = coordinates?.origin || getApproximateCoordinates(origin);
    const destCoords = coordinates?.destination || getApproximateCoordinates(destination);
    const currentCoords = coordinates?.current || getApproximateCoordinates(currentLocation);

    // Custom marker icons
    const originIcon = L.divIcon({
      className: "custom-marker",
      html: `<div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
              </svg>
             </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    const destIcon = L.divIcon({
      className: "custom-marker",
      html: `<div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
             </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    const currentIcon = L.divIcon({
      className: "custom-marker",
      html: `<div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white" style="animation: pulse 1.5s infinite;">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
             </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    // Add markers
    const originMarker = L.marker(originCoords, { icon: originIcon })
      .bindPopup(`<strong>Origin</strong><br/>${origin}`, { closeButton: false });
    
    const destMarker = L.marker(destCoords, { icon: destIcon })
      .bindPopup(`<strong>Destination</strong><br/>${destination}`, { closeButton: false });

    originMarker.addTo(map);
    destMarker.addTo(map);
    markersRef.current.push(originMarker, destMarker);

    // Add current location marker
    let currentMarker: L.Marker | null = null;
    if (status !== "delivered" && currentCoords) {
      currentMarker = L.marker(currentCoords, { icon: currentIcon })
        .bindPopup(`<strong>Current Location</strong><br/>${currentLocation}<br/><span class="text-xs text-blue-600">Last known position</span>`, { closeButton: false });
      currentMarker.addTo(map);
      markersRef.current.push(currentMarker);
      
      // Auto-open popup with delay
      setTimeout(() => {
        if (currentMarker && mapRef.current) {
          currentMarker.openPopup();
        }
      }, 500);
    }

    // Draw route line
    const routePoints: L.LatLngExpression[] = [originCoords];
    if (currentCoords && status !== "delivered") {
      routePoints.push(currentCoords);
    }
    routePoints.push(destCoords);
    
    const routeLine = L.polyline(routePoints, {
      color: "#3b82f6",
      weight: 3,
      opacity: 0.7,
      lineJoin: "round",
      dashArray: "8, 8",
    }).addTo(map);
    markersRef.current.push(routeLine);

    // Add completed route portion
    if (status !== "delivered" && currentCoords) {
      const progressLine = L.polyline([originCoords, currentCoords], {
        color: "#22c55e",
        weight: 3,
        opacity: 0.9,
        lineJoin: "round",
      }).addTo(map);
      markersRef.current.push(progressLine);
    }

    // Fit bounds to show all markers
    const allBounds = L.latLngBounds([originCoords, destCoords]);
    if (currentCoords) allBounds.extend(currentCoords);
    map.fitBounds(allBounds, { padding: [50, 50] });

  }, [isReady, origin, destination, currentLocation, status, coordinates]);

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="text-gray-600">Origin</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-blue-600 rounded-full" style={{ animation: 'pulse 1.5s infinite' }}></div>
                <span className="text-gray-600">Current Location</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span className="text-gray-600">Destination</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-0.5 bg-blue-500"></div>
                <span className="text-gray-600">Route</span>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              Approximate location
            </div>
          </div>
        </div>
        <div 
          ref={mapContainerRef} 
          className="w-full h-[400px] md:h-[450px] bg-gray-50"
          style={{ minHeight: "300px" }}
        />
      </div>
      
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}