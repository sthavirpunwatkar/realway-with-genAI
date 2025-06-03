
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils, Building2 } from 'lucide-react';

export function NearbyPlacesPanel() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Utensils className="h-5 w-5 text-primary" /> Nearby Places & Restaurants
        </CardTitle>
        <CardDescription>
          Discover restaurants, cafes, and points of interest near selected locations.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center py-12">
        <Building2 className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-muted-foreground mb-2">Feature Coming Soon!</h3>
        <p className="text-muted-foreground">
          We're working on integrating a live feed of nearby amenities.
          Soon you'll be able to find the best spots around!
        </p>
      </CardContent>
    </Card>
  );
}
