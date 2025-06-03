
"use client";

import type { RailwayGate } from '@/types';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { DoorClosed, DoorOpen } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MapDisplayProps {
  gates: RailwayGate[];
  center?: { lat: number; lng: number }; // Changed from defaultCenter, now fully controlled
  defaultZoom?: number;
}

export function MapDisplay({ gates, center: centerProp, defaultZoom = 12 }: MapDisplayProps) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  // mapCenter internal state will sync with centerProp
  const [mapCenter, setMapCenter] = useState(centerProp); 

  useEffect(() => {
    // Ensure this only runs on the client
    setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || null);
  }, []);

  useEffect(() => {
    // Update internal mapCenter when centerProp changes
    if (centerProp) {
      setMapCenter(centerProp);
    } else if (gates.length > 0) {
      // Fallback to first gate if centerProp is not provided
      setMapCenter({ lat: gates[0].latitude, lng: gates[0].longitude });
    } else {
      // Ultimate fallback if no centerProp and no gates
      setMapCenter({ lat: 37.7749, lng: -122.4194 });
    }
  }, [centerProp, gates]);

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
        <p className="text-muted-foreground">Loading map... (API key may be missing)</p>
      </div>
    );
  }

  if (!mapCenter) {
     return (
      <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
        <p className="text-muted-foreground">Loading map data...</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div style={{ height: '500px', width: '100%' }} className="rounded-lg overflow-hidden shadow-lg">
        <Map
          center={mapCenter} // Use controlled 'center' prop
          zoom={defaultZoom} // Use 'zoom' not 'defaultZoom' if you want it controlled too, or keep 'defaultZoom' for initial
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          mapId="railwatch-map"
        >
          {gates.map((gate) => (
            <AdvancedMarker
              key={gate.id}
              position={{ lat: gate.latitude, lng: gate.longitude }}
              title={gate.name}
            >
              <div className="p-1 rounded-full shadow-md" style={{ background: gate.status === 'open' ? 'hsl(var(--accent))' : 'hsl(var(--destructive))' }}>
                {gate.status === 'open' ? (
                  <DoorOpen size={24} className="text-accent-foreground" />
                ) : (
                  <DoorClosed size={24} className="text-destructive-foreground" />
                )}
              </div>
            </AdvancedMarker>
          ))}
        </Map>
      </div>
    </APIProvider>
  );
}
