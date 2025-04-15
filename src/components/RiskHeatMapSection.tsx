
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, ArrowRight, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const HEAT_MAP_LEVELS = [
  ["#f8d7da", "#f1aeb5", "#dc3545", "#b02a37", "#7f1d2b"], // Reds - top row
  ["#fff3cd", "#ffe69c", "#ffc107", "#cc9a06", "#997404"], // Yellows
  ["#d1e7dd", "#a3cfbb", "#198754", "#146c43", "#0f5132"], // Greens
  ["#cfe2ff", "#9ec5fe", "#0d6efd", "#0a58ca", "#084298"], // Blues
  ["#e2e3e5", "#c4c8cb", "#6c757d", "#565e64", "#41464b"]  // Grays - bottom row
];

type RiskHeatMapSectionProps = {
  inherentScore: string;
  residualScore: string;
  previousInherentScore?: string;
  previousResidualScore?: string;
  riskName: string;
  compact?: boolean;
  onNext: () => void;
};

const RiskHeatMapSection = ({
  inherentScore,
  residualScore,
  previousInherentScore = "",
  previousResidualScore = "",
  riskName,
  compact = false,
  onNext
}: RiskHeatMapSectionProps) => {
  const getPositionFromScore = (score: string = "0") => {
    const numScore = parseFloat(score);
    // Calculate positions based on score (0-5 scale)
    // Higher score = higher severity = top left
    // Lower score = lower severity = bottom right
    // Map 0-5 to 0-100% for positioning
    const row = 5 - Math.min(5, Math.max(1, Math.ceil(numScore))) + 1;
    const col = Math.min(5, Math.max(1, Math.ceil(numScore)));
    
    // Calculate positions in %
    const left = (col - 1) * 20 + 10; // 5 columns, 20% each, center at 10%
    const top = (row - 1) * 20 + 10;  // 5 rows, 20% each, center at 10%
    
    return { left, top, row, col };
  };
  
  const inherentPosition = getPositionFromScore(inherentScore);
  const residualPosition = getPositionFromScore(residualScore);
  const previousInherentPosition = getPositionFromScore(previousInherentScore);
  const previousResidualPosition = getPositionFromScore(previousResidualScore);
  
  const appetiteThreshold = "2.5"; // This should come from formState.riskAppetite.threshold
  const appetitePosition = getPositionFromScore(appetiteThreshold);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-slate-700">Risk Heat Map</h3>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      <Info className="h-4 w-4 text-slate-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Shows movement from inherent to residual risk position.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="p-4 bg-white border rounded-md">
            <div className="aspect-square relative">
              {/* Heat Map Grid */}
              <div className="grid grid-cols-5 h-full">
                {HEAT_MAP_LEVELS.map((row, rowIndex) => (
                  <React.Fragment key={`row-${rowIndex}`}>
                    {row.map((color, colIndex) => (
                      <div
                        key={`cell-${rowIndex}-${colIndex}`}
                        className="border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </div>
              
              {/* Axes Labels */}
              <div className="absolute left-0 top-0 w-full h-full pointer-events-none">
                <div className="absolute top-0 left-0 transform -translate-y-full text-xs font-medium text-gray-500 p-1">
                  Likelihood
                </div>
                <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs font-medium text-gray-500">
                  Impact
                </div>
                
                <div className="absolute inset-0 border-2 border-dashed border-blue-500 pointer-events-none opacity-60 z-10"
                    style={{
                      clipPath: `polygon(0 ${appetitePosition.top}%, 100% ${appetitePosition.top}%, 100% 100%, 0 100%)`
                    }}
                />
                
                <div className="absolute -right-16 top-[40%] transform -rotate-90 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Risk Appetite
                </div>
              </div>
              
              {/* Previous Inherent Risk Position */}
              {previousInherentScore && (
                <div 
                  className="absolute w-6 h-6 rounded-full bg-red-100 border border-red-400 opacity-50 flex items-center justify-center z-20"
                  style={{ 
                    left: `calc(${previousInherentPosition.left}% - 12px)`, 
                    top: `calc(${previousInherentPosition.top}% - 12px)` 
                  }}
                >
                  <span className="text-[10px] font-bold text-red-600">I</span>
                </div>
              )}
              
              {/* Previous Residual Risk Position */}
              {previousResidualScore && (
                <div 
                  className="absolute w-6 h-6 rounded-full bg-green-100 border border-green-400 opacity-50 flex items-center justify-center z-20"
                  style={{ 
                    left: `calc(${previousResidualPosition.left}% - 12px)`, 
                    top: `calc(${previousResidualPosition.top}% - 12px)` 
                  }}
                >
                  <span className="text-[10px] font-bold text-green-600">R</span>
                </div>
              )}
              
              {/* Inherent Risk Position */}
              <div 
                className="absolute w-8 h-8 rounded-full bg-red-200 border-2 border-red-600 flex items-center justify-center z-30"
                style={{ 
                  left: `calc(${inherentPosition.left}% - 16px)`, 
                  top: `calc(${inherentPosition.top}% - 16px)` 
                }}
              >
                <span className="text-xs font-bold text-red-800">I</span>
              </div>
              
              {/* Residual Risk Position */}
              <div 
                className="absolute w-8 h-8 rounded-full bg-green-200 border-2 border-green-600 flex items-center justify-center z-30"
                style={{ 
                  left: `calc(${residualPosition.left}% - 16px)`, 
                  top: `calc(${residualPosition.top}% - 16px)` 
                }}
              >
                <span className="text-xs font-bold text-green-800">R</span>
              </div>
              
              {/* Risk Movement Arrow */}
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none z-20" 
                style={{ overflow: "visible" }}
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
                    <polygon points="0 0, 10 3.5, 0 7" fill="#4b5563" />
                  </marker>
                </defs>
                <line
                  x1={`${inherentPosition.left}%`}
                  y1={`${inherentPosition.top}%`}
                  x2={`${residualPosition.left}%`}
                  y2={`${residualPosition.top}%`}
                  stroke="#4b5563"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  markerEnd="url(#arrowhead)"
                />
              </svg>
            </div>
            
            {/* Legend */}
            <div className="flex justify-center mt-4 gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-200 border border-red-600"></div>
                <span>Inherent Risk</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-200 border border-green-600"></div>
                <span>Residual Risk</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border-b border-dashed border-blue-500"></div>
                <span>Appetite Threshold</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:w-72">
          <h3 className="font-medium text-slate-700 mb-3">Risk Summary</h3>
          <Card className="p-4 bg-slate-50">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-slate-500 mb-1">Risk Name</div>
                <div className="font-medium">{riskName}</div>
              </div>
              
              <div>
                <div className="text-sm text-slate-500 mb-1">Inherent Risk</div>
                <Badge 
                  className={`text-white ${parseFloat(inherentScore) >= 4 ? 'bg-red-600' : 
                    parseFloat(inherentScore) >= 3 ? 'bg-orange-500' : 
                    parseFloat(inherentScore) >= 2 ? 'bg-yellow-500' : 
                    'bg-green-500'}`}
                >
                  Score: {inherentScore}
                </Badge>
              </div>
              
              <div>
                <div className="text-sm text-slate-500 mb-1">Residual Risk</div>
                <Badge 
                  className={`text-white ${parseFloat(residualScore) >= 4 ? 'bg-red-600' : 
                    parseFloat(residualScore) >= 3 ? 'bg-orange-500' : 
                    parseFloat(residualScore) >= 2 ? 'bg-yellow-500' : 
                    'bg-green-500'}`}
                >
                  Score: {residualScore}
                </Badge>
              </div>
              
              <div>
                <div className="text-sm text-slate-500 mb-1">Risk Reduction</div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                  <Badge 
                    variant="outline" 
                    className="bg-blue-50 text-blue-700"
                  >
                    {(parseFloat(inherentScore) - parseFloat(residualScore)).toFixed(1)} points reduction
                  </Badge>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-slate-500 mb-1">Risk Appetite Status</div>
                <Badge 
                  className={`${parseFloat(residualScore) <= parseFloat(appetiteThreshold) ? 
                    'bg-green-100 text-green-700' : 
                    'bg-red-100 text-red-700'}`}
                >
                  {parseFloat(residualScore) <= parseFloat(appetiteThreshold) ? 
                    'Within Appetite' : 
                    'Exceeds Appetite'}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {!compact && (
        <div className="flex justify-end">
          <Button onClick={onNext}>Continue</Button>
        </div>
      )}
    </div>
  );
};

export default RiskHeatMapSection;
