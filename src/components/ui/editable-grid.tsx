
import React, { useState, useEffect, useRef } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Edit, Plus, Trash2 } from "lucide-react";

export type EditableGridColumn = {
  field: string;
  header: string;
  width?: string;
  editable?: boolean;
  type?: 'text' | 'number' | 'select' | 'textarea' | 'rating';
  options?: { label: string; value: string; className?: string }[];
  className?: string;
  cellClassName?: (value: any) => string;
};

type EditableGridProps = {
  columns: EditableGridColumn[];
  data: any[];
  onDataChange: (data: any[]) => void;
  keyField?: string;
  onAddRow?: () => void;
  onRemoveRow?: (index: number) => void;
  allowBulkEdit?: boolean;
  maxHeight?: string;
  className?: string; // Added className prop to accept custom styling
};

const EditableGrid = ({
  columns,
  data,
  onDataChange,
  keyField = 'id',
  onAddRow,
  onRemoveRow,
  allowBulkEdit = true,
  maxHeight = '500px',
  className, // Add the className prop to the component props
}: EditableGridProps) => {
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; field: string } | null>(null);
  const [editValue, setEditValue] = useState<any>('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkEditField, setBulkEditField] = useState<string | null>(null);
  const [bulkEditValue, setBulkEditValue] = useState<any>('');
  const cellRef = useRef<HTMLDivElement>(null);

  const startEditing = (rowIndex: number, field: string, value: any) => {
    setEditingCell({ rowIndex, field });
    setEditValue(value);
  };

  const cancelEditing = () => {
    setEditingCell(null);
  };

  const saveEdit = () => {
    if (!editingCell) return;

    const newData = [...data];
    newData[editingCell.rowIndex] = {
      ...newData[editingCell.rowIndex],
      [editingCell.field]: editValue,
    };
    onDataChange(newData);
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const toggleRowSelection = (rowIndex: number) => {
    setSelectedRows((prev) =>
      prev.includes(rowIndex)
        ? prev.filter((i) => i !== rowIndex)
        : [...prev, rowIndex]
    );
  };

  const toggleAllRows = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((_, index) => index));
    }
  };

  const startBulkEdit = (field: string) => {
    if (selectedRows.length === 0) return;
    setBulkEditMode(true);
    setBulkEditField(field);
    setBulkEditValue('');
  };

  const saveBulkEdit = () => {
    if (!bulkEditField) return;

    const newData = [...data];
    selectedRows.forEach((rowIndex) => {
      newData[rowIndex] = {
        ...newData[rowIndex],
        [bulkEditField]: bulkEditValue,
      };
    });
    onDataChange(newData);
    cancelBulkEdit();
  };

  const cancelBulkEdit = () => {
    setBulkEditMode(false);
    setBulkEditField(null);
    setBulkEditValue('');
  };

  // Handle clicks outside the cell to save changes
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cellRef.current && !cellRef.current.contains(event.target as Node)) {
        saveEdit();
      }
    };

    if (editingCell) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingCell, editValue]);

  const renderCellContent = (column: EditableGridColumn, rowData: any, rowIndex: number) => {
    const value = rowData[column.field];
    const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.field === column.field;
    const isBulkEditing = bulkEditMode && bulkEditField === column.field && selectedRows.includes(rowIndex);

    // If this cell is being bulk edited
    if (isBulkEditing) {
      return <div className="italic text-gray-500">Will be updated...</div>;
    }

    // If this cell is being edited individually
    if (isEditing) {
      return (
        <div ref={cellRef} className="flex items-center">
          {column.type === 'select' ? (
            <Select
              value={editValue ? editValue.toString() : ""}
              onValueChange={(val) => setEditValue(val)}
            >
              <SelectTrigger className="w-full h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {column.options?.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className={option.className}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : column.type === 'textarea' ? (
            <Textarea
              value={editValue || ''}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="min-h-[60px] text-sm"
            />
          ) : (
            <Input
              type={column.type === 'number' ? 'number' : 'text'}
              value={editValue || ''}
              onChange={(e) => setEditValue(column.type === 'number' ? parseFloat(e.target.value) : e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="h-8"
            />
          )}

          <div className="flex ml-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={saveEdit}
              className="h-7 w-7 text-green-500"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={cancelEditing}
              className="h-7 w-7 text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }

    // Display formatted value (not being edited)
    if (column.type === 'rating') {
      const numValue = parseInt(value || '0');
      let ratingClass = 'px-2 py-1 rounded text-sm font-medium ';
      
      if (numValue >= 4) ratingClass += 'bg-red-50 text-red-600';
      else if (numValue >= 3) ratingClass += 'bg-orange-50 text-orange-600';
      else if (numValue >= 2) ratingClass += 'bg-yellow-50 text-yellow-600';
      else ratingClass += 'bg-green-50 text-green-600';
      
      let label = '';
      if (value === '1') label = 'Very Low (1)';
      else if (value === '2') label = 'Low (2)';
      else if (value === '3') label = 'Medium (3)';
      else if (value === '4') label = 'High (4)';
      else if (value === '5') label = 'Very High (5)';
      
      return <div className={ratingClass}>{label}</div>;
    }
    
    if (column.type === 'select' && column.options) {
      const option = column.options.find(opt => opt.value === value?.toString());
      return <div>{option?.label || value}</div>;
    }

    // Apply custom cell class if provided
    const cellClass = column.cellClassName ? column.cellClassName(value) : '';
    
    return <div className={cellClass}>{value}</div>;
  };

  const renderBulkEditControls = () => {
    if (!bulkEditMode || !bulkEditField) return null;

    const column = columns.find((col) => col.field === bulkEditField);
    if (!column) return null;

    return (
      <div className="bg-blue-50 p-3 flex items-center gap-2 rounded border border-blue-200 mb-3">
        <div className="font-medium">Bulk edit {column.header}:</div>

        {column.type === 'select' ? (
          <Select
            value={bulkEditValue ? bulkEditValue.toString() : ""}
            onValueChange={(val) => setBulkEditValue(val)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={`Select ${column.header}`} />
            </SelectTrigger>
            <SelectContent>
              {column.options?.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className={option.className}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : column.type === 'textarea' ? (
          <Textarea
            value={bulkEditValue || ''}
            onChange={(e) => setBulkEditValue(e.target.value)}
            className="min-h-[60px] w-[300px]"
            placeholder={`Enter ${column.header}`}
          />
        ) : (
          <Input
            type={column.type === 'number' ? 'number' : 'text'}
            value={bulkEditValue || ''}
            onChange={(e) => setBulkEditValue(column.type === 'number' ? parseFloat(e.target.value) : e.target.value)}
            className="w-[200px]"
            placeholder={`Enter ${column.header}`}
          />
        )}

        <div className="flex ml-2">
          <Button onClick={saveBulkEdit} size="sm" className="mr-2">
            Apply to {selectedRows.length} row(s)
          </Button>
          <Button onClick={cancelBulkEdit} variant="outline" size="sm">
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {allowBulkEdit && selectedRows.length > 0 && (
        <div className="bg-slate-100 p-3 rounded border flex items-center justify-between">
          <div className="text-sm font-medium">
            {selectedRows.length} row{selectedRows.length !== 1 ? 's' : ''} selected
          </div>
          <div className="flex gap-2">
            {columns
              .filter((col) => col.editable)
              .map((col) => (
                <Button
                  key={col.field}
                  size="sm"
                  variant="outline"
                  onClick={() => startBulkEdit(col.field)}
                  className="text-xs"
                >
                  Edit {col.header}
                </Button>
              ))}
          </div>
        </div>
      )}

      {renderBulkEditControls()}

      <div className={`rounded-md border ${className || ""}`}>
        <ScrollArea className={`max-h-[${maxHeight}]`}>
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                {allowBulkEdit && (
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={selectedRows.length === data.length && data.length > 0}
                      onCheckedChange={toggleAllRows}
                    />
                  </TableHead>
                )}
                
                {columns.map((column) => (
                  <TableHead 
                    key={column.field}
                    className={column.width ? `w-[${column.width}]` : ''}
                  >
                    {column.header}
                  </TableHead>
                ))}
                
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={row[keyField] || rowIndex}>
                  {allowBulkEdit && (
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(rowIndex)}
                        onCheckedChange={() => toggleRowSelection(rowIndex)}
                      />
                    </TableCell>
                  )}
                  
                  {columns.map((column) => (
                    <TableCell 
                      key={`${rowIndex}-${column.field}`} 
                      className={column.className}
                    >
                      {renderCellContent(column, row, rowIndex)}
                    </TableCell>
                  ))}
                  
                  <TableCell className="text-right space-x-1">
                    {columns.some(col => col.editable) && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          const editableCol = columns.find(col => col.editable);
                          if (editableCol) {
                            startEditing(rowIndex, editableCol.field, row[editableCol.field]);
                          }
                        }}
                        className="h-8 w-8 text-blue-500"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {onRemoveRow && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onRemoveRow(rowIndex)}
                        className="h-8 w-8 text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      
      {onAddRow && (
        <div className="flex justify-start mt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onAddRow}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Row
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditableGrid;
