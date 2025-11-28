
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { FactorProps } from "@/types/control-types";
import EditableGrid, { EditableGridColumn } from "@/components/ui/editable-grid";

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
  
  const gridData = factors.flatMap(parent => 
    parent.children?.map(child => ({
      ...child,
      parentId: parent.id
    })) || []
  );

  const columns: EditableGridColumn[] = [
    {
      field: "name",
      header: "Factor",
      editable: true,
      type: "text"
    },
    {
      field: "description",
      header: "Description",
      editable: true,
      type: "text"
    },
    {
      field: "value",
      header: "Rating",
      editable: true,
      type: "select",
      options: [
        { value: "1", label: "Very Low (1)", className: "text-green-500" },
        { value: "2", label: "Low (2)", className: "text-yellow-500" },
        { value: "3", label: "Medium (3)", className: "text-orange-500" },
        { value: "4", label: "High (4)", className: "text-red-500" },
        { value: "5", label: "Very High (5)", className: "text-red-600 font-semibold" }
      ]
    },
    {
      field: "comments",
      header: "Comments",
      editable: true,
      type: "textarea"
    }
  ];

  if (localShowWeights) {
    columns.splice(3, 0, {
      field: "weighting",
      header: "Weight (%)",
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAddFactor(factors[0]?.id || '')}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" /> Add Factor
        </Button>
      </div>

      <EditableGrid
        columns={columns}
        data={gridData}
        onDataChange={handleDataChange}
        keyField="id"
        onRemoveRow={(index) => {
          const item = gridData[index];
          if (item.parentId) {
            handleRemoveFactor(item.parentId, item.id);
          }
        }}
        allowBulkEdit
      />
    </div>
  );
};

export default ResidualFactorsTable;
