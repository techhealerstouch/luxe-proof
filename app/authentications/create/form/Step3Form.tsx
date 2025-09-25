// components/forms/Step3Form.tsx
"use client";
import { useState, useEffect, useRef } from "react";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { Camera, X } from "lucide-react";
import { FileInput } from "@/components/ui/file-input";

type Step3FormProps = {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onBack: () => void;
  step: number;
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
export function Step3Form({ form, onSubmit, onBack, step }: Step3FormProps) {
  const { control, handleSubmit } = form;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Watch Case,Bezel and Crystal
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Upload clear, high-quality images of the watch from different angles
            (PNG or JPG only, max 2MB each).
          </p>

          {/* Front View */}
          <FormField
            name="watch_product_case_analysis_image"
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
        {/* Case Material Verified */}
        <FormField
          name="case_material_verified"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Case Material Verified</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
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

        {/* Case Weight Feel */}
        <FormField
          name="case_weight_feel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Case Weight Feel</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select weight feel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Balanced & solid">
                      Balanced & solid
                    </SelectItem>
                    <SelectItem value="Light">Light</SelectItem>
                    <SelectItem value="Inconsistent">Inconsistent</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Finishing Transitions */}
        <FormField
          name="finishing_transitions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Finishing Transitions</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sharp">Sharp</SelectItem>
                    <SelectItem value="Soft">Soft</SelectItem>
                    <SelectItem value="Unclear">Unclear</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bezel Action */}
        <FormField
          name="bezel_action"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bezel Action</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bezel action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Precise clicks">
                      Precise clicks
                    </SelectItem>
                    <SelectItem value="Loose">Loose</SelectItem>
                    <SelectItem value="No rotation">No rotation</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Crystal Type */}
        <FormField
          name="crystal_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Crystal Type</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crystal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sapphire">Sapphire</SelectItem>
                    <SelectItem value="Mineral">Mineral</SelectItem>
                    <SelectItem value="Acrylic">Acrylic</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Laser-etched Crown */}
        <FormField
          name="laser_etched_crown"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Laser-etched crown found?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
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

        {/* Crown Logo Sharpness */}
        <FormField
          name="crown_logo_sharpness"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Crown Logo Sharpness</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sharpness" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sharp">Sharp</SelectItem>
                    <SelectItem value="Fuzzy">Fuzzy</SelectItem>
                    <SelectItem value="Worn">Worn</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          name="case_notes"
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
