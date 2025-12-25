import { useRef, useState } from "react";
import { Upload, X, Check, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadCardProps {
  label: string;
  description: string;
  icon: React.ReactNode;
  onImageSelect: (file: File | null) => void;
  selectedFile: File | null;
}

const ImageUploadCard = ({
  label,
  description,
  icon,
  onImageSelect,
  selectedFile,
}: ImageUploadCardProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onImageSelect(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "relative group cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300",
        "bg-card gradient-card overflow-hidden",
        isDragging
          ? "border-primary bg-accent scale-[1.02]"
          : selectedFile
          ? "border-primary/50 shadow-card"
          : "border-border hover:border-primary/50 hover:shadow-soft"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative aspect-[4/5]">
          <img
            src={preview}
            alt={label}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
          
          {/* Success indicator */}
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg animate-fade-in">
            <Check className="w-4 h-4 text-primary-foreground" />
          </div>

          {/* Remove button */}
          <button
            onClick={clearImage}
            className="absolute top-3 left-3 w-8 h-8 rounded-full bg-destructive/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-destructive"
          >
            <X className="w-4 h-4 text-destructive-foreground" />
          </button>

          {/* Label overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-primary-foreground font-semibold text-sm">
              {label}
            </p>
            <p className="text-primary-foreground/80 text-xs mt-0.5">
              Click to change
            </p>
          </div>
        </div>
      ) : (
        <div className="aspect-[4/5] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <h3 className="font-display font-semibold text-foreground mb-1">
            {label}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Upload className="w-3.5 h-3.5" />
            <span>Drop or click to upload</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadCard;
