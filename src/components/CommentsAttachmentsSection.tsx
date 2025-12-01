
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FileIcon, Paperclip, Trash2, Upload, MessageSquare } from "lucide-react";
import { useForm } from "@/contexts/FormContext";
import { SectionHeader } from "@/components/collaboration/SectionHeader";

type Attachment = {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadDate: string;
};

const CommentsAttachmentsSection = () => {
  const [comment, setComment] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const { updateForm } = useForm();

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    updateForm({ comments: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newAttachments: Attachment[] = [];
      
      Array.from(e.target.files).forEach((file, index) => {
        const fileSize = (file.size / 1024).toFixed(2) + " KB";
        const today = new Date().toISOString().split('T')[0];
        
        newAttachments.push({
          id: (attachments.length + index + 1).toString(),
          name: file.name,
          size: fileSize,
          type: file.type,
          uploadDate: today
        });
      });
      
      setAttachments([...attachments, ...newAttachments]);
      updateForm({ attachments: [...attachments, ...newAttachments] });
    }
  };

  const handleRemoveAttachment = (id: string) => {
    const updatedAttachments = attachments.filter(attachment => attachment.id !== id);
    setAttachments(updatedAttachments);
    updateForm({ attachments: updatedAttachments });
  };

  return (
    <div className="space-y-8">
      <SectionHeader 
        title="Additional Details" 
        sectionId="additional"
        icon={<MessageSquare className="h-5 w-5 text-slate-600" />}
      />
      
      <div>
        <h2 className="text-xl font-medium text-slate-800 mb-4">Comments</h2>
        <Textarea
          value={comment}
          onChange={handleCommentChange}
          placeholder="Add any additional comments or notes related to this risk assessment..."
          className="min-h-[150px]"
        />
      </div>
      
      <Separator />
      
      <div>
        <h2 className="text-xl font-medium text-slate-800 mb-4">Attachments</h2>
        
        <div className="mb-6">
          <Label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
            Upload Files
          </Label>
          <div className="flex items-center gap-4">
            <Label 
              htmlFor="file-upload" 
              className="cursor-pointer relative border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-blue-500 transition-colors flex-1"
            >
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <div className="flex flex-col items-center">
                <span className="text-sm font-medium text-gray-700">Drop files here or click to upload</span>
                <span className="text-xs text-gray-500 mt-1">Upload any relevant documents</span>
              </div>
              <Input 
                id="file-upload" 
                type="file" 
                multiple 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                onChange={handleFileUpload}
              />
            </Label>
          </div>
        </div>
        
        {attachments.length > 0 && (
          <div className="border rounded-md overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h3 className="text-sm font-medium text-gray-700">Uploaded Files</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {attachments.map((file) => (
                <li key={file.id} className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-gray-100 text-gray-500">
                      <FileIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.size} • {file.uploadDate}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAttachment(file.id)}
                    className="h-8 w-8 text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsAttachmentsSection;
