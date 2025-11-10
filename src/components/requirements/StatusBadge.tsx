import { RequirementStatus } from '@/types/requirement.types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: RequirementStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig: Record<RequirementStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    'draft': { label: 'Draft', variant: 'secondary' },
    'in-review': { label: 'In Review', variant: 'default' },
    'approved': { label: 'Approved', variant: 'default' },
    'rejected': { label: 'Rejected', variant: 'destructive' },
    'implemented': { label: 'Implemented', variant: 'default' },
    'verified': { label: 'Verified', variant: 'default' },
    'closed': { label: 'Closed', variant: 'outline' },
  };

  const config = statusConfig[status];

  // Custom color classes based on AREP design
  const colorClasses: Record<RequirementStatus, string> = {
    'draft': 'bg-gray-100 text-gray-700 hover:bg-gray-100',
    'in-review': 'bg-amber-100 text-amber-700 hover:bg-amber-100',
    'approved': 'bg-green-100 text-green-700 hover:bg-green-100',
    'rejected': 'bg-red-100 text-red-700 hover:bg-red-100',
    'implemented': 'bg-blue-100 text-blue-700 hover:bg-blue-100',
    'verified': 'bg-purple-100 text-purple-700 hover:bg-purple-100',
    'closed': 'bg-gray-200 text-gray-600 hover:bg-gray-200',
  };

  return (
    <Badge
      variant={config.variant}
      className={cn(colorClasses[status], 'font-medium', className)}
    >
      {config.label}
    </Badge>
  );
}
