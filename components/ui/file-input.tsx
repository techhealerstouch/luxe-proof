"use client";

import { cn } from "@/lib/utils";
import {
  Trash2,
  Upload,
  Image as ImageIcon,
  FileText,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
  Camera,
  FolderOpen,
} from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface FileInputProps {
  className?: string;
  value?: File[];
  onChange?: (files: File[]) => void;
  disabled?: boolean;
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  allowCamera?: boolean;
}

export function FileInput({
  className,
  value = [],
  onChange,
  disabled,
  accept = "image/*,.pdf",
  maxSize = 0.9,
  maxFiles = 10,
  allowCamera = true,
}: FileInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [compressingFiles, setCompressingFiles] = useState<Set<string>>(
    new Set()
  );
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

  const compressImage = async (file: File): Promise<File> => {
    const targetSizeKB = maxSize * 1024;
    const fileSizeMB = file.size / 1024 / 1024;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = document.createElement("img");

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }

          let maxWidth = 1920;
          let maxHeight = 1920;

          if (fileSizeMB > 10) {
            maxWidth = 1280;
            maxHeight = 1280;
          } else if (fileSizeMB > 5) {
            maxWidth = 1600;
            maxHeight = 1600;
          }

          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = (height / width) * maxWidth;
              width = maxWidth;
            } else {
              width = (width / height) * maxHeight;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          let quality = fileSizeMB > 10 ? 0.6 : fileSizeMB > 5 ? 0.7 : 0.8;
          let attempts = 0;
          const maxAttempts = 5;

          const tryCompress = () => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error("Compression failed"));
                  return;
                }

                if (
                  blob.size <= targetSizeKB * 1024 ||
                  attempts >= maxAttempts ||
                  quality <= 0.3
                ) {
                  const originalName = file.name;
                  const nameWithoutExt =
                    originalName.substring(0, originalName.lastIndexOf(".")) ||
                    originalName;
                  const finalName = `${nameWithoutExt}.jpg`;

                  const compressedFile = new File([blob], finalName, {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  });

                  resolve(compressedFile);
                } else {
                  attempts++;
                  quality = Math.max(0.3, quality * 0.8);
                  tryCompress();
                }
              },
              "image/jpeg",
              quality
            );
          };

          tryCompress();
        };

        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const getFileIcon = (file: File) => {
    const fileType = file?.type || "";
    const fileName = file?.name || "";

    if (fileType.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4 text-blue-500" />;
    } else if (
      fileType === "application/pdf" ||
      fileName.toLowerCase().includes(".pdf")
    ) {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return <ImageIcon className="h-4 w-4 text-blue-500" />;
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
    const maxOriginalSize = 50 * 1024 * 1024;
    const maxCompressedSize = maxSize * 1024 * 1024;

    for (const file of files) {
      const fileKey = `${file.name}-${Date.now()}`;
      let processedFile = file;

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

      if (file.size >= maxOriginalSize) {
        newErrors.push(
          `${file.name} is too large (${formatFileSize(
            file.size
          )}). The Maximum original file size is 50MB`
        );
        continue;
      }

      if (file.type.startsWith("image/")) {
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
      } else if (file.size > maxCompressedSize) {
        newErrors.push(
          `${file.name} is too large (${formatFileSize(
            file.size
          )}). Must be under ${formatFileSize(maxCompressedSize)}`
        );
        continue;
      }

      const sanitizedName = sanitizeFileName(processedFile.name);
      const renamedFile = renameFile(processedFile, sanitizedName);
      validFiles.push(renamedFile);
    }

    if (isSingleFile && validFiles.length > 0) {
      return { validFiles: [validFiles[0]], errors: newErrors };
    }

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
    const { validFiles, errors: validationErrors } =
      await validateAndCompressFiles(filesArray);

    setErrors(validationErrors);

    if (validFiles.length > 0) {
      if (isSingleFile) {
        const file = validFiles[0];
        const fileKey = `${file.name}-${Date.now()}`;
        onChange?.(validFiles);
        simulateUpload(file, fileKey);
      } else {
        onChange?.([...(value || []), ...validFiles]);
        validFiles.forEach((file, index) => {
          const fileKey = `${file.name}-${Date.now()}-${index}`;
          simulateUpload(file, fileKey);
        });
      }
    }

    if (inputRef.current) inputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (validationErrors.length > 0) setTimeout(() => setErrors([]), 5000);
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
    if (e.target.files && !disabled) handleFiles(e.target.files);
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
  const isImageAccepted = accept.includes("image");

  return (
    <div className={cn("space-y-4", className)}>
      {(value.length === 0 || !isSingleFile) && (
        <>
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
              (disabled || isCompressing) && "cursor-not-allowed opacity-60"
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              multiple={!isSingleFile}
              disabled={disabled || isCompressing}
              onChange={handleChange}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-3">
              <div
                className={cn(
                  "rounded-full p-3",
                  isDragging ? "bg-blue-100" : "bg-gray-100"
                )}
              >
                {isCompressing ? (
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                ) : (
                  <Upload
                    className={cn(
                      "h-8 w-8",
                      isDragging ? "text-blue-600" : "text-gray-400"
                    )}
                  />
                )}
              </div>

              <div className="space-y-1">
                {isCompressing ? (
                  <p className="text-sm font-medium text-blue-600">
                    Compressing image...
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-medium">
                      <span className="text-blue-600 hover:text-blue-800">
                        Click to upload
                      </span>
                      <span className="text-gray-500"> or drag and drop</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      {accept.includes("image") && "Images"}
                      {accept.includes("image") &&
                        accept.includes(".pdf") &&
                        " & "}
                      {accept.includes(".pdf") && "PDF"}
                      {isSingleFile
                        ? ` up to ${maxSize}MB`
                        : ` up to ${maxSize}MB each (max ${maxFiles})`}
                      {accept.includes("image") && (
                        <span className="block mt-1">
                          Large images auto-compressed to under{" "}
                          {Math.round(maxSize * 1024)}KB
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

          {allowCamera && isImageAccepted && (
            <div className="grid grid-cols-2 gap-3">
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                multiple={!isSingleFile}
                disabled={disabled || isCompressing}
                onChange={handleChange}
                className="hidden"
              />

              <Button
                type="button"
                variant="outline"
                onClick={() => cameraInputRef.current?.click()}
                disabled={disabled || isCompressing}
                className="w-full"
              >
                <Camera className="h-4 w-4 mr-2" />
                Open Camera
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => inputRef.current?.click()}
                disabled={disabled || isCompressing}
                className="w-full"
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
          )}
        </>
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
                className="h-6 w-6 p-0"
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
                    "flex items-center gap-3 p-3 rounded-lg border",
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
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
