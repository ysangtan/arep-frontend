import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserManagement } from '@/components/admin/UserManagement';
import { ValidationConfiguration } from '@/components/admin/ValidationConfiguration';
import { AuditLog } from '@/components/admin/AuditLog';
import { Users, Shield, FileText } from 'lucide-react';

export default function Admin() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
        <p className="text-muted-foreground mt-1">
          Manage users, validation rules, and monitor system activity
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" />
            Users & Roles
          </TabsTrigger>
          <TabsTrigger value="validation" className="gap-2">
            <Shield className="w-4 h-4" />
            Validation Rules
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <FileText className="w-4 h-4" />
            Audit Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <UserManagement />
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <ValidationConfiguration />
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <AuditLog />
        </TabsContent>
      </Tabs>
    </div>
  );
}
