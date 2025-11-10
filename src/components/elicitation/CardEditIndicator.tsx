import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Edit3 } from 'lucide-react';

interface CardEditIndicatorProps {
  userName: string;
  userInitials: string;
  userColor: string;
}

export const CardEditIndicator = ({ userName, userInitials, userColor }: CardEditIndicatorProps) => {
  return (
    <div className="absolute -top-2 -right-2 flex items-center gap-1 bg-background border border-border rounded-full pl-2 pr-1 py-0.5 shadow-md z-10 animate-fade-in">
      <Edit3 className="w-3 h-3 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">{userName}</span>
      <Avatar className="w-5 h-5 border border-background">
        <AvatarFallback 
          className="text-[10px] font-semibold"
          style={{ backgroundColor: userColor }}
        >
          {userInitials}
        </AvatarFallback>
      </Avatar>
      <div className="absolute -inset-0.5 rounded-full animate-pulse" style={{ 
        background: `${userColor}20`,
        boxShadow: `0 0 0 2px ${userColor}40`
      }} />
    </div>
  );
};
