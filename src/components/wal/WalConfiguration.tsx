
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const WalConfiguration = () => {
  // Mock configuration data
  const config = [
    { parameter: "archive_mode", value: "on", status: "good" },
    { parameter: "archive_command", value: "test ! -f /archive/%f && cp %p /archive/%f", status: "good" },
    { parameter: "max_wal_size", value: "1GB", status: "good" },
    { parameter: "wal_keep_size", value: "0", status: "warning" },
    { parameter: "min_wal_size", value: "80MB", status: "good" },
    { parameter: "checkpoint_timeout", value: "5min", status: "good" },
    { parameter: "wal_level", value: "replica", status: "good" },
    { parameter: "max_replication_slots", value: "10", status: "good" },
    { parameter: "max_wal_senders", value: "10", status: "good" }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "good":
        return <Badge variant="default" className="bg-green-100 text-green-800">Good</Badge>;
      case "warning":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>WAL Configuration</CardTitle>
        <CardDescription>
          Current PostgreSQL WAL-related configuration parameters from postgresql.conf
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Parameter</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {config.map((item) => (
              <TableRow key={item.parameter}>
                <TableCell className="font-medium">{item.parameter}</TableCell>
                <TableCell className="font-mono text-sm">{item.value}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
