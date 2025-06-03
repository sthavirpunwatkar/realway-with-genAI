import { TrainFront } from 'lucide-react';
import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <TrainFront size={32} />
          <h1 className="text-2xl font-headline font-semibold">RailWatch</h1>
        </Link>
        {/* Navigation items can be added here if needed */}
      </div>
    </header>
  );
}
