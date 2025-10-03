// components/forms/Step6Form.tsx
"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { Camera, FileText, X } from "lucide-react";
import { useState } from "react";
import { FileInput } from "../ui/file-input";

type Step6FormProps = {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onBack: () => void;
  step: number;
  watchData?: any;
};

export function Step6Form({
  form,
  onSubmit,
  onBack,
  step,
  watchData,
}: Step6FormProps) {
  const { watch, setValue } = form;

  const decorativeFinishing = watch("decorative_finishing") ?? [];

  const handleCheckboxChange = (value: string) => {
    const current = new Set(decorativeFinishing);
    if (current.has(value)) {
      current.delete(value);
    } else {
      current.add(value);
    }
    setValue("decorative_finishing", Array.from(current));
  };

  const handleRemoveExistingFile = (fieldName: string, filePath: string) => {
    setFilesToRemove((prev) => [...prev, filePath]);
    form.setValue(fieldName, null);
  };

  console.log("Step 4", watchData);
  const [filesToRemove, setFilesToRemove] = useState<string[]>([]);

  const getExistingFilePath = (fieldName: string): string | null => {
    if (fieldName === "watch_movement_analysis_image_path")
      return watchData?.movement_examination
        ?.watch_movement_analysis_image_path;

    return null;
  };

  const getFileName = (filePath: string): string => {
    return filePath.split("/").pop() || filePath;
  };

  const ExistingFileDisplay = ({
    fieldName,
    field,
  }: {
    fieldName: string;
    field: any;
  }) => {
    const existingPath = getExistingFilePath(fieldName);
    const isRemoved = filesToRemove.includes(existingPath || "");

    if (!existingPath || isRemoved) return null;

    return (
      <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              Current file: {getFileName(existingPath)}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleRemoveExistingFile(fieldName, existingPath)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-blue-700 mt-1">
          Upload a new file to replace this one, or click X to remove it.
        </p>
      </div>
    );
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="watch_movement_analysis_image_path"
          render={({ field }) => {
            const handleFileChange = (newFiles: File[]) => {
              if (newFiles.length > 0) {
                field.onChange(newFiles[0]);
              } else {
                field.onChange(null);
              }
            };

            const getFileInputValue = () => {
              if (!field.value) return [];
              if (field.value instanceof File) {
                return [field.value];
              }
              return [];
            };

            const getDisplayText = () => {
              if (!field.value) return "No file selected";
              if (field.value instanceof File) {
                return field.value.name;
              }
              if (typeof field.value === "string") {
                return field.value.split("/").pop() || field.value;
              }
              return "Unknown file";
            };

            return (
              <FormItem>
                {/* Show existing file if it's a string path */}
                {field.value && typeof field.value === "string" && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-red-800">
                      <Camera className="h-4 w-4" />
                      <span>Current file: {getDisplayText()}</span>
                    </div>
                  </div>
                )}

                <ExistingFileDisplay
                  fieldName="watch_movement_analysis_image_path"
                  field={field}
                />

                <FormControl>
                  <FileInput
                    value={getFileInputValue()}
                    onChange={handleFileChange}
                    accept="image/png,image/jpeg,image/jpg"
                    maxSize={2}
                    maxFiles={1}
                    className="border-dashed border-2 border-red-200 hover:border-red-300"
                  />
                </FormControl>

                <div className="text-xs text-gray-500 mt-1">
                  Selected: {getDisplayText()}
                </div>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        {/* Movement Caliber Number */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="movement_caliber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Movement Caliber Number
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Enter caliber number"
                    className="text-sm mt-3"
                  />
                </FormControl>
                <div className="text-xs text-gray-500 mt-1">
                  Current value: {field.value || "Not set"}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Engraving Quality */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="movement_engraving_quality"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Engraving Quality
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger className="text-sm mt-3">
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sharp">Sharp</SelectItem>
                      <SelectItem value="engraved">Engraved</SelectItem>
                      <SelectItem value="missing">Missing</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <div className="text-xs text-gray-500 mt-1">
                  Current value: {field.value || "Not selected"}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Decorative Finishing Present */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormItem>
            <FormLabel className="text-sm font-semibold mb-3 block">
              Decorative Finishing Present?
            </FormLabel>
            <div className="space-y-3">
              {["Côtes de Genève", "Perlage"].map((label) => (
                <FormField
                  key={label}
                  name="decorative_finishing"
                  render={() => (
                    <FormItem className="flex items-center space-x-2 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <Checkbox
                          checked={
                            Array.isArray(decorativeFinishing) &&
                            decorativeFinishing.includes(label)
                          }
                          onCheckedChange={() => handleCheckboxChange(label)}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer flex-1">
                        {label}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Current value:{" "}
              {decorativeFinishing.length > 0
                ? decorativeFinishing.join(", ")
                : "None selected"}
            </div>
          </FormItem>
        </div>

        {/* Other Decorative Finishing */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="movement_other"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Other (Decorative Finishing)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Enter other decorations"
                    className="text-sm mt-3"
                  />
                </FormControl>
                <div className="text-xs text-gray-500 mt-1">
                  Current value: {field.value || "Not set"}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Purple Reversing Wheels */}

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="has_purple_reversing_wheels"
            render={({ field }) => {
              console.log("Field value:", field.value);
              return (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Purple Reversing Wheels
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      value={
                        field.value === true
                          ? "true"
                          : field.value === false
                          ? "false"
                          : ""
                      }
                      className="grid grid-cols-2 gap-3 mt-3"
                    >
                      <div className="flex items-center space-x-2 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors">
                        <FormControl>
                          <RadioGroupItem
                            value="true"
                            className="text-green-600"
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer flex-1">
                          Yes
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors">
                        <FormControl>
                          <RadioGroupItem
                            value="false"
                            className="text-red-600"
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer flex-1">
                          No
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <div className="text-xs text-gray-500 mt-1">
                    Current value:{" "}
                    {field.value === true
                      ? "Yes"
                      : field.value === false
                      ? "No"
                      : "Not selected"}
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        {/* Blue Parachrom Hairspring */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="has_blue_parachrom_hairspring"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Blue Parachrom Hairspring
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === "true")}
                    value={
                      field.value === true
                        ? "true"
                        : field.value === false
                        ? "false"
                        : ""
                    }
                    className="grid grid-cols-2 gap-3 mt-3"
                  >
                    <div className="flex items-center space-x-2 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <RadioGroupItem
                          value="true"
                          className="text-green-600"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer flex-1">
                        Yes
                      </FormLabel>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <RadioGroupItem
                          value="false"
                          className="text-red-600"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer flex-1">
                        No
                      </FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
                <div className="text-xs text-gray-500 mt-1">
                  Current value:{" "}
                  {field.value === true
                    ? "Yes"
                    : field.value === false
                    ? "No"
                    : "Not selected"}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Notes */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="movement_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold mb-2 block">
                  Movement Examination Notes
                </FormLabel>
                <p className="text-xs text-gray-600 mb-3">
                  Provide detailed analysis of the movement finishing,
                  decorative elements, component quality, and any observations
                  about authenticity markers.
                </p>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
                    className="resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Example: Movement shows proper Côtes de Genève finishing on rotor, purple reversing wheels present, blue Parachrom hairspring visible, engraving quality is sharp and consistent..."
                  />
                </FormControl>
                <div className="flex justify-between mt-2">
                  <FormMessage />
                  <span className="text-xs text-gray-400">
                    {field.value?.length || 0} characters
                  </span>
                </div>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
