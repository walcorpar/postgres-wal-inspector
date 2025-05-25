
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, Activity, Database } from "lucide-react";

export const WalOverview = () => {
  // Mock data - in real implementation, this would come from your PostgreSQL queries
  const overview = {
    serviceStatus: "active",
    walDirectorySize: "2.4 GB",
    currentLsn: "0/3B2C4A8",
    walFilesSinceRestart: 145,
    archiveMode: "on",
    activeSlots: 2,
    inactiveSlots: 1,
    failedArchives: 0
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === "active" ? "default" : status === "warning" ? "secondary" : "destructive";
    return <Badge variant={variant}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Service Status</CardTitle>
          {getStatusIcon(overview.serviceStatus)}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">PostgreSQL</div>
          {getStatusBadge(overview.serviceStatus)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">WAL Directory Size</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overview.walDirectorySize}</div>
          <p className="text-xs text-muted-foreground">pg_wal directory</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current LSN</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overview.currentLsn}</div>
          <p className="text-xs text-muted-foreground">Log Sequence Number</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">WAL Files</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overview.walFilesSinceRestart}</div>
          <p className="text-xs text-muted-foreground">Since last restart</p>
        </CardContent>
      </Card>
    </div>
  );
};
