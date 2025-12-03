
import React, { useState, useEffect, useRef } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Edit, Plus, Trash2, Calendar, Pencil, Sparkles, Loader2, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import CellCommentPopover from "@/components/collaboration/CellCommentPopover";
import { useCellComments } from "@/contexts/CellCommentsContext";

export type EditableGridColumn = {
  field: string;
  header: string;
  width?: string;
  editable?: boolean;
  type?: 'text' | 'number' | 'select' | 'textarea' | 'rating' | 'fileUpload' | 'date';
  options?: { label: string; value: string; className?: string }[];
  className?: string;
  cellClassName?: (value: any) => string;
  render?: (row: any) => React.ReactNode;
  enableAI?: boolean;
  aiType?: 'rating' | 'comment';
  enableComments?: boolean;
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
  className?: string;
  onAIAutofill?: (rowIndex: number, field: string, aiType: 'rating' | 'comment') => Promise<void>;
  aiLoadingCells?: Set<string>;
  sectionId?: string; // For cell comments
  enableCellComments?: boolean;
  isSectionChallenged?: boolean; // Visual highlight when section needs review
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
  className,
  onAIAutofill,
  aiLoadingCells = new Set(),
  sectionId,
  enableCellComments = false,
  isSectionChallenged = false,
}: EditableGridProps) => {
  const cellComments = enableCellComments ? useCellComments() : null;
  
  // Check if a row has unread notifications (user was tagged for review)
  const getRowHasUnreadTag = (rowId: string): boolean => {
    if (!cellComments || !sectionId) return false;
    const unreadNotifications = cellComments.notifications.filter(n => !n.read && n.toUserId === 'current');
    return unreadNotifications.some(n => n.cellKey.startsWith(`${sectionId}-${rowId}-`));
  };
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; field: string } | null>(null);
  const [editValue, setEditValue] = useState<any>('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkEditField, setBulkEditField] = useState<string | null>(null);
  const [bulkEditValue, setBulkEditValue] = useState<any>('');
  const cellRef = useRef<HTMLDivElement>(null);

  const startEditing = (rowIndex: number, field: string, value: any) => {
    // If any rows are selected, trigger bulk edit instead of single cell edit
    if (selectedRows.length > 0) {
      startBulkEdit(field);
    } else {
      setEditingCell({ rowIndex, field });
      setEditValue(value);
    }
  };

  const cancelEditing = () => {
    setEditingCell(null);
  };

  const saveEdit = () => {
    if (!editingCell) return;

    const newData = [...data];
    // Handle nested fields like 'testResults.result'
    if (editingCell.field.includes('.')) {
      const [parentField, childField] = editingCell.field.split('.');
      newData[editingCell.rowIndex] = {
        ...newData[editingCell.rowIndex],
        [parentField]: {
          ...newData[editingCell.rowIndex][parentField] || {},
          [childField]: editValue
        }
      };
    } else {
      newData[editingCell.rowIndex] = {
        ...newData[editingCell.rowIndex],
        [editingCell.field]: editValue,
      };
    }
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
      // Handle nested fields like 'testResults.result'
      if (bulkEditField.includes('.')) {
        const [parentField, childField] = bulkEditField.split('.');
        newData[rowIndex] = {
          ...newData[rowIndex],
          [parentField]: {
            ...newData[rowIndex][parentField] || {},
            [childField]: bulkEditValue
          }
        };
      } else {
        newData[rowIndex] = {
          ...newData[rowIndex],
          [bulkEditField]: bulkEditValue,
        };
      }
    });
    onDataChange(newData);
    cancelBulkEdit();
  };

  const cancelBulkEdit = () => {
    setBulkEditMode(false);
    setBulkEditField(null);
    setBulkEditValue('');
  };

  // Helper function to get value from nested fields
  const getNestedValue = (obj: any, path: string): any => {
    if (!path.includes('.')) return obj[path];
    
    const pathArray = path.split('.');
    let value = obj;
    
    for (const key of pathArray) {
      if (value === undefined || value === null) return undefined;
      value = value[key];
    }
    
    return value;
  };

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
    const value = getNestedValue(rowData, column.field);
    const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.field === column.field;

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
        ) : column.type === 'rating' ? (
          <Select
            value={editValue ? editValue.toString() : ""}
            onValueChange={(val) => setEditValue(val)}
          >
            <SelectTrigger className="w-full h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1" className="text-green-500">Very Low (1)</SelectItem>
              <SelectItem value="2" className="text-yellow-500">Low (2)</SelectItem>
              <SelectItem value="3" className="text-orange-500">Medium (3)</SelectItem>
              <SelectItem value="4" className="text-red-500">High (4)</SelectItem>
              <SelectItem value="5" className="text-red-600 font-semibold">Very High (5)</SelectItem>
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
          ) : column.type === 'date' ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className={`w-full justify-start text-left font-normal ${!editValue && "text-muted-foreground"}`}
                >
                  {editValue ? format(new Date(editValue), "PPP") : <span>Select date</span>}
                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  className="p-3 pointer-events-auto"
                  selected={editValue ? new Date(editValue) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      const formattedDate = format(date, "yyyy-MM-dd");
                      setEditValue(formattedDate);
                      saveEdit();
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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

          {column.type !== 'date' && (
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
          )}
        </div>
      );
    }

    // Generate comment cell key - moved up for all cell types
    const commentCellKey = sectionId ? `${sectionId}-${rowData[keyField]}-${column.field}` : '';
    const hasComments = cellComments && commentCellKey ? cellComments.getCommentsForCell(commentCellKey).length > 0 : false;
    
    const wrapWithComments = (content: React.ReactNode) => {
      if (enableCellComments && sectionId && (column.enableComments !== false)) {
        return (
          <CellCommentPopover
            cellKey={commentCellKey}
            sectionId={sectionId}
            rowId={rowData[keyField]}
            field={column.field}
          >
            <div className={hasComments ? 'ring-1 ring-amber-300 ring-offset-1 rounded' : ''}>
              {content}
            </div>
          </CellCommentPopover>
        );
      }
      return content;
    };

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
      
      const cellKey = `${rowData[keyField]}-${column.field}`;
      const isAILoading = aiLoadingCells.has(cellKey);
      
      const ratingContent = (
        <div className="flex items-center justify-between group">
          <div className={ratingClass}>{label}</div>
          {column.enableAI && onAIAutofill && (
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-all hover:bg-purple-50"
              onClick={(e) => {
                e.stopPropagation();
                onAIAutofill(rowIndex, column.field, column.aiType || 'rating');
              }}
              disabled={isAILoading}
            >
              {isAILoading ? (
                <Loader2 className="h-3 w-3 animate-spin text-purple-500" />
              ) : (
                <Sparkles className="h-3 w-3 text-purple-500" />
              )}
            </Button>
          )}
        </div>
      );
      return wrapWithComments(ratingContent);
    }
    
    if (column.type === 'select' && column.options) {
      const option = column.options.find(opt => opt.value === value?.toString());
      return wrapWithComments(<div>{option?.label || value}</div>);
    }

    if (column.type === 'date' && value) {
      try {
        return <div>{format(new Date(value), "MMM d, yyyy")}</div>;
      } catch (e) {
        return <div>{value}</div>;
      }
    }

    // Handle file upload type
    if (column.type === 'fileUpload') {
      return (
        <div className="flex items-center gap-2">
          {rowData[column.field]?.map((file: string, index: number) => (
            <Badge key={index} variant="secondary">
              File {index + 1}
            </Badge>
          ))}
          <Input 
            type="file" 
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                const newData = [...data];
                newData[rowIndex] = {
                  ...newData[rowIndex],
                  [column.field]: [...(newData[rowIndex][column.field] || []), files[0].name]
                };
                onDataChange(newData);
              }
            }}
          />
        </div>
      );
    }

    const cellClass = column.cellClassName ? column.cellClassName(value) : '';
    const cellKey = `${rowData[keyField]}-${column.field}`;
    const isAILoading = aiLoadingCells.has(cellKey);
    
    // Show pencil icon for editable cells (excluding special types)
    if (column.editable) {
      const editableContent = (
        <div 
          className={`flex items-center justify-between group cursor-pointer hover:bg-slate-50 px-2 py-1 rounded ${cellClass}`}
          onClick={() => startEditing(rowIndex, column.field, value)}
        >
          <span className="flex-1">{value || <span className="text-gray-400">Click to edit</span>}</span>
          <div className="flex items-center gap-1">
            {column.enableAI && onAIAutofill && (
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-all hover:bg-purple-50"
                onClick={(e) => {
                  e.stopPropagation();
                  onAIAutofill(rowIndex, column.field, column.aiType || 'comment');
                }}
                disabled={isAILoading}
              >
                {isAILoading ? (
                  <Loader2 className="h-3 w-3 animate-spin text-purple-500" />
                ) : (
                  <Sparkles className="h-3 w-3 text-purple-500" />
                )}
              </Button>
            )}
            <Pencil className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
        </div>
      );
      return wrapWithComments(editableContent);
    }
    
    // Check if column has custom render function
    if (column.render) {
      return wrapWithComments(<div className={cellClass}>{column.render(rowData)}</div>);
    }
    
    return wrapWithComments(<div className={cellClass}>{value}</div>);
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
        ) : column.type === 'rating' ? (
          <Select
            value={bulkEditValue ? bulkEditValue.toString() : ""}
            onValueChange={(val) => setBulkEditValue(val)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={`Select ${column.header}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1" className="text-green-500">Very Low (1)</SelectItem>
              <SelectItem value="2" className="text-yellow-500">Low (2)</SelectItem>
              <SelectItem value="3" className="text-orange-500">Medium (3)</SelectItem>
              <SelectItem value="4" className="text-red-500">High (4)</SelectItem>
              <SelectItem value="5" className="text-red-600 font-semibold">Very High (5)</SelectItem>
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
      {/* Challenge Warning Banner */}
      {isSectionChallenged && (
        <div className="bg-amber-50 border border-amber-300 rounded-md p-3 flex items-center gap-2 animate-pulse">
          <div className="h-2 w-2 bg-amber-500 rounded-full" />
          <span className="text-sm text-amber-800 font-medium">
            This section has been flagged for review. Please address the reviewer's feedback.
          </span>
        </div>
      )}
      
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

      <div className={`rounded-md border ${isSectionChallenged ? 'border-amber-400 ring-2 ring-amber-200' : ''} ${className || ""}`}>
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
              {data.map((row, rowIndex) => {
                const rowId = row[keyField];
                const hasUnreadTag = getRowHasUnreadTag(rowId);
                
                return (
                <TableRow 
                  key={rowId || rowIndex}
                  className={hasUnreadTag ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}
                >
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
                      className={`${column.className} ${column.editable ? 'cursor-pointer' : ''}`}
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
                            const value = getNestedValue(row, editableCol.field);
                            startEditing(rowIndex, editableCol.field, value);
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
                );
              })}
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
