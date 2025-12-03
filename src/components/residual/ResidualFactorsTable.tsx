
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Sparkles } from "lucide-react";
import { FactorProps } from "@/types/control-types";
import EditableGrid, { EditableGridColumn } from "@/components/ui/editable-grid";
import { useAIAutofill } from "@/hooks/useAIAutofill";
import { useForm } from "@/contexts/FormContext";
import { isSectionChallenged } from "@/components/review/ReviewChallengeIndicator";

interface ResidualFactorsTableProps {
  factors: FactorProps[];
  localShowWeights: boolean;
  handleAddFactor: (parentId: string) => void;
  handleRemoveFactor: (parentId: string, childId?: string) => void;
  handleFactorChange: (parentId: string, field: keyof FactorProps, value: any, childId?: string) => void;
  getCellColor: (value: string) => string;
}

const ResidualFactorsTable = ({
  factors,
  localShowWeights,
  handleAddFactor,
  handleRemoveFactor,
  handleFactorChange
}: ResidualFactorsTableProps) => {
  
  const { autofillRating, autofillComment, autofillAll, isLoading, loadingCells } = useAIAutofill();
  const { formState } = useForm();
  
  // Check if this section is challenged
  const isResidualChallenged = formState.rcsaStatus === "Returned for Rework/Challenged" && 
    formState.challengeDetails?.reasons ? 
    isSectionChallenged("residual", formState.challengeDetails.reasons) : false;
  
  const gridData = factors.flatMap(parent =>
    parent.children?.map(child => ({
      ...child,
      parentId: parent.id
    })) || []
  );

  const handleAIAutofill = async (rowIndex: number, field: string, aiType: 'rating' | 'comment') => {
    const rowData = gridData[rowIndex];
    const context = {
      factorName: rowData.name,
      description: rowData.description,
      riskContext: 'Residual risk assessment after controls',
      rating: rowData.value
    };

    if (aiType === 'rating') {
      const rating = await autofillRating(context);
      if (rating) handleFactorChange(rowData.parentId, 'value', rating, rowData.id);
    } else if (aiType === 'comment') {
      const comment = await autofillComment(context);
      if (comment) handleFactorChange(rowData.parentId, 'comments', comment, rowData.id);
    }
  };

  const handleAIAutofillAll = async () => {
    const results = await autofillAll({
      riskContext: 'Residual risk assessment after controls',
      factors: gridData.map(r => ({ id: r.id, name: r.name, description: r.description }))
    });

    if (results && Array.isArray(results)) {
      results.forEach((result: any) => {
        const row = gridData.find(r => r.id === result.id);
        if (row) {
          if (result.rating) handleFactorChange(row.parentId, 'value', result.rating.toString(), row.id);
          if (result.comment) handleFactorChange(row.parentId, 'comments', result.comment, row.id);
        }
      });
    }
  };

  const columns: EditableGridColumn[] = [
    { field: "name", header: "Factor", editable: true, type: "text" },
    { field: "description", header: "Description", editable: true, type: "text" },
    { field: "value", header: "Overall", editable: true, type: "rating", enableAI: true, aiType: 'rating' },
    { field: "comments", header: "Comments", editable: true, type: "textarea", enableAI: true, aiType: 'comment' }
  ];

  if (localShowWeights) {
    columns.splice(3, 0, {
      field: "weighting",
      header: "Rating Weight (%)",
      editable: true,
      type: "number"
    });
  }

  const handleDataChange = (newData: any[]) => {
    newData.forEach(item => {
      if (item.parentId) {
        const parent = factors.find(f => f.id === item.parentId);
        if (parent && parent.children) {
          const child = parent.children.find(c => c.id === item.id);
          if (child) {
            Object.keys(item).forEach(key => {
              if (key !== 'id' && key !== 'parentId' && child[key as keyof typeof child] !== item[key]) {
                handleFactorChange(item.parentId, key as keyof FactorProps, item[key], item.id);
              }
            });
          }
        }
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={() => handleAddFactor(factors[0]?.id || '')} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" /> Add Factor
        </Button>
        <Button onClick={handleAIAutofillAll} disabled={isLoading} className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
          {isLoading ? <><Sparkles className="h-4 w-4 mr-2 animate-pulse" />AI Autofilling...</> : <><Sparkles className="h-4 w-4 mr-2" />AI Autofill All</>}
        </Button>
      </div>

      <EditableGrid columns={columns} data={gridData} onDataChange={handleDataChange} keyField="id"
        onRemoveRow={(index) => {
          const item = gridData[index];
          if (item.parentId) handleRemoveFactor(item.parentId, item.id);
        }}
        onAIAutofill={handleAIAutofill}
        aiLoadingCells={loadingCells}
        sectionId="residual"
        enableCellComments
        allowBulkEdit
        isSectionChallenged={isResidualChallenged}
      />
    </div>
  );
};

export default ResidualFactorsTable;
