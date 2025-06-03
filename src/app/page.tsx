
"use client";

import { AppHeader } from '@/components/layout/header';
import { MapDisplay } from '@/components/dashboard/map-display';
import { GateList } from '@/components/dashboard/gate-list';
import { AiWaitTimePredictor } from '@/components/dashboard/ai-wait-time-predictor';
import { AlertSettingsPanel } from '@/components/dashboard/alert-settings-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { RailwayGate } from '@/types';
import { LayoutDashboard, Bot, BellRing, Search as SearchIcon } from 'lucide-react'; // Added SearchIcon
import { useState, type ChangeEvent } from 'react'; // Added useState and ChangeEvent
import { Input } from '@/components/ui/input'; // Added Input
import { Button } from '@/components/ui/button'; // Added Button
import { GateListItem } from '@/components/dashboard/gate-list-item'; // Added GateListItem for search results display

// Mock data for railway gates
const mockGates: RailwayGate[] = [
  { id: 'gate1', name: 'Main Street Crossing', latitude: 37.7749, longitude: -122.4194, status: 'closed', estimatedWaitTime: '8 min' },
  { id: 'gate2', name: 'Elm Avenue Gate', latitude: 37.7790, longitude: -122.4290, status: 'open', estimatedWaitTime: 'N/A' },
  { id: 'gate3', name: 'Oak Road Junction', latitude: 37.7700, longitude: -122.4100, status: 'closed', estimatedWaitTime: '12 min' },
  { id: 'gate4', name: 'Pine St. Rail Access', latitude: 37.7850, longitude: -122.4050, status: 'open', estimatedWaitTime: 'N/A' },
];

// Determine default map center. If gates exist, center on the first gate. Otherwise, use a default.
const defaultMapCenter = mockGates.length > 0 
  ? { lat: mockGates[0].latitude, lng: mockGates[0].longitude }
  : { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco if no gates

export default function RailWatchDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [destinationResults, setDestinationResults] = useState<RailwayGate[]>([]);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    if (!event.target.value.trim()) {
      setDestinationResults([]);
      setSearchAttempted(false);
    }
  };

  const performSearch = () => {
    setSearchAttempted(true);
    if (!searchQuery.trim()) {
      setDestinationResults([]);
      return;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    const foundGateIndex = mockGates.findIndex(gate => gate.name.toLowerCase().includes(lowerCaseQuery));

    if (foundGateIndex !== -1) {
      const results: RailwayGate[] = [];
      results.push(mockGates[foundGateIndex]);
      if (foundGateIndex + 1 < mockGates.length) {
        results.push(mockGates[foundGateIndex + 1]);
      }
      setDestinationResults(results);
    } else {
      setDestinationResults([]);
    }
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    performSearch();
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <form onSubmit={handleSearchSubmit} className="mb-6 flex gap-2 items-center">
          <Input
            type="search"
            placeholder="Search for a railway crossing (e.g., Main Street)"
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-grow shadow-sm"
            aria-label="Search Destination"
          />
          <Button type="submit" className="shadow-sm">
            <SearchIcon className="mr-2 h-4 w-4" /> Search
          </Button>
        </form>

        {searchAttempted && destinationResults.length === 0 && searchQuery.trim() !== "" && (
          <Card className="mb-6 shadow-lg bg-card">
            <CardHeader>
              <CardTitle className="font-headline">Search Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No railway crossings found matching your search for "{searchQuery}".</p>
            </CardContent>
          </Card>
        )}

        {destinationResults.length > 0 && (
          <Card className="mb-6 shadow-lg bg-card">
            <CardHeader>
              <CardTitle className="font-headline">Route Gates Near Destination</CardTitle>
              <CardDescription>
                Showing the searched gate and the next one on its route.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {destinationResults.map((gate) => (
                  <GateListItem key={`${gate.id}-search`} gate={gate} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6 shadow-sm">
            <TabsTrigger value="overview" className="font-medium text-sm py-2.5">
              <LayoutDashboard className="mr-2 h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="predict" className="font-medium text-sm py-2.5">
              <Bot className="mr-2 h-4 w-4" /> AI Predictor
            </TabsTrigger>
            <TabsTrigger value="alerts" className="font-medium text-sm py-2.5">
              <BellRing className="mr-2 h-4 w-4" /> Alert Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-headline">Real-Time Gate Map</CardTitle>
                    <CardDescription>Visual overview of railway gate statuses and locations.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MapDisplay gates={mockGates} defaultCenter={defaultMapCenter} />
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-1">
                <Card className="shadow-lg h-full">
                  <CardHeader>
                    <CardTitle className="font-headline">Gate Status List</CardTitle>
                    <CardDescription>Current status and estimated wait times for monitored gates.</CardDescription>
                  </CardHeader>
                  <CardContent className="max-h-[450px] overflow-y-auto pr-2">
                    <GateList gates={mockGates} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="predict">
            <AiWaitTimePredictor />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertSettingsPanel />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} RailWatch. All rights reserved.
      </footer>
    </div>
  );
}
