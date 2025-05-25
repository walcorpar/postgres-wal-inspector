
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
import { RefreshCw, Database } from "lucide-react";

export const WalDashboard = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const handleRefresh = () => {
    setLastUpdated(new Date());
    // In a real implementation, this would trigger data refresh
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Database className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">PostgreSQL WAL Inspector</h1>
            <p className="text-gray-600">Monitor Write-Ahead Log status and performance</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

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
    </div>
  );
};
