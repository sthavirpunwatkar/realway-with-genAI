
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Utensils, Star, MapPin as TouristSpotIcon, Zap, ExternalLink, Image as ImageIcon, FerrisWheel } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  cuisine: string;
  imageUrl: string;
  aiHint: string;
}

interface TouristPlace {
  id: string;
  name: string;
  type: string;
  activities: string[];
  imageUrl: string;
  aiHint: string;
}

const mockRestaurants: Restaurant[] = [
  { id: 'r1', name: 'The Gourmet Spot', rating: 4.5, cuisine: 'Italian', imageUrl: 'https://placehold.co/300x200.png', aiHint: 'gourmet food' },
  { id: 'r2', name: 'Pizza Haven', rating: 4.0, cuisine: 'Pizza', imageUrl: 'https://placehold.co/300x200.png', aiHint: 'pizza restaurant' },
  { id: 'r3', name: 'Café Central', rating: 4.2, cuisine: 'Coffee & Pastries', imageUrl: 'https://placehold.co/300x200.png', aiHint: 'coffee shop' },
];

const mockTouristPlaces: TouristPlace[] = [
  { id: 't1', name: 'City Park Oasis', type: 'Park', activities: ['Walking', 'Picnics', 'Playground'], imageUrl: 'https://placehold.co/300x200.png', aiHint: 'city park' },
  { id: 't2', name: 'Grand Historical Museum', type: 'Museum', activities: ['Exhibits', 'Guided Tours', 'Workshops'], imageUrl: 'https://placehold.co/300x200.png', aiHint: 'museum building' },
  { id: 't3', name: 'Riverfront Promenade', type: 'Scenic Walkway', activities: ['Boating', 'Cycling', 'Sunset Views'], imageUrl: 'https://placehold.co/300x200.png', aiHint: 'river walk' },
];

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-yellow-400" />);
  }
  if (halfStar) {
    stars.push(<Star key="half" className="h-4 w-4 text-yellow-400 fill-yellow-200" />); // Simple half-star representation
  }
  for (let i = stars.length; i < 5; i++) {
    stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
  }
  return <div className="flex items-center">{stars} <span className="ml-1 text-xs text-muted-foreground">({rating.toFixed(1)})</span></div>;
};

export function NearbyPlacesPanel() {
  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <TouristSpotIcon className="h-6 w-6 text-primary" /> Discover Nearby
        </CardTitle>
        <CardDescription>
          Explore restaurants and tourist attractions near selected locations. (Placeholder data)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Restaurants Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
            <Utensils className="h-5 w-5 text-accent" /> Top Restaurants
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockRestaurants.map((restaurant) => (
              <Card key={restaurant.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative h-40 w-full bg-muted">
                  <Image
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={restaurant.aiHint}
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-headline">{restaurant.name}</CardTitle>
                  <CardDescription>{restaurant.cuisine}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pb-4">
                  {renderStars(restaurant.rating)}
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="mr-2 h-4 w-4" /> View Menu
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        {/* Tourist Places Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
            <FerrisWheel className="h-5 w-5 text-accent" /> Popular Tourist Spots
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTouristPlaces.map((place) => (
              <Card key={place.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative h-40 w-full bg-muted">
                  <Image
                    src={place.imageUrl}
                    alt={place.name}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={place.aiHint}
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-headline">{place.name}</CardTitle>
                  <CardDescription>{place.type}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pb-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1 text-muted-foreground">Activities:</h4>
                    <div className="flex flex-wrap gap-2">
                      {place.activities.map(activity => (
                        <Badge key={activity} variant="secondary" className="text-xs">
                          <Zap className="mr-1 h-3 w-3" /> {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="mr-2 h-4 w-4" /> Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
