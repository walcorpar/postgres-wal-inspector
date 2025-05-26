import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalOverview } from "./WalOverview";
import { WalConfiguration } from "./WalConfiguration";
import { ReplicationSlots } from "./ReplicationSlots";
import { ArchivingStatus } from "./ArchivingStatus";
import { LongTransactions } from "./LongTransactions";
import { WalMetricsChart } from "./WalMetricsChart";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database, Settings } from "lucide-react";
import { UserDatabaseConfig } from "../database/UserDatabaseConfig";
import { Header } from "../Header";
import { useSupabaseDatabaseConfig } from "@/hooks/useSupabaseDatabaseConfig";

export const WalDashboard = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showDatabaseConfig, setShowDatabaseConfig] = useState(false);
  const { activeConfig } = useSupabaseDatabaseConfig();

  const handleRefresh = () => {
    setLastUpdated(new Date());
    // En una implementación real, esto dispararía la actualización de datos
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
            <p className="text-gray-600">Monitor your PostgreSQL WAL status</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
            <Button 
              onClick={() => setShowDatabaseConfig(!showDatabaseConfig)} 
              variant="outline" 
              size="sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              Database Config
            </Button>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {showDatabaseConfig && (
          <UserDatabaseConfig />
        )}

        {!activeConfig && !showDatabaseConfig && (
          <div className="text-center py-12">
            <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Database Configuration</h3>
            <p className="text-gray-600 mb-4">
              Configure a PostgreSQL database connection to start monitoring WAL
            </p>
            <Button onClick={() => setShowDatabaseConfig(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Configure Database
            </Button>
          </div>
        )}

        {activeConfig && (
          <>
            <WalOverview />

            <Tabs defaultValue="metrics" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="config">Configuration</TabsTrigger>
                <TabsTrigger value="replication">Replication</TabsTrigger>
                <TabsTrigger value="archiving">Archiving</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              </TabsList>

              <TabsContent value="metrics" className="space-y-4">
                <WalMetricsChart />
              </TabsContent>

              <TabsContent value="config" className="space-y-4">
                <WalConfiguration />
              </TabsContent>

              <TabsContent value="replication" className="space-y-4">
                <ReplicationSlots />
              </TabsContent>

              <TabsContent value="archiving" className="space-y-4">
                <ArchivingStatus />
              </TabsContent>

              <TabsContent value="transactions" className="space-y-4">
                <LongTransactions />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};
