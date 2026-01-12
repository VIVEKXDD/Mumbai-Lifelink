'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Bus,
  RefreshCw,
  Search,
  TrainTrack,
  TramFront,
} from 'lucide-react';
import { TransitUpdate, TransitStatus } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

export default function TransitTrackerPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const firestore = useFirestore();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };
  
  const trainsQuery = useMemoFirebase(() => collection(firestore, 'trainUpdates'), [firestore]);
  const metroQuery = useMemoFirebase(() => collection(firestore, 'metroUpdates'), [firestore]);
  const busesQuery = useMemoFirebase(() => collection(firestore, 'busUpdates'), [firestore]);

  const { data: trainUpdates } = useCollection<Omit<TransitUpdate, 'id'>>(trainsQuery);
  const { data: metroUpdates } = useCollection<Omit<TransitUpdate, 'id'>>(metroQuery);
  const { data: busUpdates } = useCollection<Omit<TransitUpdate, 'id'>>(busesQuery);

  const getStatusBadge = (status: TransitStatus) => {
    switch (status) {
      case 'On Time':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">On Time</Badge>;
      case 'Delayed':
        return <Badge variant="destructive">Delayed</Badge>;
      case 'Crowded':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Crowded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filterData = (data: (Omit<TransitUpdate, 'id'> & {id: string})[] | null) => {
    if (!data) return [];
    if (!searchQuery) return data;
    return data.filter(item => 
      item.line.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.currentStation && item.currentStation.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };
  
  const filteredTrainUpdates = useMemo(() => filterData(trainUpdates), [searchQuery, trainUpdates]);
  const filteredMetroUpdates = useMemo(() => filterData(metroUpdates), [searchQuery, metroUpdates]);
  const filteredBusUpdates = useMemo(() => filterData(busUpdates), [searchQuery, busUpdates]);

  const TransitTable = ({ data }: { data: (Omit<TransitUpdate, 'id'> & {id: string})[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Line</TableHead>
          <TableHead>Current Station</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">ETA</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((update) => (
          <TableRow key={update.id}>
            <TableCell className="font-medium">{update.line}</TableCell>
            <TableCell>{update.currentStation}</TableCell>
            <TableCell>{getStatusBadge(update.status)}</TableCell>
            <TableCell className="text-right">{update.eta}</TableCell>
          </TableRow>
        ))}
        {data.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              No results found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search by line or station..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing} className="w-full md:w-auto">
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="trains" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trains">
            <TrainTrack className="mr-2" /> Local Trains
          </TabsTrigger>
          <TabsTrigger value="metro">
            <TramFront className="mr-2" /> Metro
          </TabsTrigger>
          <TabsTrigger value="buses">
            <Bus className="mr-2" /> Buses
          </TabsTrigger>
        </TabsList>
        <TabsContent value="trains">
          <TransitTable data={filteredTrainUpdates} />
        </TabsContent>
        <TabsContent value="metro">
          <TransitTable data={filteredMetroUpdates} />
        </TabsContent>
        <TabsContent value="buses">
          <TransitTable data={filteredBusUpdates} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
