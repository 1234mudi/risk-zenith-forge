
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        
        <p className="text-slate-600">
          Risk metrics and loss data has been moved to the assessment dashboard to improve form simplicity.
        </p>
      </div>
    </div>
  );
};

export default MetricsAndLossesSection;
