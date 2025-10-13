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
  Loader2,
} from "lucide-react";
import * as React from "react";
import { Button } from "./button";
import { Progress } from "@/components/ui/progress";
import imageCompression from "browser-image-compression";

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
  maxSize = 0.5, // 500KB default
  maxFiles = 10,
}: FileInputProps) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<{
    [key: string]: number;
  }>({});
  const [uploadingFiles, setUploadingFiles] = React.useState<Set<string>>(
    new Set()
  );
  const [compressingFiles, setCompressingFiles] = React.useState<Set<string>>(
    new Set()
  );
  const [errors, setErrors] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isSingleFile = maxFiles === 1;

  const sanitizeFileName = (fileName: string): string => {
    return fileName.replace(/\s+/g, "");
  };

  const renameFile = (file: File, newName: string): File => {
    return new File([file], newName, {
      type: file.type,
      lastModified: file.lastModified,
    });
  };

  // Compress image using browser-image-compression
  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 0.7, // Target 700KB
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: 0.8,
      onProgress: (progress: number) => {
        console.log(`Compressing ${file.name}: ${progress}%`);
      },
    };

    try {
      const compressedFile = await imageCompression(file, options);
      console.log(
        `Compressed ${file.name} from ${formatFileSize(
          file.size
        )} to ${formatFileSize(compressedFile.size)}`
      );

      // Preserve original filename
      return new File([compressedFile], file.name, {
        type: compressedFile.type,
        lastModified: Date.now(),
      });
    } catch (error) {
      console.error("Compression error:", error);
      throw error;
    }
  };

  const getFileIcon = (file: File) => {
    const fileType = file?.type || "";
    const fileName = file?.name || "";

    if (fileType.startsWith("image/")) {
      return <Image className="h-4 w-4 text-blue-500" />;
    } else if (fileType === "application/pdf") {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else if (fileName.toLowerCase().includes(".pdf")) {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
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

  const validateAndCompressFiles = async (
    files: File[]
  ): Promise<{ validFiles: File[]; errors: string[] }> => {
    const validFiles: File[] = [];
    const newErrors: string[] = [];
    const maxOriginalSize = 1 * 1024 * 1024; // 1MB - reject files larger than this
    const maxCompressedSize = 0.7 * 1024 * 1024; // 700KB - target compression size

    for (const file of files) {
      const fileKey = `${file.name}-${Date.now()}`;
      let processedFile = file;

      // Check file type first
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
        continue;
      }

      // Reject files 1MB and above
      if (file.size >= maxOriginalSize) {
        newErrors.push(
          `${file.name} is too large (${formatFileSize(
            file.size
          )}). Maximum file size is 1MB`
        );
        continue;
      }

      // Check if it's an image and needs compression (compress if over 700KB)
      if (file.type.startsWith("image/") && file.size > maxCompressedSize) {
        try {
          setCompressingFiles((prev) => new Set(prev).add(fileKey));
          processedFile = await compressImage(file);
          setCompressingFiles((prev) => {
            const newSet = new Set(prev);
            newSet.delete(fileKey);
            return newSet;
          });
        } catch (error) {
          setCompressingFiles((prev) => {
            const newSet = new Set(prev);
            newSet.delete(fileKey);
            return newSet;
          });
          newErrors.push(`Failed to compress ${file.name}`);
          continue;
        }
      }

      // Check file size after compression (must be under 700KB)
      if (processedFile.size > maxCompressedSize) {
        newErrors.push(
          `${file.name} is too large after compression (${formatFileSize(
            processedFile.size
          )}). Must be under 700KB`
        );
        continue;
      }

      // Rename file to remove spaces
      const sanitizedName = sanitizeFileName(processedFile.name);
      const renamedFile = renameFile(processedFile, sanitizedName);
      validFiles.push(renamedFile);
    }

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

    // First, validate and compress files (don't upload yet)
    const { validFiles, errors: validationErrors } =
      await validateAndCompressFiles(filesArray);

    setErrors(validationErrors);

    // Only after compression is complete, start the upload process
    if (validFiles.length > 0) {
      if (isSingleFile) {
        const file = validFiles[0];
        const fileKey = `${file.name}-${Date.now()}`;

        // Update files first
        onChange?.(validFiles);

        // Then simulate upload
        simulateUpload(file, fileKey);
      } else {
        // Update files first
        onChange?.([...(value || []), ...validFiles]);

        // Then simulate upload for each
        validFiles.forEach((file, index) => {
          const fileKey = `${file.name}-${Date.now()}-${index}`;
          simulateUpload(file, fileKey);
        });
      }
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }

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
    setErrors([]);
  };

  const clearAllFiles = () => {
    onChange?.([]);
    setErrors([]);
    setUploadProgress({});
    setUploadingFiles(new Set());
  };

  const isCompressing = compressingFiles.size > 0;

  return (
    <div className={cn("space-y-4", className)}>
      {(value.length === 0 || !isSingleFile) && (
        <div
          onClick={() =>
            !disabled && !isCompressing && inputRef.current?.click()
          }
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative cursor-pointer rounded-lg border-2 border-dashed px-6 py-8 text-center transition-all duration-200",
            isDragging
              ? "border-blue-400 bg-blue-50 scale-105 shadow-lg"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
            (disabled || isCompressing) &&
              "cursor-not-allowed opacity-60 hover:border-gray-300 hover:bg-transparent"
          )}
          role="button"
          tabIndex={0}
          aria-disabled={disabled || isCompressing}
          aria-label={`Upload ${
            isSingleFile ? "file" : "files"
          }. Accepted formats: ${accept}. Max size: ${maxSize}MB per file.`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={!isSingleFile}
            disabled={disabled || isCompressing}
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
              {isCompressing ? (
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              ) : (
                <Upload
                  className={cn(
                    "h-8 w-8 transition-colors",
                    isDragging ? "text-blue-600" : "text-gray-400"
                  )}
                />
              )}
            </div>

            <div className="space-y-1">
              {isCompressing ? (
                <p className="text-sm font-medium text-blue-600">
                  Compressing images...
                </p>
              ) : (
                <>
                  <p className="text-sm font-medium">
                    <span className="text-blue-600 hover:text-blue-800 transition-colors">
                      Click to upload
                    </span>
                    <span className="text-gray-500"> or drag and drop</span>
                  </p>
                  <p
                    id="file-upload-description"
                    className="text-xs text-gray-400"
                  >
                    {accept.includes("image") && "Images"}
                    {accept.includes("image") &&
                      accept.includes(".pdf") &&
                      " & "}
                    {accept.includes(".pdf") && "PDF"}
                    {isSingleFile
                      ? ` up to ${maxSize}MB`
                      : ` up to ${maxSize}MB each (max ${maxFiles} files)`}
                    {accept.includes("image") && (
                      <span className="block text-gray-400 mt-1">
                        Large images will be auto-compressed
                      </span>
                    )}
                  </p>
                </>
              )}
            </div>
          </div>

          {isDragging && !isCompressing && (
            <div className="absolute inset-0 bg-blue-100 bg-opacity-50 rounded-lg flex items-center justify-center">
              <div className="text-blue-600 font-medium">
                Drop {isSingleFile ? "file" : "files"} here
              </div>
            </div>
          )}
        </div>
      )}

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
        </div>
      )}
    </div>
  );
};

export { FileInput };
