
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

const RiskAssessmentNavigation = () => {
  return (
    <TabsList className="w-full justify-start px-6 pt-4 bg-white border-b h-auto flex-wrap">
      <TabsTrigger value="general" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
        General
      </TabsTrigger>
      <TabsTrigger value="inherent" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
        Inherent Rating
      </TabsTrigger>
      <TabsTrigger value="control" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
        Control Effectiveness
      </TabsTrigger>
      <TabsTrigger value="residual" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
        Residual Rating
      </TabsTrigger>
      <TabsTrigger value="treatment" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
        Treatment
      </TabsTrigger>
      <TabsTrigger value="metrics" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
        Metrics and Losses
      </TabsTrigger>
      <TabsTrigger value="issues" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
        Issues
      </TabsTrigger>
      <TabsTrigger value="comments" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
        Additional Details
      </TabsTrigger>
      <TabsTrigger value="heatmap" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
        Heat Map
      </TabsTrigger>
    </TabsList>
  );
};

export default RiskAssessmentNavigation;
