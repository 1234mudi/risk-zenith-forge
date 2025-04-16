
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeAlert, BadgeDollarSign, AlertTriangle, ArrowDown, ArrowUp, AlertCircle } from "lucide-react";

const MetricsAndLossesSection = () => {
  // Sample data for demonstration
  const outlierMetrics = {
    total: 12,
    aboveThreshold: 5,
    belowThreshold: 3,
    withinThreshold: 4
  };
  
  const lossMetrics = {
    totalAmount: "$2,450,000",
    approvedCases: 34,
    pendingCases: 12,
    trend: "up", // or "down"
    percentageChange: "18%"
  };
  
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-medium text-slate-800">Metrics and Losses</h2>
          <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
            Risk Performance Indicators
          </div>
        </div>
        
        <p className="text-slate-600 mb-6">
          Risk metrics and associated loss data help quantify the current risk exposure.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Outlier Metrics Card */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BadgeAlert className="h-5 w-5 text-orange-500" />
                Outlier Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm text-slate-600">
                    Metrics outside defined thresholds
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">
                      {outlierMetrics.aboveThreshold + outlierMetrics.belowThreshold}
                    </span>
                    <span className="text-xs text-slate-500">
                      of {outlierMetrics.total} metrics
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-sm">
                    <ArrowUp className="h-4 w-4 text-red-500" />
                    <span className="text-red-500 font-medium">{outlierMetrics.aboveThreshold} Above Threshold</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <ArrowDown className="h-4 w-4 text-amber-500" />
                    <span className="text-amber-500 font-medium">{outlierMetrics.belowThreshold} Below Threshold</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-orange-50 rounded-md border border-orange-100 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <span className="text-sm text-orange-700">
                  {(outlierMetrics.aboveThreshold / outlierMetrics.total * 100).toFixed(0)}% of metrics are currently exceeding their defined thresholds.
                </span>
              </div>
            </CardContent>
          </Card>
          
          {/* Loss Incurred Card */}
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BadgeDollarSign className="h-5 w-5 text-red-500" />
                Loss Incurred Due to Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm text-slate-600">
                    Total approved loss amount
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">
                      {lossMetrics.totalAmount}
                    </span>
                    <div className="flex items-center text-xs px-2 py-0.5 rounded bg-red-50 text-red-600">
                      {lossMetrics.trend === "up" ? (
                        <ArrowUp className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 mr-1" />
                      )}
                      {lossMetrics.percentageChange}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-slate-500">{lossMetrics.approvedCases} Approved Cases</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-amber-500">{lossMetrics.pendingCases} Pending Review</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-red-50 rounded-md border border-red-100 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span className="text-sm text-red-700">
                  Losses have increased by {lossMetrics.percentageChange} compared to the previous assessment period.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MetricsAndLossesSection;
