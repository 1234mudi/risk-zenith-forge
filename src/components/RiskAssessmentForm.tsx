
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FormHeader from "@/components/FormHeader";
import MainFormSection from "@/components/MainFormSection";
import InherentRatingSection from "@/components/InherentRatingSection";
import ControlEffectivenessSection from "@/components/ControlEffectivenessSection";
import ResidualRatingSection from "@/components/ResidualRatingSection";
import IssuesSection from "@/components/IssuesSection";
import CommentsAttachmentsSection from "@/components/CommentsAttachmentsSection";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useForm } from "@/contexts/FormContext";

const RiskAssessmentForm = () => {
  const [activeTab, setActiveTab] = useState("main");
  const { toast } = useToast();
  const { formState } = useForm();

  const handleSubmit = () => {
    toast({
      title: "Form Submitted",
      description: "Your risk assessment has been submitted successfully.",
    });
    console.log("Form data submitted:", formState);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <FormHeader />
      
      <Card className="mt-6 shadow-md">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-2xl font-bold text-slate-800">Enhanced Risk Assessment</CardTitle>
          <CardDescription className="text-slate-600">
            Complete the assessment by filling all required sections
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs defaultValue="main" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start px-6 pt-4 bg-white border-b h-auto flex-wrap">
              <TabsTrigger value="main" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Main Form
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
              <TabsTrigger value="issues" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Issues
              </TabsTrigger>
              <TabsTrigger value="comments" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Comments & Attachments
              </TabsTrigger>
            </TabsList>
            
            <div className="p-6">
              <TabsContent value="main">
                <MainFormSection onNext={() => setActiveTab("inherent")} />
              </TabsContent>
              
              <TabsContent value="inherent">
                <InherentRatingSection onNext={() => setActiveTab("control")} />
              </TabsContent>
              
              <TabsContent value="control">
                <ControlEffectivenessSection onNext={() => setActiveTab("residual")} />
              </TabsContent>
              
              <TabsContent value="residual">
                <ResidualRatingSection onNext={() => setActiveTab("issues")} />
              </TabsContent>
              
              <TabsContent value="issues">
                <IssuesSection onNext={() => setActiveTab("comments")} />
              </TabsContent>
              
              <TabsContent value="comments">
                <CommentsAttachmentsSection />
              </TabsContent>
            </div>
          </Tabs>
          
          <div className="flex justify-end p-6 pt-2 gap-4 border-t mt-4">
            <Button variant="outline" onClick={() => {
              if (activeTab === "main") return;
              const tabs = ["main", "inherent", "control", "residual", "issues", "comments"];
              const currentIndex = tabs.indexOf(activeTab);
              setActiveTab(tabs[currentIndex - 1]);
            }} disabled={activeTab === "main"}>
              Previous
            </Button>
            
            {activeTab !== "comments" ? (
              <Button onClick={() => {
                const tabs = ["main", "inherent", "control", "residual", "issues", "comments"];
                const currentIndex = tabs.indexOf(activeTab);
                setActiveTab(tabs[currentIndex + 1]);
              }}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                Submit Assessment
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAssessmentForm;
