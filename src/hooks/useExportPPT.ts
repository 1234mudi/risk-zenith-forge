import { useState } from "react";
import pptxgen from "pptxgenjs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AssessmentData {
  risk: string;
  eraId: string;
  assessmentId: string;
  assessmentDate: string;
  inherentScore: string;
  controlScore: string;
  residualScore: string;
  riskAppetite: string;
  isWithinAppetite: boolean;
  riskHierarchy: string;
}

interface AssessmentSummary {
  executiveSummary: string;
  inherentRiskSummary: string;
  controlSummary: string;
  residualRiskSummary: string;
  recommendations: string[];
}

const getScoreLabel = (score: string) => {
  const numScore = parseFloat(score || "0");
  if (numScore >= 4) return "High";
  if (numScore >= 3) return "Medium";
  if (numScore >= 2) return "Low";
  return "Very Low";
};

const getScoreColor = (score: string): string => {
  const numScore = parseFloat(score || "0");
  if (numScore >= 4) return "DC2626";
  if (numScore >= 3) return "F97316";
  if (numScore >= 2) return "EAB308";
  return "22C55E";
};

export const useExportPPT = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const generateSummary = async (assessmentData: AssessmentData): Promise<AssessmentSummary | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-assessment-summary', {
        body: {
          assessmentData: {
            ...assessmentData,
            inherentLabel: getScoreLabel(assessmentData.inherentScore),
            residualLabel: getScoreLabel(assessmentData.residualScore),
          }
        }
      });

      if (error) throw error;
      return data.summary;
    } catch (error) {
      console.error("Failed to generate summary:", error);
      return null;
    }
  };

  const exportToPPT = async (assessmentData: AssessmentData) => {
    setIsExporting(true);
    
    try {
      toast({
        title: "Generating Export",
        description: "Creating AI summary and building presentation...",
      });

      // Generate AI summary
      const summary = await generateSummary(assessmentData);

      const pptx = new pptxgen();
      pptx.title = `Risk Assessment - ${assessmentData.risk}`;
      pptx.author = "Risk Assessment System";
      pptx.company = "Enterprise Risk Management";

      // Slide 1: Title Slide
      const titleSlide = pptx.addSlide();
      titleSlide.addText("Risk Assessment Report", {
        x: 0.5, y: 1.5, w: 9, h: 1,
        fontSize: 36, bold: true, color: "1E3A5F",
        align: "center"
      });
      titleSlide.addText(assessmentData.risk, {
        x: 0.5, y: 2.6, w: 9, h: 0.8,
        fontSize: 24, color: "475569",
        align: "center"
      });
      titleSlide.addText(`ERA ID: ${assessmentData.eraId}  |  Date: ${assessmentData.assessmentDate}`, {
        x: 0.5, y: 4.5, w: 9, h: 0.5,
        fontSize: 12, color: "94A3B8",
        align: "center"
      });

      // Slide 2: Executive Summary
      const summarySlide = pptx.addSlide();
      summarySlide.addText("Executive Summary", {
        x: 0.5, y: 0.3, w: 9, h: 0.6,
        fontSize: 28, bold: true, color: "1E3A5F"
      });
      
      summarySlide.addText(summary?.executiveSummary || "Risk assessment completed. Review detailed sections for comprehensive analysis.", {
        x: 0.5, y: 1.1, w: 9, h: 1,
        fontSize: 14, color: "334155",
        valign: "top"
      });

      // Risk scores summary box
      summarySlide.addShape(pptx.ShapeType.rect, {
        x: 0.5, y: 2.3, w: 9, h: 1.8,
        fill: { color: "F8FAFC" },
        line: { color: "E2E8F0", pt: 1 }
      });

      // Score indicators
      const scores = [
        { label: "Inherent Risk", score: assessmentData.inherentScore, x: 1 },
        { label: "Control Effectiveness", score: assessmentData.controlScore, x: 4 },
        { label: "Residual Risk", score: assessmentData.residualScore, x: 7 }
      ];

      scores.forEach(({ label, score, x }) => {
        summarySlide.addText(label, {
          x: x, y: 2.5, w: 2.5, h: 0.4,
          fontSize: 11, color: "64748B", align: "center"
        });
        summarySlide.addShape(pptx.ShapeType.ellipse, {
          x: x + 0.75, y: 3, w: 1, h: 1,
          fill: { color: getScoreColor(score) }
        });
        summarySlide.addText(score, {
          x: x, y: 3.2, w: 2.5, h: 0.6,
          fontSize: 20, bold: true, color: "FFFFFF", align: "center"
        });
      });

      // Appetite status
      summarySlide.addText(`Risk Appetite: ${assessmentData.riskAppetite} - ${assessmentData.isWithinAppetite ? "✓ Within Appetite" : "⚠ Outside Appetite"}`, {
        x: 0.5, y: 4.3, w: 9, h: 0.4,
        fontSize: 12, 
        color: assessmentData.isWithinAppetite ? "16A34A" : "DC2626",
        align: "center"
      });

      // Slide 3: Inherent Risk
      const inherentSlide = pptx.addSlide();
      inherentSlide.addText("Inherent Risk Assessment", {
        x: 0.5, y: 0.3, w: 9, h: 0.6,
        fontSize: 28, bold: true, color: "1E3A5F"
      });
      
      inherentSlide.addShape(pptx.ShapeType.ellipse, {
        x: 0.5, y: 1.2, w: 1.2, h: 1.2,
        fill: { color: getScoreColor(assessmentData.inherentScore) }
      });
      inherentSlide.addText(assessmentData.inherentScore, {
        x: 0.5, y: 1.5, w: 1.2, h: 0.6,
        fontSize: 24, bold: true, color: "FFFFFF", align: "center"
      });
      inherentSlide.addText(getScoreLabel(assessmentData.inherentScore), {
        x: 1.9, y: 1.5, w: 2, h: 0.5,
        fontSize: 18, bold: true, color: getScoreColor(assessmentData.inherentScore)
      });

      inherentSlide.addText(summary?.inherentRiskSummary || "Inherent risk represents the natural level of risk before any controls are applied. This assessment evaluates the potential impact and likelihood of risk events.", {
        x: 0.5, y: 2.8, w: 9, h: 1.5,
        fontSize: 13, color: "475569",
        valign: "top"
      });

      inherentSlide.addText("Add your inherent risk factor details here", {
        x: 0.5, y: 4.5, w: 9, h: 0.5,
        fontSize: 11, italic: true, color: "94A3B8"
      });

      // Slide 4: Control Effectiveness
      const controlSlide = pptx.addSlide();
      controlSlide.addText("Control Effectiveness", {
        x: 0.5, y: 0.3, w: 9, h: 0.6,
        fontSize: 28, bold: true, color: "1E3A5F"
      });

      controlSlide.addShape(pptx.ShapeType.ellipse, {
        x: 0.5, y: 1.2, w: 1.2, h: 1.2,
        fill: { color: getScoreColor(assessmentData.controlScore) }
      });
      controlSlide.addText(assessmentData.controlScore, {
        x: 0.5, y: 1.5, w: 1.2, h: 0.6,
        fontSize: 24, bold: true, color: "FFFFFF", align: "center"
      });
      
      controlSlide.addText(summary?.controlSummary || "Controls are evaluated based on their design effectiveness and operational performance. The overall score reflects the aggregate effectiveness of all mapped controls.", {
        x: 0.5, y: 2.8, w: 9, h: 1.5,
        fontSize: 13, color: "475569",
        valign: "top"
      });

      controlSlide.addText("Add your control details and effectiveness breakdown here", {
        x: 0.5, y: 4.5, w: 9, h: 0.5,
        fontSize: 11, italic: true, color: "94A3B8"
      });

      // Slide 5: Residual Risk
      const residualSlide = pptx.addSlide();
      residualSlide.addText("Residual Risk Assessment", {
        x: 0.5, y: 0.3, w: 9, h: 0.6,
        fontSize: 28, bold: true, color: "1E3A5F"
      });

      residualSlide.addShape(pptx.ShapeType.ellipse, {
        x: 0.5, y: 1.2, w: 1.2, h: 1.2,
        fill: { color: getScoreColor(assessmentData.residualScore) }
      });
      residualSlide.addText(assessmentData.residualScore, {
        x: 0.5, y: 1.5, w: 1.2, h: 0.6,
        fontSize: 24, bold: true, color: "FFFFFF", align: "center"
      });
      residualSlide.addText(getScoreLabel(assessmentData.residualScore), {
        x: 1.9, y: 1.5, w: 2, h: 0.5,
        fontSize: 18, bold: true, color: getScoreColor(assessmentData.residualScore)
      });

      residualSlide.addText(summary?.residualRiskSummary || "Residual risk is the remaining risk after controls have been applied. This represents the actual exposure that needs to be monitored and managed.", {
        x: 0.5, y: 2.8, w: 9, h: 1.5,
        fontSize: 13, color: "475569",
        valign: "top"
      });

      // Slide 6: Recommendations
      const recsSlide = pptx.addSlide();
      recsSlide.addText("Recommendations & Next Steps", {
        x: 0.5, y: 0.3, w: 9, h: 0.6,
        fontSize: 28, bold: true, color: "1E3A5F"
      });

      const recommendations = summary?.recommendations || [
        "Continue monitoring key risk indicators",
        "Review control effectiveness quarterly",
        "Update risk assessment as conditions change"
      ];

      recommendations.forEach((rec, idx) => {
        recsSlide.addText(`${idx + 1}. ${rec}`, {
          x: 0.5, y: 1.2 + (idx * 0.7), w: 9, h: 0.6,
          fontSize: 14, color: "334155",
          bullet: false
        });
      });

      recsSlide.addText("Add additional recommendations or action items here", {
        x: 0.5, y: 4.5, w: 9, h: 0.5,
        fontSize: 11, italic: true, color: "94A3B8"
      });

      // Download the file
      await pptx.writeFile({ fileName: `Risk_Assessment_${assessmentData.eraId}_${new Date().toISOString().split('T')[0]}.pptx` });

      toast({
        title: "Export Complete",
        description: "Your presentation has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to generate presentation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return { exportToPPT, isExporting };
};
