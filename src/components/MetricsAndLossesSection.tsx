
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RiskOutlierMetrics from './RiskOutlierMetrics';
import RiskLossMetrics from './RiskLossMetrics';

const MetricsAndLossesSection = () => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-medium text-slate-800">Metrics and Losses</h2>
          <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
            Risk Performance Indicators
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RiskOutlierMetrics />
          <RiskLossMetrics />
        </div>
      </div>
    </div>
  );
};

export default MetricsAndLossesSection;
