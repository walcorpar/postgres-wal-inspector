
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseDatabaseConfig, DatabaseConfig } from '@/hooks/useSupabaseDatabaseConfig';
import { Database, Plus, Trash2, Check, Settings } from "lucide-react";

export const UserDatabaseConfig = () => {
  const { user } = useAuth();
  const { configs, activeConfig, loading, saveConfig, deleteConfig, setActiveConfiguration } = useSupabaseDatabaseConfig();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<DatabaseConfig, 'id'>>({
    name: '',
    host: '',
    port: 5432,
    database_name: '',
    username: '',
    password_encrypted: '',
    ssl_enabled: true,
    is_active: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const result = await saveConfig(formData);
    
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess('Database configuration saved successfully!');
      setFormData({
        name: '',
        host: '',
        port: 5432,
        database_name: '',
        username: '',
        password_encrypted: '',
        ssl_enabled: true,
        is_active: false,
      });
      setShowForm(false);
    }
  };

  const handleDelete = async (configId: string) => {
    if (!confirm('Are you sure you want to delete this configuration?')) return;
    
    const result = await deleteConfig(configId);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess('Configuration deleted successfully!');
    }
  };

  const handleSetActive = async (configId: string) => {
    const result = await setActiveConfiguration(configId);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess('Active configuration updated!');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading database configurations...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Database Configurations
            </div>
            <Button onClick={() => setShowForm(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Configuration
            </Button>
          </CardTitle>
          <CardDescription>
            Manage your PostgreSQL database connections
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {configs.length === 0 ? (
            <div className="text-center py-8">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No database configurations yet</p>
              <p className="text-sm text-gray-400">Add a configuration to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {configs.map((config) => (
                <div key={config.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{config.name}</h3>
                      {config.is_active && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {!config.is_active && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetActive(config.id!)}
                        >
                          Set Active
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(config.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Host:</span> {config.host}:{config.port}
                    </div>
                    <div>
                      <span className="font-medium">Database:</span> {config.database_name}
                    </div>
                    <div>
                      <span className="font-medium">Username:</span> {config.username}
                    </div>
                    <div>
                      <span className="font-medium">SSL:</span> {config.ssl_enabled ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Database Configuration</CardTitle>
            <CardDescription>
              Add a new PostgreSQL database connection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Configuration Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Production DB, Development DB, etc."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="host">Host</Label>
                  <Input
                    id="host"
                    value={formData.host}
                    onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                    placeholder="localhost or IP address"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    type="number"
                    value={formData.port}
                    onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
                    placeholder="5432"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="database">Database Name</Label>
                <Input
                  id="database"
                  value={formData.database_name}
                  onChange={(e) => setFormData({ ...formData, database_name: e.target.value })}
                  placeholder="postgres"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="postgres"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password_encrypted}
                    onChange={(e) => setFormData({ ...formData, password_encrypted: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="ssl"
                  checked={formData.ssl_enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, ssl_enabled: checked })}
                />
                <Label htmlFor="ssl">Enable SSL</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="active">Set as active configuration</Label>
              </div>

              <div className="flex space-x-2">
                <Button type="submit">Save Configuration</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
