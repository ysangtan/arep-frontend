import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Participant } from '@/types/reviewSession.types';
import { Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ParticipantListProps {
  participants: Participant[];
}

export function ParticipantList({ participants }: ParticipantListProps) {
  const onlineCount = participants.filter((p) => p.isOnline).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">Participants</CardTitle>
          </div>
          <Badge variant="secondary">
            {onlineCount} / {participants.length} online
          </Badge>
        </div>
        <CardDescription>Team members in this review session</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                    {participant.name.charAt(0)}
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                      participant.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  />
                </div>
                <div>
                  <div className="font-medium text-sm">{participant.name}</div>
                  <div className="text-xs text-muted-foreground">{participant.role}</div>
                </div>
              </div>
              {!participant.isOnline && participant.lastSeen && (
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(participant.lastSeen), { addSuffix: true })}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
