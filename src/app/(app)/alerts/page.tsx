'use client';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { SafetyAlert } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Info, Siren, TriangleAlert } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function SafetyAlertsPage() {
  const firestore = useFirestore();
  const alertsQuery = useMemoFirebase(() => collection(firestore, 'emergencyAlerts'), [firestore]);
  const { data: mockAlerts } = useCollection<SafetyAlert>(alertsQuery);

  const getAlertIcon = (severity: 'Low' | 'Medium' | 'High') => {
    switch (severity) {
      case 'High':
        return <Siren className="h-5 w-5" />;
      case 'Medium':
        return <TriangleAlert className="h-5 w-5" />;
      case 'Low':
        return <Info className="h-5 w-5" />;
    }
  };

  const getAlertVariant = (severity: 'Low' | 'Medium' | 'High') => {
    switch (severity) {
      case 'High':
        return 'destructive';
      default:
        return 'default';
    }
  };
  
    const getAlertClass = (severity: 'Low' | 'Medium' | 'High') => {
    switch (severity) {
      case 'High':
        return 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive';
      case 'Medium':
        return 'border-yellow-500/50 text-yellow-700 dark:border-yellow-600 [&>svg]:text-yellow-600 bg-yellow-50';
       case 'Low':
        return 'border-blue-500/50 text-blue-700 dark:border-blue-600 [&>svg]:text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold font-headline">Emergency & Safety Alerts</h2>
        <div className="space-y-4">
            {(mockAlerts || []).map(alert => (
                <Alert key={alert.id} variant={getAlertVariant(alert.severity)} className={cn(getAlertClass(alert.severity))}>
                    {getAlertIcon(alert.severity)}
                    <AlertTitle className="font-bold flex justify-between items-center">
                        <span>{alert.title} - <span className="font-normal">{alert.location}</span></span>
                        <span className="font-mono text-xs font-normal">{alert.time}</span>
                    </AlertTitle>
                    <AlertDescription>
                        {alert.description}
                    </AlertDescription>
                </Alert>
            ))}
        </div>
    </div>
  );
}
