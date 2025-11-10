import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { notificationService } from '@/services/notificationMockData';
import { NotificationPreferences as NotificationPreferencesType } from '@/types/notification.types';
import { useToast } from '@/hooks/use-toast';

interface NotificationPreferencesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationPreferences({ open, onOpenChange }: NotificationPreferencesProps) {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferencesType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadPreferences();
    }
  }, [open]);

  const loadPreferences = async () => {
    const data = await notificationService.getPreferences();
    setPreferences(data);
  };

  const handleSave = async () => {
    if (!preferences) return;

    setLoading(true);
    try {
      await notificationService.updatePreferences(preferences);
      toast({
        title: 'Preferences saved',
        description: 'Your notification preferences have been updated.',
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save preferences. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!preferences) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Notification Preferences</DialogTitle>
          <DialogDescription>
            Customize how and when you receive notifications
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Email Notifications */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Email Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Choose which events trigger email notifications
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-review" className="flex flex-col gap-1">
                  <span>Review Assignments</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    When you're assigned to review a requirement
                  </span>
                </Label>
                <Switch
                  id="email-review"
                  checked={preferences.emailNotifications.reviewAssignments}
                  onCheckedChange={(checked) =>
                    setPreferences({
                      ...preferences,
                      emailNotifications: {
                        ...preferences.emailNotifications,
                        reviewAssignments: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="email-mentions" className="flex flex-col gap-1">
                  <span>@Mentions</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    When someone mentions you in a discussion
                  </span>
                </Label>
                <Switch
                  id="email-mentions"
                  checked={preferences.emailNotifications.mentions}
                  onCheckedChange={(checked) =>
                    setPreferences({
                      ...preferences,
                      emailNotifications: {
                        ...preferences.emailNotifications,
                        mentions: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="email-changes" className="flex flex-col gap-1">
                  <span>Change Requests</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    Updates on change requests you're involved in
                  </span>
                </Label>
                <Switch
                  id="email-changes"
                  checked={preferences.emailNotifications.changeRequests}
                  onCheckedChange={(checked) =>
                    setPreferences({
                      ...preferences,
                      emailNotifications: {
                        ...preferences.emailNotifications,
                        changeRequests: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="email-due" className="flex flex-col gap-1">
                  <span>Due Date Reminders</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    Reminders for upcoming review deadlines
                  </span>
                </Label>
                <Switch
                  id="email-due"
                  checked={preferences.emailNotifications.dueDateReminders}
                  onCheckedChange={(checked) =>
                    setPreferences({
                      ...preferences,
                      emailNotifications: {
                        ...preferences.emailNotifications,
                        dueDateReminders: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="email-status" className="flex flex-col gap-1">
                  <span>Status Changes</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    When requirements change status
                  </span>
                </Label>
                <Switch
                  id="email-status"
                  checked={preferences.emailNotifications.statusChanges}
                  onCheckedChange={(checked) =>
                    setPreferences({
                      ...preferences,
                      emailNotifications: {
                        ...preferences.emailNotifications,
                        statusChanges: checked,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Push Notifications */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">In-App Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Choose which events trigger in-app notifications
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="push-review">Review Assignments</Label>
                <Switch
                  id="push-review"
                  checked={preferences.pushNotifications.reviewAssignments}
                  onCheckedChange={(checked) =>
                    setPreferences({
                      ...preferences,
                      pushNotifications: {
                        ...preferences.pushNotifications,
                        reviewAssignments: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="push-mentions">@Mentions</Label>
                <Switch
                  id="push-mentions"
                  checked={preferences.pushNotifications.mentions}
                  onCheckedChange={(checked) =>
                    setPreferences({
                      ...preferences,
                      pushNotifications: {
                        ...preferences.pushNotifications,
                        mentions: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="push-changes">Change Requests</Label>
                <Switch
                  id="push-changes"
                  checked={preferences.pushNotifications.changeRequests}
                  onCheckedChange={(checked) =>
                    setPreferences({
                      ...preferences,
                      pushNotifications: {
                        ...preferences.pushNotifications,
                        changeRequests: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="push-due">Due Date Reminders</Label>
                <Switch
                  id="push-due"
                  checked={preferences.pushNotifications.dueDateReminders}
                  onCheckedChange={(checked) =>
                    setPreferences({
                      ...preferences,
                      pushNotifications: {
                        ...preferences.pushNotifications,
                        dueDateReminders: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="push-status">Status Changes</Label>
                <Switch
                  id="push-status"
                  checked={preferences.pushNotifications.statusChanges}
                  onCheckedChange={(checked) =>
                    setPreferences({
                      ...preferences,
                      pushNotifications: {
                        ...preferences.pushNotifications,
                        statusChanges: checked,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Email Digest */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Email Digest</h3>
              <p className="text-sm text-muted-foreground">
                Receive a summary of notifications
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="digest-frequency">Digest Frequency</Label>
              <Select
                value={preferences.emailDigestFrequency}
                onValueChange={(value: any) =>
                  setPreferences({
                    ...preferences,
                    emailDigestFrequency: value,
                  })
                }
              >
                <SelectTrigger id="digest-frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate (no digest)</SelectItem>
                  <SelectItem value="daily">Daily digest</SelectItem>
                  <SelectItem value="weekly">Weekly digest</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Quiet Hours */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Quiet Hours</h3>
              <p className="text-sm text-muted-foreground">
                Mute non-urgent notifications during specific hours
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="quiet-hours">Enable Quiet Hours</Label>
                <Switch
                  id="quiet-hours"
                  checked={preferences.quietHoursEnabled}
                  onCheckedChange={(checked) =>
                    setPreferences({
                      ...preferences,
                      quietHoursEnabled: checked,
                    })
                  }
                />
              </div>

              {preferences.quietHoursEnabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quiet-start">Start Time</Label>
                    <Input
                      id="quiet-start"
                      type="time"
                      value={preferences.quietHoursStart || '22:00'}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          quietHoursStart: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quiet-end">End Time</Label>
                    <Input
                      id="quiet-end"
                      type="time"
                      value={preferences.quietHoursEnd || '08:00'}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          quietHoursEnd: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
