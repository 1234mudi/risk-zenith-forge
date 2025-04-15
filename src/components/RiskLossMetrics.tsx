
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, ArrowRight, Calendar, CheckCircle, Clock } from "lucide-react";

const mockLossData = {
  total: 245600,
  previousPeriod: 182000,
  percentChange: 35,
  incidents: [
    {
      id: "INC-4501",
      date: "2024-03-15",
      amount: 42000,
      status: "approved",
      title: "External Fraud - Payment System Breach",
      category: "External Fraud",
    },
    {
      id: "INC-4485",
      date: "2024-02-28",
      amount: 78500,
      status: "approved",
      title: "Process Management - Transaction Processing Error",
      category: "Execution, Delivery & Process Management",
    },
    {
      id: "INC-4472",
      date: "2024-02-10",
      amount: 125100,
      status: "approved",
      title: "Systems Failure - Trading Platform Downtime",
      category: "Business Disruption & Systems Failures",
    },
    {
      id: "INC-4450",
      date: "2024-01-22",
      amount: 52000,
      status: "pending",
      title: "Internal Fraud - Unauthorized Trading Activity",
      category: "Internal Fraud",
    },
  ]
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    notation: amount > 999999 ? 'compact' : 'standard'
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const RiskLossMetrics = () => {
  const approvedLosses = mockLossData.incidents.filter(i => i.status === "approved");
  const pendingLosses = mockLossData.incidents.filter(i => i.status === "pending");
  const approvedTotal = approvedLosses.reduce((sum, incident) => sum + incident.amount, 0);
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-blue-600" />
          Loss Incurred Due to Risk
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-2xl font-bold">
              {formatCurrency(approvedTotal)}
            </div>
            <div className="flex items-center text-xs text-slate-500 mt-1 gap-1">
              <span>vs previous period</span>
              <Badge variant="outline" className="bg-red-50 text-red-700 gap-1">
                <TrendingUp className="h-3 w-3" /> {mockLossData.percentChange}%
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="text-slate-500">{formatCurrency(mockLossData.previousPeriod)}</div>
            <ArrowRight className="h-3 w-3 text-slate-400" />
            <div className="text-slate-700 font-medium">{formatCurrency(mockLossData.total)}</div>
          </div>
        </div>
        
        {approvedLosses.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs font-medium text-slate-700 mb-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              Approved Losses
            </div>
            {approvedLosses.map((incident) => (
              <div key={incident.id} className="border rounded-md p-2 bg-slate-50 flex justify-between items-start">
                <div>
                  <div className="text-xs font-medium">{incident.title}</div>
                  <div className="text-xs text-slate-500">
                    <Badge variant="secondary" className="text-xs">
                      {incident.category}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(incident.date)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{formatCurrency(incident.amount)}</div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    approved
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {pendingLosses.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs font-medium text-slate-700 mb-1">
              <Clock className="h-3 w-3 text-yellow-600" />
              Pending Approval
            </div>
            {pendingLosses.map((incident) => (
              <div key={incident.id} className="border rounded-md p-2 bg-slate-50 flex justify-between items-start">
                <div>
                  <div className="text-xs font-medium">{incident.title}</div>
                  <div className="text-xs text-slate-500">
                    <Badge variant="secondary" className="text-xs">
                      {incident.category}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(incident.date)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{formatCurrency(incident.amount)}</div>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                    pending
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskLossMetrics;
