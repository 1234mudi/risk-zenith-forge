
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RiskHeatMapVisualizer from "./visualization/RiskHeatMapVisualizer";
import RiskAppetiteIndicator from "./RiskAppetiteIndicator";

interface RiskHeatMapSectionProps {
  inherentScore: string;
  residualScore: string;
  previousInherentScore?: string;
  previousResidualScore?: string;
  riskName?: string;
  compact?: boolean;
  onNext: () => void;
}

const RiskHeatMapSection: React.FC<RiskHeatMapSectionProps> = ({
  inherentScore,
  residualScore,
  previousInherentScore,
  previousResidualScore,
  riskName,
  compact = false,
  onNext
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RiskHeatMapVisualizer 
            inherentScore={inherentScore}
            residualScore={residualScore}
            previousInherentScore={previousInherentScore}
            previousResidualScore={previousResidualScore}
            riskName={riskName}
            compact={compact}
          />
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Risk Appetite</CardTitle>
            </CardHeader>
            <CardContent>
              <RiskAppetiteIndicator />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Heat Map Interpretation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              The Risk Heat Map visualizes the relationship between inherent risk (x-axis) and residual risk (y-axis). 
              The movement from inherent to residual risk shows the effect of controls on reducing the overall risk.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Reading the Heat Map</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>The blue circle shows your current risk assessment position</li>
                  <li>The dotted orange lines show your risk appetite threshold</li>
                  <li>The colored zones represent different risk levels (Very Low to High)</li>
                  <li>The gray circle (if present) shows your previous assessment</li>
                </ul>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Interpretation</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Risks in the red zone (top-right) require immediate attention</li>
                  <li>Risks above the appetite threshold may need additional controls</li>
                  <li>Effective controls move risks from top-right to bottom-left</li>
                  <li>The larger the vertical drop, the more effective your controls</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {!compact && (
        <div className="flex justify-end">
          <Button onClick={onNext}>Continue to Next Section</Button>
        </div>
      )}
    </div>
  );
};

export default RiskHeatMapSection;
