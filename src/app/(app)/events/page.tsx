'use client';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { LocalEvent } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, Timestamp } from 'firebase/firestore';

export default function EventsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  const firestore = useFirestore();
  const eventsQuery = useMemoFirebase(() => collection(firestore, 'events'), [firestore]);
  const { data: mockEvents } = useCollection<LocalEvent>(eventsQuery);

  const filteredEvents = useMemo(() => {
    let events: LocalEvent[] = mockEvents || [];

    if (date) {
      events = events.filter(event => {
        const eventDate = (event.date as unknown as Timestamp).toDate();
        return eventDate.toDateString() === date.toDateString();
      });
    }
    if (categoryFilter !== 'all') {
      events = events.filter(event => event.category.toLowerCase() === categoryFilter);
    }
    if (locationFilter !== 'all') {
      events = events.filter(event => event.location.toLowerCase().replace(' ', '-') === locationFilter);
    }
    return events;
  }, [date, categoryFilter, locationFilter, mockEvents]);
  
  const eventsForCalendar = date ? filteredEvents : (mockEvents || []);

  const categories = [...new Set((mockEvents || []).map(e => e.category))];
  const locations = [...new Set((mockEvents || []).map(e => e.location))];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="lg:w-1/3 xl:w-1/4">
        <Card>
          <CardContent className="p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
              modifiers={{
                hasEvent: (mockEvents || []).map((e) => (e.date as unknown as Timestamp).toDate()),
              }}
              modifiersStyles={{
                hasEvent: {
                  position: 'relative',
                  color: 'hsl(var(--primary-foreground))',
                  backgroundColor: 'hsl(var(--primary))'
                },
              }}
            />
          </CardContent>
        </Card>
        <div className="space-y-4 mt-6">
            <h3 className="font-headline text-lg font-semibold">Filters</h3>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                    <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map(loc => (
                      <SelectItem key={loc} value={loc.toLowerCase().replace(' ', '-')}>{loc}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
             <Button variant="outline" onClick={() => {
                setDate(undefined);
                setCategoryFilter('all');
                setLocationFilter('all');
             }} className="w-full">Clear Filters</Button>
        </div>
      </aside>
      <main className="flex-1">
        <h2 className="text-2xl font-bold font-headline mb-6">
          {date ? `Events for ${format(date, 'MMMM do, yyyy')}` : 'All Upcoming Events'}
        </h2>
        <div className="space-y-6">
          {eventsForCalendar.length > 0 ? (
            eventsForCalendar.map((event) => {
              const image = PlaceHolderImages.find((i) => i.id === event.image);
              return (
                <Card key={event.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {image && (
                      <div className="relative h-48 md:h-auto md:w-1/3">
                        <Image
                          src={image.imageUrl}
                          alt={event.title}
                          fill
                          className="object-cover"
                          data-ai-hint={image.imageHint}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle className="font-headline text-xl">{event.title}</CardTitle>
                            <Badge variant={event.category === 'Music' || event.category === 'Art' ? 'secondary' : 'default'}>{event.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                      </CardHeader>
                      <CardContent>
                        <p>{event.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button>RSVP</Button>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No events scheduled for this day/filter.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
