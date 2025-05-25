
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock } from "lucide-react";

export const LongTransactions = () => {
  // Mock long-running transactions data
  const transactions = [
    {
      pid: 12345,
      datname: "myapp",
      usename: "app_user",
      clientAddr: "192.168.1.100",
      backendStart: "2024-01-15 10:30:00",
      state: "active",
      queryStart: "2024-01-15 14:20:15",
      query: "SELECT * FROM large_table WHERE complex_condition...",
      xminBehindCurrentWal: "45 MB"
    },
    {
      pid: 12346,
      datname: "analytics",
      usename: "analyst",
      clientAddr: "192.168.1.101",
      backendStart: "2024-01-15 12:15:30",
      state: "idle in transaction",
      queryStart: "2024-01-15 13:45:22",
      query: "BEGIN; UPDATE statistics SET...",
      xminBehindCurrentWal: "120 MB"
    }
  ];

  const getStateBadge = (state: string) => {
    switch (state) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "idle in transaction":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Idle in TX</Badge>;
      default:
        return <Badge variant="outline">{state}</Badge>;
    }
  };

  const formatDuration = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}m`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
          Long-Running Transactions
        </CardTitle>
        <CardDescription>
          Transactions that may be preventing WAL recycling or affecting VACUUM performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No long-running transactions detected
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PID</TableHead>
                  <TableHead>Database</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>WAL Behind</TableHead>
                  <TableHead>Query</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.pid}>
                    <TableCell className="font-mono">{tx.pid}</TableCell>
                    <TableCell>{tx.datname}</TableCell>
                    <TableCell>{tx.usename}</TableCell>
                    <TableCell>{getStateBadge(tx.state)}</TableCell>
                    <TableCell className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-gray-500" />
                      {formatDuration(tx.queryStart)}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-red-600 font-medium">
                      {tx.xminBehindCurrentWal}
                    </TableCell>
                    <TableCell className="max-w-xs truncate font-mono text-xs" title={tx.query}>
                      {tx.query}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Impact on WAL:</p>
                  <p>Long-running transactions with old XIDs can prevent WAL file recycling and affect VACUUM performance. Consider terminating idle transactions or optimizing long queries.</p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
