export interface RailwayGate {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: 'open' | 'closed';
  estimatedWaitTime: string; // e.g., "5 min", "N/A"
}
