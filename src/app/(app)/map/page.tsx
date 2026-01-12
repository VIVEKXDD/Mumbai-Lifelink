'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Building, ShoppingCart, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { mockAmenities } from '@/lib/mock-data';
import { Amenity } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function LocalMapPage() {
  const mapImage = PlaceHolderImages.find((img) => img.id === 'map-mumbai');
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [filters, setFilters] = useState({
    Business: true,
    Amenity: true,
    Interest: true,
  });

  const handleFilterChange = (type: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const filteredAmenities = mockAmenities.filter(
    (amenity) => filters[amenity.type]
  );
  
  const getIconForType = (type: Amenity['type']) => {
    switch(type) {
        case 'Business': return <ShoppingCart className="w-4 h-4 text-white" />;
        case 'Amenity': return <Building className="w-4 h-4 text-white" />;
        case 'Interest': return <Star className="w-4 h-4 text-white" />;
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-10rem)]">
      <div className="lg:w-1/4">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="business" checked={filters.Business} onCheckedChange={() => handleFilterChange('Business')} />
              <Label htmlFor="business">Businesses</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="amenity" checked={filters.Amenity} onCheckedChange={() => handleFilterChange('Amenity')} />
              <Label htmlFor="amenity">Amenities</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="interest" checked={filters.Interest} onCheckedChange={() => handleFilterChange('Interest')} />
              <Label htmlFor="interest">Points of Interest</Label>
            </div>
          </CardContent>
        </Card>
        {selectedAmenity && (
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        {getIconForType(selectedAmenity.type)}
                        {selectedAmenity.name}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">This is a detailed view for {selectedAmenity.name}. More information would be displayed here, such as operating hours, contact details, and user reviews.</p>
                    <Button className="w-full mt-4">Get Directions</Button>
                </CardContent>
            </Card>
        )}
      </div>

      <div className="flex-1 relative rounded-lg overflow-hidden border">
        {mapImage && (
          <Image
            src={mapImage.imageUrl}
            alt="Mumbai Map"
            fill
            style={{ objectFit: 'cover' }}
            data-ai-hint={mapImage.imageHint}
          />
        )}
        {filteredAmenities.map((amenity) => (
          <button
            key={amenity.id}
            className="absolute -translate-x-1/2 -translate-y-full transform focus:outline-none"
            style={{ top: amenity.position.top, left: amenity.position.left }}
            onClick={() => setSelectedAmenity(amenity)}
            aria-label={`View details for ${amenity.name}`}
          >
            <div className={cn("rounded-full p-2 animate-pulse", 
                amenity.type === 'Business' && 'bg-blue-500',
                amenity.type === 'Amenity' && 'bg-green-500',
                amenity.type === 'Interest' && 'bg-primary',
                selectedAmenity?.id === amenity.id && 'animate-none ring-2 ring-white ring-offset-2 ring-offset-primary'
            )}>
              {getIconForType(amenity.type)}
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold shadow-lg whitespace-nowrap">
              {amenity.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
