
import React from "react";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

interface Assessment {
  date: string;
  score: string;
}

interface RiskTrendChartProps {
  assessments: Assessment[];
  color: string;
  title: string;
}

const RiskTrendChart: React.FC<RiskTrendChartProps> = ({ 
  assessments,
  color,
  title
}) => {
  // Sort assessments by date (oldest to newest)
  const sortedAssessments = [...assessments].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Format data for the chart
  const chartData = sortedAssessments.map(assessment => ({
    date: new Date(assessment.date).toLocaleDateString('en-US', { 
      month: 'short',
      year: 'numeric'
    }),
    score: parseFloat(assessment.score)
  }));

  // Get domain for Y axis (min and max scores with some padding)
  const scores = chartData.map(d => d.score);
  const minScore = Math.max(0, Math.floor(Math.min(...scores) - 0.5));
  const maxScore = Math.min(5, Math.ceil(Math.max(...scores) + 0.5));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickMargin={10}
            axisLine={{ stroke: '#E5E7EB' }} 
          />
          <YAxis 
            domain={[minScore, maxScore]}
            tick={{ fontSize: 12 }}
            tickCount={5}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-md">
                    <p className="text-sm font-medium">{payload[0].payload.date}</p>
                    <p className="text-sm">
                      Score: <span className="font-semibold">{payload[0].value}</span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="score" 
            fill={color} 
            radius={[4, 4, 0, 0]}
            name={title}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskTrendChart;
