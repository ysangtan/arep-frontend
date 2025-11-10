import { Priority } from '@/types/requirement.types';
import { cn } from '@/lib/utils';
import { AlertCircle, Circle, MinusCircle } from 'lucide-react';

interface PriorityIndicatorProps {
  priority: Priority;
  showLabel?: boolean;
  className?: string;
}

export function PriorityIndicator({ priority, showLabel = false, className }: PriorityIndicatorProps) {
  const config = {
    high: {
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      label: 'High',
    },
    medium: {
      icon: Circle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      label: 'Medium',
    },
    low: {
      icon: MinusCircle,
      color: 'text-gray-500',
      bgColor: 'bg-gray-50',
      label: 'Low',
    },
  };

  const { icon: Icon, color, bgColor, label } = config[priority];

  if (showLabel) {
    return (
      <div className={cn('inline-flex items-center space-x-2 px-2 py-1 rounded-lg', bgColor, className)}>
        <Icon className={cn('w-4 h-4', color)} />
        <span className={cn('text-sm font-medium', color)}>{label}</span>
      </div>
    );
  }

  return (
    <div className={cn('inline-flex items-center', className)}>
      <Icon className={cn('w-4 h-4', color)} />
    </div>
  );
}
