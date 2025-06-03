"use client";

import type { RailwayGate } from '@/types';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { DoorClosed, DoorOpen } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MapDisplayProps {
  gates: RailwayGate[];
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
}

export function MapDisplay({ gates, defaultCenter, defaultZoom = 12 }: MapDisplayProps) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  useEffect(() => {
    // Ensure this only runs on the client
    setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || null);
    if (!defaultCenter && gates.length > 0) {
      setMapCenter({ lat: gates[0].latitude, lng: gates[0].longitude });
    } else if (defaultCenter) {
      setMapCenter(defaultCenter);
    } else {
      // Default to a generic location if no gates and no default center
      setMapCenter({ lat: 37.7749, lng: -122.4194 });
    }
  }, [gates, defaultCenter]);

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
          defaultCenter={mapCenter}
          defaultZoom={defaultZoom}
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
