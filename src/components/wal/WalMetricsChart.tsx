
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";

export const WalMetricsChart = () => {
  // Mock time-series data for WAL metrics
  const walSizeData = [
    { time: "00:00", size: 1.8, files: 120 },
    { time: "04:00", size: 2.1, files: 135 },
    { time: "08:00", size: 2.4, files: 145 },
    { time: "12:00", size: 2.2, files: 140 },
    { time: "16:00", size: 2.6, files: 155 },
    { time: "20:00", size: 2.3, files: 148 },
    { time: "24:00", size: 2.4, files: 145 }
  ];

  const lsnProgressData = [
    { time: "00:00", lsn: "0/3A000000" },
    { time: "04:00", lsn: "0/3A500000" },
    { time: "08:00", lsn: "0/3B000000" },
    { time: "12:00", lsn: "0/3B200000" },
    { time: "16:00", lsn: "0/3B800000" },
    { time: "20:00", lsn: "0/3C000000" },
    { time: "24:00", lsn: "0/3C400000" }
  ];

  const chartConfig = {
    size: {
      label: "Size (GB)",
      color: "#3b82f6",
    },
    files: {
      label: "File Count",
      color: "#10b981",
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>WAL Directory Size Over Time</CardTitle>
          <CardDescription>
            Historical view of WAL directory size and file count
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={walSizeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="size" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Size (GB)"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="files" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="File Count"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>WAL Generation Rate</CardTitle>
          <CardDescription>
            Rate of WAL file generation throughout the day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ files: { label: "Files Generated", color: "#8b5cf6" } }} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={walSizeData.map((item, index) => ({
                time: item.time,
                generated: index === 0 ? 0 : item.files - walSizeData[index - 1].files
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="generated" fill="#8b5cf6" name="Files Generated" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
