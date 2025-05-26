
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { DatabaseConfig } from "@/types/database";
import { useDatabaseConfig } from "@/hooks/useDatabaseConfig";
import { Database, Settings, TestTube, Trash2, CheckCircle, XCircle, Loader2 } from "lucide-react";

export const DatabaseConfiguration = () => {
  const { config, connectionStatus, saveConfig, clearConfig, testConnection } = useDatabaseConfig();
  const [showForm, setShowForm] = useState(!config);

  const form = useForm<DatabaseConfig>({
    defaultValues: config || {
      host: '',
      port: 5432,
      database: '',
      username: '',
      password: '',
      ssl: true,
    },
  });

  const onSubmit = async (data: DatabaseConfig) => {
    const success = await testConnection(data);
    if (success) {
      saveConfig(data);
      setShowForm(false);
    }
  };

  const handleEdit = () => {
    form.reset(config || {
      host: '',
      port: 5432,
      database: '',
      username: '',
      password: '',
      ssl: true,
    });
    setShowForm(true);
  };

  const getConnectionBadge = () => {
    if (connectionStatus.isConnecting) {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Conectando...
        </Badge>
      );
    }
    
    if (connectionStatus.isConnected) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Conectado
        </Badge>
      );
    }
    
    if (connectionStatus.error) {
      return (
        <Badge variant="destructive">
          <XCircle className="w-3 h-3 mr-1" />
          Error
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline">
        No configurado
      </Badge>
    );
  };

  if (!showForm && config) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Configuración de Base de Datos
            </div>
            {getConnectionBadge()}
          </CardTitle>
          <CardDescription>
            Conexión configurada a PostgreSQL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Servidor</Label>
              <p className="font-mono text-sm">{config.host}:{config.port}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Base de Datos</Label>
              <p className="font-mono text-sm">{config.database}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Usuario</Label>
              <p className="font-mono text-sm">{config.username}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">SSL</Label>
              <p className="font-mono text-sm">{config.ssl ? 'Habilitado' : 'Deshabilitado'}</p>
            </div>
          </div>
          
          {connectionStatus.lastConnected && (
            <div>
              <Label className="text-sm font-medium text-gray-600">Última Conexión</Label>
              <p className="text-sm text-gray-500">
                {connectionStatus.lastConnected.toLocaleString()}
              </p>
            </div>
          )}
          
          {connectionStatus.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{connectionStatus.error}</p>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button onClick={handleEdit} variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Editar Configuración
            </Button>
            <Button 
              onClick={() => testConnection(config)} 
              variant="outline"
              disabled={connectionStatus.isConnecting}
            >
              <TestTube className="w-4 h-4 mr-2" />
              Probar Conexión
            </Button>
            <Button onClick={clearConfig} variant="destructive" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Configurar Conexión PostgreSQL
        </CardTitle>
        <CardDescription>
          Configura la conexión a tu servidor PostgreSQL para monitorear WAL en tiempo real
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="host"
                rules={{ required: "El host es requerido" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Servidor/Host</FormLabel>
                    <FormControl>
                      <Input placeholder="localhost" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="port"
                rules={{ required: "El puerto es requerido" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Puerto</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="5432" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="database"
              rules={{ required: "El nombre de la base de datos es requerido" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base de Datos</FormLabel>
                  <FormControl>
                    <Input placeholder="postgres" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="username"
                rules={{ required: "El usuario es requerido" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="postgres" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                rules={{ required: "La contraseña es requerida" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={connectionStatus.isConnecting}
              >
                {connectionStatus.isConnecting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <TestTube className="w-4 h-4 mr-2" />
                )}
                Probar y Guardar Conexión
              </Button>
              
              {config && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
