import type { RailwayGate } from '@/types';
import { GateListItem } from './gate-list-item';

interface GateListProps {
  gates: RailwayGate[];
}

export function GateList({ gates }: GateListProps) {
  if (gates.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No railway gates to display.</p>;
  }

  return (
    <div className="space-y-4">
      {gates.map((gate) => (
        <GateListItem key={gate.id} gate={gate} />
      ))}
    </div>
  );
}
