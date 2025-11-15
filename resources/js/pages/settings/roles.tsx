import React, { useMemo } from 'react';
import { usePage, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button'; // Adjust imports as needed
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, ShoppingCart, UsersIcon, Save } from 'lucide-react'; // Example icons

// --- Define Types for your Props ---
interface Permission {
  id: number;
  name: string;
  description: string;
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[]; // Permissions this role *currently* has
}

interface PageProps {
  roles: Role[]; // ALL roles
  allPermissions: Permission[]; // ALL available permissions
}

// --- Icon Mapping (Example) ---
// Maps model names (like 'orders') to an icon
const iconMap: { [key: string]: React.ElementType } = {
  dashboard: LayoutDashboard,
  orders: ShoppingCart,
  customers: UsersIcon,
  // Add other models here...
  default: LayoutDashboard, // Fallback icon
};

// --- Helper to group permissions ---
const groupPermissions = (permissions: Permission[]) => {
  return permissions.reduce((acc, permission) => {
    const [model, ...actionParts] = permission.name.split('.');
    if (!acc[model]) {
      acc[model] = [];
    }
    acc[model].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);
};

// --- Sub-Component: Form for a *Single* Role ---
// This manages the state and submission for one tab
function RolePermissionForm({
  role,
  groupedPermissions,
}: {
  role: Role;
  groupedPermissions: Record<string, Permission[]>;
}) {
  const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
    // Initialize with the IDs of permissions this role *already* has
    permissions: role.permissions.map(p => p.id),
  });

  const handlePermissionChange = (permissionId: number, value: boolean) => {
    if (value) {
      // Add ID
      setData('permissions', [...data.permissions, permissionId]);
    } else {
      // Remove ID
      setData('permissions', data.permissions.filter(id => id !== permissionId));
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Use the new route we created
    // put('/admin.roles.updatePermissions/'. role.id), {
    //   preserveScroll: true,
    // });
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {Object.keys(groupedPermissions).sort().map((modelName) => {
        const CategoryIcon = iconMap[modelName] || iconMap.default;
        return (
          <Card key={modelName}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <CategoryIcon className="w-5 h-5 text-primary" />
                {/* Capitalize model name */}
                {modelName.charAt(0).toUpperCase() + modelName.slice(1).replace('_', ' ')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {groupedPermissions[modelName].map((perm) => (
                <div
                  key={perm.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <Label
                    htmlFor={`${role.id}-${perm.id}`}
                    className="text-sm font-normal"
                  >
                    {/* Use description or fallback to action name */}
                    {perm.description || perm.name.split('.')[1] || perm.name}
                  </Label>
                  <Switch
                    id={`${role.id}-${perm.id}`}
                    checked={data.permissions.includes(perm.id)}
                    onCheckedChange={(value) =>
                      handlePermissionChange(perm.id, value)
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={processing}
          className="w-full sm:w-auto"
        >
          <Save className="w-4 h-4 mr-2" />
          {processing ? 'Saving...' : `Save ${role.name} Permissions`}
        </Button>
        {recentlySuccessful && (
          <span className="ml-3 text-green-600">Saved!</span>
        )}
        {errors.permissions && (
          <div className="text-red-500 mt-2">{errors.permissions}</div>
        )}
      </div>
    </form>
  );
}