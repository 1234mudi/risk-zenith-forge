
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingDown, TrendingUp, Activity } from "lucide-react";
import { format } from "date-fns";

type HistoricalAssessment = {
  assessmentDate: string;
  inherentRatingScore: string;
  controlEffectivenessScore: string;
  residualRatingScore: string;
  inherentFactors: any[];
  controls: any[];
  residualFactors: any[];
  assessor: string;
  notes?: string;
};

type HistoricalAssessmentsDialogProps = {
  historicalAssessments: HistoricalAssessment[];
  onCopyAssessment: (assessment: HistoricalAssessment) => void;
};

const HistoricalAssessmentsDialog = ({ 
  historicalAssessments, 
  onCopyAssessment 
}: HistoricalAssessmentsDialogProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const getScoreColor = (score: string) => {
    const numScore = parseFloat(score || "0");
    if (numScore >= 4) return "bg-red-100 text-red-700 border-red-200";
    if (numScore >= 3) return "bg-orange-100 text-orange-700 border-orange-200";
    if (numScore >= 2) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  const getTrendIcon = (current: string, previous: string) => {
    const currentScore = parseFloat(current || "0");
    const previousScore = parseFloat(previous || "0");
    
    if (currentScore < previousScore) {
      return <TrendingDown className="h-4 w-4 text-green-500" />;
    } else if (currentScore > previousScore) {
      return <TrendingUp className="h-4 w-4 text-red-500" />;
    }
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2 flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>View Historical Assessments</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Historical Risk Assessments</DialogTitle>
          <DialogDescription>
            View previous assessment data and trends over time
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="inherent">Inherent Risk</TabsTrigger>
            <TabsTrigger value="control">Control Effectiveness</TabsTrigger>
            <TabsTrigger value="residual">Residual Risk</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-md p-4 bg-blue-50">
                <h3 className="font-medium text-blue-800 mb-2">Inherent Risk Trend</h3>
                <div className="space-y-2">
                  {historicalAssessments.map((assessment, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {format(new Date(assessment.assessmentDate), "MMM d, yyyy")}
                      </span>
                      <Badge className={getScoreColor(assessment.inherentRatingScore)}>
                        {assessment.inherentRatingScore}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border rounded-md p-4 bg-amber-50">
                <h3 className="font-medium text-amber-800 mb-2">Control Effectiveness Trend</h3>
                <div className="space-y-2">
                  {historicalAssessments.map((assessment, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {format(new Date(assessment.assessmentDate), "MMM d, yyyy")}
                      </span>
                      <Badge className={getScoreColor(assessment.controlEffectivenessScore)}>
                        {assessment.controlEffectivenessScore}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border rounded-md p-4 bg-green-50">
                <h3 className="font-medium text-green-800 mb-2">Residual Risk Trend</h3>
                <div className="space-y-2">
                  {historicalAssessments.map((assessment, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {format(new Date(assessment.assessmentDate), "MMM d, yyyy")}
                      </span>
                      <Badge className={getScoreColor(assessment.residualRatingScore)}>
                        {assessment.residualRatingScore}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessor</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inherent</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Control</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Residual</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {historicalAssessments.map((assessment, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(assessment.assessmentDate), "MMM d, yyyy")}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {assessment.assessor}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getScoreColor(assessment.inherentRatingScore)}`}>
                          {assessment.inherentRatingScore}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getScoreColor(assessment.controlEffectivenessScore)}`}>
                          {assessment.controlEffectivenessScore}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getScoreColor(assessment.residualRatingScore)}`}>
                          {assessment.residualRatingScore}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onCopyAssessment(assessment)}
                        >
                          Copy Data
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="inherent" className="space-y-4">
            {historicalAssessments.map((assessment, index) => (
              <div key={index} className="border rounded-md overflow-hidden">
                <div className="bg-blue-50 p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-blue-500" />
                    <h3 className="font-medium text-blue-800">
                      Assessment: {format(new Date(assessment.assessmentDate), "MMMM d, yyyy")}
                    </h3>
                    <Badge className={getScoreColor(assessment.inherentRatingScore)}>
                      Score: {assessment.inherentRatingScore}
                    </Badge>
                  </div>
                  <div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onCopyAssessment(assessment)}
                    >
                      Copy Data
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm font-medium text-gray-500 px-4">
                    <div className="md:col-span-3">Factor Name</div>
                    <div className="md:col-span-2">Rating</div>
                    <div className="md:col-span-2">Weight (%)</div>
                    <div className="md:col-span-5">Comments</div>
                  </div>
                  
                  {assessment.inherentFactors.map((factor) => (
                    <div key={factor.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 rounded-md bg-gray-50">
                      <div className="md:col-span-3 font-medium">{factor.name}</div>
                      <div className="md:col-span-2">
                        <Badge className={getScoreColor(factor.value)}>
                          {factor.value}
                        </Badge>
                      </div>
                      <div className="md:col-span-2">{factor.weighting}%</div>
                      <div className="md:col-span-5">
                        <div className="text-sm text-gray-600">{factor.comments}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="control" className="space-y-4">
            {historicalAssessments.map((assessment, index) => (
              <div key={index} className="border rounded-md overflow-hidden">
                <div className="bg-amber-50 p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-amber-500" />
                    <h3 className="font-medium text-amber-800">
                      Assessment: {format(new Date(assessment.assessmentDate), "MMMM d, yyyy")}
                    </h3>
                    <Badge className={getScoreColor(assessment.controlEffectivenessScore)}>
                      Score: {assessment.controlEffectivenessScore}
                    </Badge>
                  </div>
                  <div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onCopyAssessment(assessment)}
                    >
                      Copy Data
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  {assessment.controls.map((control) => (
                    <div key={control.id} className="border rounded-md p-4 bg-white">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{control.name} ({control.controlId})</h4>
                        <Badge className={getScoreColor(control.effectiveness)}>
                          Effectiveness: {control.effectiveness}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                          <span className="text-xs text-gray-500">Design Effectiveness</span>
                          <p className="text-sm">{control.designEffect}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Operating Effectiveness</span>
                          <p className="text-sm">{control.operativeEffect}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 bg-gray-50 p-2 rounded-md">
                        <div>
                          <span className="text-xs text-gray-500">Key Control</span>
                          <p className="text-sm">{control.isKeyControl ? "Yes" : "No"}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Category</span>
                          <p className="text-sm">{control.category}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Weight</span>
                          <p className="text-sm">{control.weighting}%</p>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">Comments</span>
                        <p className="text-sm">{control.comments}</p>
                      </div>
                      
                      {control.testResults && (
                        <div className="mt-2 bg-gray-100 p-2 rounded-md">
                          <span className="text-xs font-medium text-gray-700">Test Results</span>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            <div>
                              <span className="text-xs text-gray-500">Last Tested</span>
                              <p className="text-sm">{control.testResults.lastTested}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Result</span>
                              <p className="text-sm">{control.testResults.result}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Tester</span>
                              <p className="text-sm">{control.testResults.tester}</p>
                            </div>
                          </div>
                          <div className="mt-1">
                            <span className="text-xs text-gray-500">Findings</span>
                            <p className="text-sm">{control.testResults.findings}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="residual" className="space-y-4">
            {historicalAssessments.map((assessment, index) => (
              <div key={index} className="border rounded-md overflow-hidden">
                <div className="bg-green-50 p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-green-500" />
                    <h3 className="font-medium text-green-800">
                      Assessment: {format(new Date(assessment.assessmentDate), "MMMM d, yyyy")}
                    </h3>
                    <Badge className={getScoreColor(assessment.residualRatingScore)}>
                      Score: {assessment.residualRatingScore}
                    </Badge>
                  </div>
                  <div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onCopyAssessment(assessment)}
                    >
                      Copy Data
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm font-medium text-gray-500 px-4">
                    <div className="md:col-span-3">Factor Name</div>
                    <div className="md:col-span-2">Rating</div>
                    <div className="md:col-span-2">Weight (%)</div>
                    <div className="md:col-span-5">Comments</div>
                  </div>
                  
                  {assessment.residualFactors.map((factor) => (
                    <div key={factor.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 rounded-md bg-gray-50">
                      <div className="md:col-span-3 font-medium">{factor.name}</div>
                      <div className="md:col-span-2">
                        <Badge className={getScoreColor(factor.value)}>
                          {factor.value}
                        </Badge>
                      </div>
                      <div className="md:col-span-2">{factor.weighting}%</div>
                      <div className="md:col-span-5">
                        <div className="text-sm text-gray-600">{factor.comments}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default HistoricalAssessmentsDialog;
