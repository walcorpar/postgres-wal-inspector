
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle } from "lucide-react";

export const ReplicationSlots = () => {
  // Mock replication slots data
  const slots = [
    {
      slotName: "replica_slot_1",
      active: true,
      slotType: "physical",
      walRetainedSize: "125 MB",
      restartLsn: "0/3A1B2C3",
      restartWalFile: "00000001000000000000003A",
      database: null,
      plugin: null
    },
    {
      slotName: "logical_slot_1",
      active: true,
      slotType: "logical",
      walRetainedSize: "89 MB",
      restartLsn: "0/3A2C4D5",
      restartWalFile: "00000001000000000000003A",
      database: "myapp",
      plugin: "pgoutput"
    },
    {
      slotName: "old_replica_slot",
      active: false,
      slotType: "physical",
      walRetainedSize: "2.1 GB",
      restartLsn: "0/381F2A1",
      restartWalFile: "000000010000000000000038",
      database: null,
      plugin: null
    }
  ];

  const getStatusBadge = (active: boolean) => {
    return active ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Replication Slots Status</CardTitle>
        <CardDescription>
          Active and inactive replication slots and their WAL retention impact
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Slot Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>WAL Retained</TableHead>
              <TableHead>Restart LSN</TableHead>
              <TableHead>Database</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slots.map((slot) => (
              <TableRow key={slot.slotName}>
                <TableCell className="font-medium">{slot.slotName}</TableCell>
                <TableCell>{getStatusBadge(slot.active)}</TableCell>
                <TableCell>
                  <Badge variant="outline">{slot.slotType}</Badge>
                </TableCell>
                <TableCell className={`font-mono text-sm ${!slot.active && slot.walRetainedSize === "2.1 GB" ? "text-red-600 font-bold" : ""}`}>
                  {slot.walRetainedSize}
                </TableCell>
                <TableCell className="font-mono text-xs">{slot.restartLsn}</TableCell>
                <TableCell>{slot.database || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
            <span className="text-sm text-yellow-800">
              Inactive slots may accumulate WAL files. Consider dropping unused slots.
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
