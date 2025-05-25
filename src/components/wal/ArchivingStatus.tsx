
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export const ArchivingStatus = () => {
  // Mock archiving status data
  const archivingData = {
    lastArchivedWal: "00000001000000000000003B",
    lastArchiveAction: "archived",
    lastArchiveCommand: "test ! -f /archive/00000001000000000000003B && cp pg_wal/00000001000000000000003B /archive/00000001000000000000003B",
    lastArchiveTime: "2024-01-15 14:23:45.123456+00",
    failedCollections: 0,
    lastFailedWal: null,
    lastFailedTime: null
  };

  const getArchiveStatus = () => {
    if (archivingData.failedCollections === 0) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Healthy
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive">
          <XCircle className="w-3 h-3 mr-1" />
          Failed
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            WAL Archiving Status
            {getArchiveStatus()}
          </CardTitle>
          <CardDescription>
            Status of WAL file archiving process and recent activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Last Archived WAL</TableCell>
                <TableCell className="font-mono">{archivingData.lastArchivedWal}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Last Archive Action</TableCell>
                <TableCell>
                  <Badge variant="outline">{archivingData.lastArchiveAction}</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Last Archive Time</TableCell>
                <TableCell className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  {new Date(archivingData.lastArchiveTime).toLocaleString()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Failed Collections</TableCell>
                <TableCell className={archivingData.failedCollections > 0 ? "text-red-600 font-bold" : "text-green-600"}>
                  {archivingData.failedCollections}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Last Failed WAL</TableCell>
                <TableCell>{archivingData.lastFailedWal || "None"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Archive Command</CardTitle>
          <CardDescription>Current archive command configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-3 rounded-md">
            <code className="text-sm text-gray-800">
              {archivingData.lastArchiveCommand}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
