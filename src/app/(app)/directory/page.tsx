'use client';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DirectoryListing } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

function Rating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < Math.floor(rating) ? 'text-primary fill-primary' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">({reviews} reviews)</span>
    </div>
  );
}

function ListingCard({ listing }: { listing: DirectoryListing }) {
  const image = PlaceHolderImages.find((img) => img.id === listing.image);
  return (
    <Card>
      <CardHeader className="p-0">
        {image && (
          <div className="relative h-48 w-full">
            <Image
              src={image.imageUrl}
              alt={listing.name}
              fill
              className="rounded-t-lg object-cover"
              data-ai-hint={image.imageHint}
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <CardTitle className="font-headline text-lg">{listing.name}</CardTitle>
        <Rating rating={listing.rating} reviews={listing.reviews} />
      </CardContent>
      <CardFooter className="p-4">
        <ListingDetailsSheet listing={listing} />
      </CardFooter>
    </Card>
  );
}

function ListingDetailsSheet({ listing }: { listing: DirectoryListing }) {
    const image = PlaceHolderImages.find((img) => img.id === listing.image);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          View Details
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-lg w-full">
        <SheetHeader>
          <SheetTitle className="font-headline text-2xl">{listing.name}</SheetTitle>
          <div className="pt-2">
            <Badge>{listing.category}</Badge>
          </div>
        </SheetHeader>
        <div className="py-6 space-y-4">
            {image && (
                <div className="relative h-60 w-full">
                    <Image
                    src={image.imageUrl}
                    alt={listing.name}
                    fill
                    className="rounded-lg object-cover"
                    data-ai-hint={image.imageHint}
                    />
                </div>
            )}
            <Rating rating={listing.rating} reviews={listing.reviews} />
            <SheetDescription>{listing.description}</SheetDescription>
            <Button className="w-full">Contact: {listing.contact}</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DirectoryTab({ category, sortBy }: { category: DirectoryListing['category'], sortBy: string }) {
  const firestore = useFirestore();
  const listingsQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'localServices'), where('category', '==', category));
  }, [firestore, category]);

  const { data: listingsData } = useCollection<DirectoryListing>(listingsQuery);

  const listings = useMemo(() => {
    if (!listingsData) return [];

    return [...listingsData].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviews - a.reviews;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [listingsData, sortBy]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}

export default function DirectoryPage() {
  const [sortBy, setSortBy] = useState('rating');
  const categories: DirectoryListing['category'][] = [
    'Plumbers',
    'Electricians',
    'Doctors',
    'Tiffin',
    'Repair Shops'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="reviews">Reviews</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Tabs defaultValue="Plumbers" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="mt-6">
          {categories.map((cat) => (
            <TabsContent key={cat} value={cat}>
              <DirectoryTab category={cat} sortBy={sortBy} />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
