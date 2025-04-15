
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Plus } from "lucide-react";
import { ControlLibraryItem } from "@/types/control-types";

type ControlLibraryDialogProps = {
  onAddFromLibrary: (control: ControlLibraryItem) => void;
  controls: ControlLibraryItem[];
};

const ControlLibraryDialog = ({ onAddFromLibrary, controls }: ControlLibraryDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredControls, setFilteredControls] = useState(controls);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = controls.filter(
      control => 
        control.name.toLowerCase().includes(term.toLowerCase()) ||
        control.id.toLowerCase().includes(term.toLowerCase()) ||
        control.category.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredControls(filtered);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-1"
        >
          <Search className="h-4 w-4" /> Control Library
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Control Library</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search controls..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                onClick={() => handleSearch("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">ID</th>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">Control Name</th>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">Category</th>
                  <th className="px-4 py-2 text-center font-medium text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredControls.map((control) => (
                  <tr key={control.id}>
                    <td className="px-4 py-3 font-mono text-xs">{control.id}</td>
                    <td className="px-4 py-3">{control.name}</td>
                    <td className="px-4 py-3 capitalize">{control.category}</td>
                    <td className="px-4 py-3 text-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8"
                        onClick={() => onAddFromLibrary(control)}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredControls.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-center text-slate-500">
                      No controls found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ControlLibraryDialog;
