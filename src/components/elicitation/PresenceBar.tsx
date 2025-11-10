import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

export interface ActiveUser {
  id: string;
  name: string;
  color: string;
  initials: string;
}

interface PresenceBarProps {
  activeUsers: ActiveUser[];
}

export const PresenceBar = ({ activeUsers }: PresenceBarProps) => {
  if (activeUsers.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-3 flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Active Now</span>
        <Badge variant="secondary" className="text-xs">
          {activeUsers.length}
        </Badge>
      </div>
      
      <div className="flex items-center -space-x-2">
        {activeUsers.map(user => (
          <div
            key={user.id}
            className="relative group"
            style={{ zIndex: activeUsers.length - activeUsers.indexOf(user) }}
          >
            <Avatar className="w-8 h-8 border-2 border-background ring-2 ring-border">
              <AvatarFallback 
                className="text-xs font-semibold"
                style={{ backgroundColor: user.color }}
              >
                {user.initials}
              </AvatarFallback>
            </Avatar>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              {user.name}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
