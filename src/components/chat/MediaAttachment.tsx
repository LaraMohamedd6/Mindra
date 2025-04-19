
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Image, X } from "lucide-react";

interface MediaAttachmentProps {
  onAttach: (file: File) => void;
  onRemove: () => void;
  preview?: string;
}

export function MediaAttachment({ onAttach, onRemove, preview }: MediaAttachmentProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      onAttach(file);
    }
  };

  return (
    <div 
      className={`relative rounded-lg border-2 border-dashed p-4 transition-colors ${
        isDragging ? "border-zenSage bg-zenMint/20" : "border-gray-200"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {preview ? (
        <div className="relative">
          <img src={preview} alt="Preview" className="max-h-32 rounded" />
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-0 right-0 text-gray-500 hover:text-red-500"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <Image className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-1 text-sm text-gray-500">
            Drop an image here or click to upload
          </p>
        </div>
      )}
      
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={(e) => e.target.files?.[0] && onAttach(e.target.files[0])}
        accept="image/*"
      />
    </div>
  );
}
