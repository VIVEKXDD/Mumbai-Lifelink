import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="bg-primary text-primary-foreground p-2 rounded-md">
        <Zap className="h-6 w-6" />
      </div>
      <h1 className="text-xl font-bold font-headline text-primary">
        Mumbai LifeLink
      </h1>
    </div>
  );
}
