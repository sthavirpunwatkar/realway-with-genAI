
import type { RailwayGate } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DoorOpen, DoorClosed, Clock, MapPin, RefreshCw } from 'lucide-react';
import { RailwayCrossingIcon } from '../icons/railway-crossing-icon';
import { Button } from '@/components/ui/button';

interface GateListItemProps {
  gate: RailwayGate;
  onToggleStatus: (gateId: string) => void;
}

export function GateListItem({ gate, onToggleStatus }: GateListItemProps) {
  const isOpen = gate.status === 'open';
  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium font-headline flex items-center gap-2">
          <RailwayCrossingIcon className="h-5 w-5 text-primary" />
          {gate.name}
        </CardTitle>
        <Badge variant={isOpen ? 'default' : 'destructive'} className={isOpen ? 'bg-accent text-accent-foreground' : ''}>
          {isOpen ? <DoorOpen className="mr-2 h-4 w-4" /> : <DoorClosed className="mr-2 h-4 w-4" />}
          {gate.status.charAt(0).toUpperCase() + gate.status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-muted-foreground space-y-2">
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span>Estimated Wait: {gate.estimatedWaitTime}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            <span>Location: {gate.latitude.toFixed(4)}, {gate.longitude.toFixed(4)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <Button onClick={() => onToggleStatus(gate.id)} variant="outline" size="sm" className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Toggle Status
        </Button>
      </CardFooter>
    </Card>
  );
}
