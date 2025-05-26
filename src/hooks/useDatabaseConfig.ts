
import { useState, useEffect } from 'react';
import { DatabaseConfig, ConnectionStatus } from '@/types/database';

export const useDatabaseConfig = () => {
  const [config, setConfig] = useState<DatabaseConfig | null>(() => {
    const saved = localStorage.getItem('postgresql-config');
    return saved ? JSON.parse(saved) : null;
  });

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    isConnecting: false,
  });

  const saveConfig = (newConfig: DatabaseConfig) => {
    setConfig(newConfig);
    localStorage.setItem('postgresql-config', JSON.stringify(newConfig));
  };

  const clearConfig = () => {
    setConfig(null);
    localStorage.removeItem('postgresql-config');
    setConnectionStatus({
      isConnected: false,
      isConnecting: false,
    });
  };

  const testConnection = async (testConfig: DatabaseConfig) => {
    setConnectionStatus({ isConnected: false, isConnecting: true });
    
    try {
      // En una implementación real, esto haría una llamada a tu backend/Supabase Edge Function
      // para probar la conexión con las credenciales proporcionadas
      
      // Simulamos una prueba de conexión por ahora
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Por ahora, asumimos que la conexión es exitosa
      setConnectionStatus({
        isConnected: true,
        isConnecting: false,
        lastConnected: new Date(),
      });
      
      return true;
    } catch (error) {
      setConnectionStatus({
        isConnected: false,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Error de conexión desconocido',
      });
      
      return false;
    }
  };

  return {
    config,
    connectionStatus,
    saveConfig,
    clearConfig,
    testConnection,
  };
};
