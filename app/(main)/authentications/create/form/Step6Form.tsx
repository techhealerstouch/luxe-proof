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
import { Camera, X } from "lucide-react";
import { FileInput } from "@/components/ui/file-input";
import { useState, useEffect, useRef } from "react";

type Step6FormProps = {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onBack: () => void;
  step: number;
};

export function Step6Form({ form, onSubmit, onBack, step }: Step6FormProps) {
  const { handleSubmit, watch, setValue } = form;

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

  // Image Preview Component
  const ImagePreview = ({
    file,
    onRemove,
  }: {
    file: File | null;
    onRemove: () => void;
  }) => {
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
      if (!file) {
        setPreview(null);
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Cleanup
      return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    if (!file || !preview) return null;

    return (
      <div className="relative mt-3">
        <img
          src={preview}
          alt="Preview"
          className="h-32 w-full rounded-md object-cover"
        />
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="mt-1 text-xs text-gray-500">
          {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </div>
      </div>
    );
  };
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Movement Examination
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Upload clear, high-quality images of the watch from different angles
            (PNG or JPG only, max 2MB each).
          </p>

          {/* Front View */}
          <FormField
            name="watch_movement_analysis_image"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FileInput
                    value={field.value ? [field.value] : []}
                    onChange={(newFiles: File[]) =>
                      field.onChange(newFiles[0] || null)
                    }
                    accept="image/png,image/jpeg,image/jpg"
                    maxSize={2}
                    maxFiles={1}
                    className="border-dashed border-2 border-orange-200 hover:border-orange-300"
                  />
                </FormControl>
                <ImagePreview
                  file={field.value}
                  onRemove={() => field.onChange(null)}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Movement Caliber Number */}
        <FormField
          name="movement_caliber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Movement Caliber Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Enter caliber number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Engraving Quality */}
        <FormField
          name="movement_engraving_quality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Engraving Quality</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sharp">Sharp</SelectItem>
                    <SelectItem value="engraved">Engraved</SelectItem>
                    <SelectItem value="missing">Missing</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Decorative Finishing Present */}
        <FormItem>
          <FormLabel>Decorative Finishing Present?</FormLabel>
          {["Côtes de Genève", "Perlage"].map((label) => (
            <FormField
              key={label}
              name="decorative_finishing"
              render={() => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={
                        Array.isArray(decorativeFinishing) &&
                        decorativeFinishing.includes(label)
                      }
                      onCheckedChange={() => handleCheckboxChange(label)}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{label}</FormLabel>
                </FormItem>
              )}
            />
          ))}
        </FormItem>

        {/* Other Decorative Finishing */}
        <FormField
          name="movement_other"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other (Decorative Finishing)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Enter other decorations"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Purple Reversing Wheels */}
        <FormField
          name="purple_reversing_wheels"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purple Reversing Wheels</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  className="flex gap-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Blue Parachrom Hairspring */}
        <FormField
          name="blue_parachrom_hairspring"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blue Parachrom Hairspring</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  className="flex gap-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          name="movement_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter any additional notes..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
