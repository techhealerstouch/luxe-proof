"use client";

import { cn } from "@/lib/utils";
import {
  FileIcon,
  Trash2,
  Upload,
  Image,
  FileText,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import * as React from "react";
import { Button } from "./button";
import { Progress } from "@/components/ui/progress";

interface FileInputProps {
  className?: string;
  value?: File[];
  onChange?: (files: File[]) => void;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
}

const FileInput = ({
  className,
  value = [],
  onChange,
  disabled,
  accept = "image/*,.pdf",
  maxSize = 10, // 10MB default
  maxFiles = 10,
}: FileInputProps) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<{
    [key: string]: number;
  }>({});
  const [uploadingFiles, setUploadingFiles] = React.useState<Set<string>>(
    new Set()
  );
  const [errors, setErrors] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Determine if this is single file mode
  const isSingleFile = maxFiles === 1;

  const getFileIcon = (file: File) => {
    const fileType = file?.type || "";
    const fileName = file?.name || "";

    if (fileType.startsWith("image/")) {
      return <Image className="h-4 w-4 text-blue-500" />;
    } else if (fileType === "application/pdf") {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else if (fileName.toLowerCase().includes(".pdf")) {
      // Fallback for PDF files that might not have correct MIME type
      return <FileText className="h-4 w-4 text-red-500" />;
    } else if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      // Fallback for image files that might not have correct MIME type
      return <Image className="h-4 w-4 text-blue-500" />;
    } else {
      return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFiles = (
    files: File[]
  ): { validFiles: File[]; errors: string[] } => {
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    files.forEach((file, index) => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        newErrors.push(`${file.name} is too large (max ${maxSize}MB)`);
        return;
      }

      // Check file type
      const acceptedTypes = accept.split(",").map((type) => type.trim());
      const isValidType = acceptedTypes.some((acceptedType) => {
        if (acceptedType.startsWith(".")) {
          return file.name.toLowerCase().endsWith(acceptedType.toLowerCase());
        } else if (acceptedType.includes("*")) {
          const baseType = acceptedType.split("/")[0];
          return file.type.startsWith(baseType);
        } else {
          return file.type === acceptedType;
        }
      });

      if (!isValidType) {
        newErrors.push(`${file.name} is not an accepted file type`);
        return;
      }

      validFiles.push(file);
    });

    // For single file mode, replace existing file
    if (isSingleFile && validFiles.length > 0) {
      return { validFiles: [validFiles[0]], errors: newErrors };
    }

    // Check total file count for multiple file mode
    if (value.length + validFiles.length > maxFiles) {
      newErrors.push(`Maximum ${maxFiles} files allowed`);
      return {
        validFiles: validFiles.slice(0, maxFiles - value.length),
        errors: newErrors,
      };
    }

    return { validFiles, errors: newErrors };
  };

  const simulateUpload = (file: File, fileKey: string): Promise<void> => {
    return new Promise((resolve) => {
      setUploadingFiles((prev) => new Set(prev).add(fileKey));
      setUploadProgress((prev) => ({ ...prev, [fileKey]: 0 }));

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const currentProgress = prev[fileKey] || 0;
          if (currentProgress >= 100) {
            clearInterval(interval);
            // Clean up after upload completes
            setTimeout(() => {
              setUploadProgress((prev) => {
                const newProgress = { ...prev };
                delete newProgress[fileKey];
                return newProgress;
              });
              setUploadingFiles((prev) => {
                const newSet = new Set(prev);
                newSet.delete(fileKey);
                return newSet;
              });
              resolve();
            }, 500);
            return prev;
          }
          return { ...prev, [fileKey]: currentProgress + 20 };
        });
      }, 200);
    });
  };

  const handleFiles = async (files: FileList | File[]) => {
    const filesArray = Array.from(files);
    const { validFiles, errors: validationErrors } = validateFiles(filesArray);

    setErrors(validationErrors);

    if (validFiles.length > 0) {
      // For single file mode, replace the current file immediately
      if (isSingleFile) {
        const file = validFiles[0];
        const fileKey = `${file.name}-${Date.now()}`;

        // Start upload simulation
        simulateUpload(file, fileKey);

        // Update files immediately
        onChange?.(validFiles);
      } else {
        // For multiple files, add them immediately and simulate upload
        onChange?.([...(value || []), ...validFiles]);

        // Simulate upload for each file
        validFiles.forEach((file, index) => {
          const fileKey = `${file.name}-${Date.now()}-${index}`;
          simulateUpload(file, fileKey);
        });
      }
    }

    // Clear input
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    // Clear errors after 5 seconds
    if (validationErrors.length > 0) {
      setTimeout(() => setErrors([]), 5000);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Only set dragging to false if we're leaving the drop zone entirely
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && !disabled) {
      handleFiles(e.target.files);
    }
  };

  const handleRemove = (index: number) => {
    if (isSingleFile) {
      onChange?.([]);
    } else {
      const updatedFiles = [...value];
      updatedFiles.splice(index, 1);
      onChange?.(updatedFiles);
    }
    setErrors([]); // Clear errors when removing files
  };

  const clearAllFiles = () => {
    onChange?.([]);
    setErrors([]);
    setUploadProgress({});
    setUploadingFiles(new Set());
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone - Only show when no files or in multi-file mode */}
      {(value.length === 0 || !isSingleFile) && (
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative cursor-pointer rounded-lg border-2 border-dashed px-6 py-8 text-center transition-all duration-200",
            isDragging
              ? "border-blue-400 bg-blue-50 scale-105 shadow-lg"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
            disabled &&
              "cursor-not-allowed opacity-60 hover:border-gray-300 hover:bg-transparent"
          )}
          role="button"
          tabIndex={0}
          aria-disabled={disabled}
          aria-label={`Upload ${
            isSingleFile ? "file" : "files"
          }. Accepted formats: ${accept}. Max size: ${maxSize}MB per file.`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={!isSingleFile}
            disabled={disabled}
            onChange={handleChange}
            className="hidden"
            aria-describedby="file-upload-description"
          />

          <div className="flex flex-col items-center gap-3">
            <div
              className={cn(
                "rounded-full p-3 transition-colors",
                isDragging ? "bg-blue-100" : "bg-gray-100"
              )}
            >
              <Upload
                className={cn(
                  "h-8 w-8 transition-colors",
                  isDragging ? "text-blue-600" : "text-gray-400"
                )}
              />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">
                <span className="text-blue-600 hover:text-blue-800 transition-colors">
                  Click to upload
                </span>
                <span className="text-gray-500"> or drag and drop</span>
              </p>
              <p id="file-upload-description" className="text-xs text-gray-400">
                {accept.includes("image") && "Images"}
                {accept.includes("image") && accept.includes(".pdf") && " & "}
                {accept.includes(".pdf") && "PDF"}
                {isSingleFile
                  ? ` up to ${maxSize}MB`
                  : ` up to ${maxSize}MB each (max ${maxFiles} files)`}
              </p>
            </div>
          </div>

          {isDragging && (
            <div className="absolute inset-0 bg-blue-100 bg-opacity-50 rounded-lg flex items-center justify-center">
              <div className="text-blue-600 font-medium">
                Drop {isSingleFile ? "file" : "files"} here
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{error}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  setErrors((prev) => prev.filter((_, i) => i !== index))
                }
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* File List */}
      {value.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              {isSingleFile
                ? "Selected File"
                : `Uploaded Files (${value.length}/${maxFiles})`}
            </h4>
            {!isSingleFile && value.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearAllFiles}
                disabled={disabled}
                className="text-red-600 hover:text-red-800 h-auto p-1"
              >
                Clear all
              </Button>
            )}
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {value.map((file, index) => {
              const fileKey = `${file.name}-${Date.now()}-${index}`;
              const progress = uploadProgress[fileKey];
              const isUploading = uploadingFiles.has(fileKey);

              return (
                <div
                  key={`${file.name}-${index}`}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
                    isUploading
                      ? "bg-blue-50 border-blue-200"
                      : "bg-green-50 border-green-200 hover:bg-green-100"
                  )}
                >
                  <div className="flex-shrink-0">{getFileIcon(file)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      {!isUploading && (
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>

                    {isUploading && progress !== undefined && (
                      <div className="mt-2">
                        <Progress value={progress} className="h-1" />
                        <p className="text-xs text-blue-600 mt-1">
                          Uploading... {Math.round(progress)}%
                        </p>
                      </div>
                    )}

                    {!isUploading && (
                      <p className="text-xs text-green-600 mt-1">
                        Upload complete
                      </p>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={disabled || isUploading}
                    onClick={() => handleRemove(index)}
                    className="flex-shrink-0 h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove {file.name}</span>
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Add more files button for single file mode when file is uploaded */}
          {isSingleFile && value.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Replace File
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export { FileInput };
