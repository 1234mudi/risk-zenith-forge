import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Circle, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type RiskHeatMapSectionProps = {
  onNext: () => void;
  inherentScore: string;
  residualScore: string;
  previousInherentScore: string;
  previousResidualScore: string;
  riskName: string;
  compact?: boolean;
};

const RiskHeatMapSection = ({
  onNext,
  inherentScore,
  residualScore,
  previousInherentScore,
  previousResidualScore,
  riskName,
  compact = false
}: RiskHeatMapSectionProps) => {
  const getPositionFromScore = (score: string) => {
    const numScore = parseFloat(score);
    let impact = Math.min(Math.ceil(numScore), 5);
    let likelihood = Math.min(Math.ceil(numScore), 5);
    const top = 100 - (impact * 20);
    const left = likelihood * 20 - 10;
    return { top, left };
  };

  const getColorFromScore = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore >= 4) return "text-red-600";
    if (numScore >= 3) return "text-orange-500";
    if (numScore >= 2) return "text-yellow-500";
    return "text-green-500";
  };

  const inherentPosition = getPositionFromScore(inherentScore);
  const residualPosition = getPositionFromScore(residualScore);
  const previousInherentPosition = getPositionFromScore(previousInherentScore);
  const previousResidualPosition = getPositionFromScore(previousResidualScore);

  return (
    <div className="space-y-6">
      {!compact && (
        <div className="bg-purple-50 p-4 rounded-md">
          <h2 className="text-xl font-medium text-purple-800 mb-2">Risk Heat Map</h2>
          <p className="text-purple-700 text-sm">
            Visualize the inherent and residual risk positions on the heat map, showing the effect of controls.
          </p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1 p-4">
          <h3 className="font-medium text-lg mb-4">Risk Heat Map</h3>
          
          <div className="relative w-full h-[400px] border rounded-md bg-white overflow-hidden">
            <div className="absolute inset-0 grid grid-cols-5 grid-rows-5">
              <div className="bg-red-100"></div>
              <div className="bg-red-200"></div>
              <div className="bg-red-300"></div>
              <div className="bg-red-400"></div>
              <div className="bg-red-500"></div>
              
              <div className="bg-orange-100"></div>
              <div className="bg-orange-200"></div>
              <div className="bg-orange-300"></div>
              <div className="bg-red-300"></div>
              <div className="bg-red-400"></div>
              
              <div className="bg-yellow-100"></div>
              <div className="bg-yellow-200"></div>
              <div className="bg-orange-200"></div>
              <div className="bg-orange-300"></div>
              <div className="bg-red-300"></div>
              
              <div className="bg-green-100"></div>
              <div className="bg-yellow-100"></div>
              <div className="bg-yellow-200"></div>
              <div className="bg-orange-200"></div>
              <div className="bg-orange-300"></div>
              
              <div className="bg-green-50"></div>
              <div className="bg-green-100"></div>
              <div className="bg-yellow-100"></div>
              <div className="bg-yellow-200"></div>
              <div className="bg-orange-200"></div>
            </div>
            
            <div className="absolute inset-0 grid grid-cols-5 grid-rows-5">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="border border-white/30"></div>
              ))}
            </div>
            
            <div className="absolute inset-x-0 bottom-0 flex justify-between px-4 pb-1 text-xs font-medium text-slate-600">
              <span>Very Low</span>
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
              <span>Very High</span>
            </div>
            <div className="absolute inset-y-0 left-0 flex flex-col justify-between py-4 pl-1 text-xs font-medium text-slate-600 items-start">
              <span>Very High</span>
              <span>High</span>
              <span>Medium</span>
              <span>Low</span>
              <span>Very Low</span>
            </div>
            
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-slate-700">
              Likelihood
            </div>
            <div className="absolute top-1/2 left-[-20px] transform -translate-y-1/2 rotate-[-90deg] text-sm font-medium text-slate-700">
              Impact
            </div>
            
            <div 
              className="absolute flex flex-col items-center opacity-50"
              style={{ 
                top: `${previousInherentPosition.top}%`, 
                left: `${previousInherentPosition.left}%` 
              }}
            >
              <Circle size={18} className={`${getColorFromScore(previousInherentScore)} fill-current opacity-50`} />
              <div className="text-[10px] font-mono mt-1 bg-white/70 px-1 rounded">Previous Inherent</div>
            </div>
            
            <div 
              className="absolute flex flex-col items-center opacity-50"
              style={{ 
                top: `${previousResidualPosition.top}%`, 
                left: `${previousResidualPosition.left}%` 
              }}
            >
              <Flag size={18} className={`${getColorFromScore(previousResidualScore)} fill-current opacity-50`} />
              <div className="text-[10px] font-mono mt-1 bg-white/70 px-1 rounded">Previous Residual</div>
            </div>
            
            <div 
              className="absolute flex flex-col items-center"
              style={{ 
                top: `${inherentPosition.top}%`, 
                left: `${inherentPosition.left}%` 
              }}
            >
              <Circle size={24} className={`${getColorFromScore(inherentScore)} fill-current`} />
              <div className="text-[10px] font-mono mt-1 bg-white/70 px-1 rounded">Inherent</div>
            </div>
            
            <div 
              className="absolute flex flex-col items-center"
              style={{ 
                top: `${residualPosition.top}%`, 
                left: `${residualPosition.left}%` 
              }}
            >
              <Flag size={24} className={`${getColorFromScore(residualScore)} fill-current`} />
              <div className="text-[10px] font-mono mt-1 bg-white/70 px-1 rounded">Residual</div>
            </div>
            
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              style={{ zIndex: 5 }}
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="0"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
                </marker>
              </defs>
              <line
                x1={`${inherentPosition.left + 3}%`}
                y1={`${inherentPosition.top + 3}%`}
                x2={`${residualPosition.left + 3}%`}
                y2={`${residualPosition.top + 3}%`}
                stroke="#475569"
                strokeWidth="2"
                strokeDasharray="4"
                markerEnd="url(#arrowhead)"
              />
            </svg>
          </div>
        </Card>
        
        <Card className="p-4 lg:w-80">
          <h3 className="font-medium text-lg mb-4">Risk Analysis</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Current Assessment</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                  <div className="flex items-center gap-2">
                    <Circle size={12} className={getColorFromScore(inherentScore)} />
                    <span className="text-sm">Inherent Risk:</span>
                  </div>
                  <Badge className={`${getColorFromScore(inherentScore)} bg-opacity-20`}>
                    {inherentScore}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                  <div className="flex items-center gap-2">
                    <Flag size={12} className={getColorFromScore(residualScore)} />
                    <span className="text-sm">Residual Risk:</span>
                  </div>
                  <Badge className={`${getColorFromScore(residualScore)} bg-opacity-20`}>
                    {residualScore}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <div className="text-sm">Risk Reduction:</div>
                  <Badge className="bg-blue-100 text-blue-800">
                    {(parseFloat(inherentScore) - parseFloat(residualScore)).toFixed(1)}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Previous Assessment</h4>
              <div className="space-y-2 opacity-75">
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                  <div className="flex items-center gap-2">
                    <Circle size={12} className={getColorFromScore(previousInherentScore)} />
                    <span className="text-sm">Inherent Risk:</span>
                  </div>
                  <Badge className={`${getColorFromScore(previousInherentScore)} bg-opacity-20`}>
                    {previousInherentScore}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                  <div className="flex items-center gap-2">
                    <Flag size={12} className={getColorFromScore(previousResidualScore)} />
                    <span className="text-sm">Residual Risk:</span>
                  </div>
                  <Badge className={`${getColorFromScore(previousResidualScore)} bg-opacity-20`}>
                    {previousResidualScore}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <div className="text-sm">Risk Reduction:</div>
                  <Badge className="bg-blue-100 text-blue-800">
                    {(parseFloat(previousInherentScore) - parseFloat(previousResidualScore)).toFixed(1)}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-yellow-50 rounded text-sm">
              <div className="font-medium mb-1 text-yellow-800">Trend Analysis</div>
              <div className="text-yellow-700">
                {parseFloat(residualScore) < parseFloat(previousResidualScore) 
                  ? "Risk is decreasing from previous assessment." 
                  : parseFloat(residualScore) > parseFloat(previousResidualScore)
                  ? "Risk is increasing from previous assessment."
                  : "Risk remains stable from previous assessment."}
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {!compact && (
        <div className="flex justify-end">
          <Button onClick={onNext}>Continue to Treatment</Button>
        </div>
      )}
    </div>
  );
};

export default RiskHeatMapSection;
