
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DatabaseConfig {
  id?: string;
  name: string;
  host: string;
  port: number;
  database_name: string;
  username: string;
  password_encrypted: string;
  ssl_enabled: boolean;
  is_active: boolean;
}

export const useSupabaseDatabaseConfig = () => {
  const { user } = useAuth();
  const [configs, setConfigs] = useState<DatabaseConfig[]>([]);
  const [activeConfig, setActiveConfig] = useState<DatabaseConfig | null>(null);
  const [loading, setLoading] = useState(false);

  const loadConfigs = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('database_configurations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading database configs:', error);
        return;
      }

      const mappedConfigs = data.map(config => ({
        id: config.id,
        name: config.name,
        host: config.host,
        port: config.port,
        database_name: config.database_name,
        username: config.username,
        password_encrypted: config.password_encrypted,
        ssl_enabled: config.ssl_enabled,
        is_active: config.is_active,
      }));

      setConfigs(mappedConfigs);
      
      const active = mappedConfigs.find(config => config.is_active);
      setActiveConfig(active || null);
    } catch (error) {
      console.error('Error loading database configs:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (config: Omit<DatabaseConfig, 'id'>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      // If this config is being set as active, deactivate others first
      if (config.is_active) {
        await supabase
          .from('database_configurations')
          .update({ is_active: false })
          .eq('user_id', user.id);
      }

      const { data, error } = await supabase
        .from('database_configurations')
        .insert({
          user_id: user.id,
          name: config.name,
          host: config.host,
          port: config.port,
          database_name: config.database_name,
          username: config.username,
          password_encrypted: config.password_encrypted, // In real app, encrypt this
          ssl_enabled: config.ssl_enabled,
          is_active: config.is_active,
        })
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      await loadConfigs();
      return { data };
    } catch (error) {
      return { error: 'Failed to save configuration' };
    }
  };

  const deleteConfig = async (configId: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('database_configurations')
        .delete()
        .eq('id', configId)
        .eq('user_id', user.id);

      if (error) {
        return { error: error.message };
      }

      await loadConfigs();
      return {};
    } catch (error) {
      return { error: 'Failed to delete configuration' };
    }
  };

  const setActiveConfiguration = async (configId: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      // Deactivate all configs first
      await supabase
        .from('database_configurations')
        .update({ is_active: false })
        .eq('user_id', user.id);

      // Activate the selected config
      const { error } = await supabase
        .from('database_configurations')
        .update({ is_active: true })
        .eq('id', configId)
        .eq('user_id', user.id);

      if (error) {
        return { error: error.message };
      }

      await loadConfigs();
      return {};
    } catch (error) {
      return { error: 'Failed to set active configuration' };
    }
  };

  useEffect(() => {
    if (user) {
      loadConfigs();
    }
  }, [user]);

  return {
    configs,
    activeConfig,
    loading,
    saveConfig,
    deleteConfig,
    setActiveConfiguration,
    loadConfigs,
  };
};
