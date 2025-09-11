// components/forms/Step3Form.tsx
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

type Step3FormProps = {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onBack: () => void;
};

export function Step3Form({ form, onSubmit, onBack }: Step3FormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Case Material Verified */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="case_material_verified"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Case Material Verified
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

        {/* Case Weight Feel */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="case_weight_feel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Case Weight Feel
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="text-sm mt-3">
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
                <div className="text-xs text-gray-500 mt-1">
                  Current value: {field.value || "Not selected"}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Finishing Transitions */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="finishing_transitions"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Finishing Transitions
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="text-sm mt-3">
                      <SelectValue placeholder="Select transition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sharp">Sharp</SelectItem>
                      <SelectItem value="Soft">Soft</SelectItem>
                      <SelectItem value="Unclear">Unclear</SelectItem>
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

        {/* Bezel Action */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="bezel_action"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Bezel Action
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="text-sm mt-3">
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
                <div className="text-xs text-gray-500 mt-1">
                  Current value: {field.value || "Not selected"}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Crystal Type */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="crystal_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Crystal Type
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="text-sm mt-3">
                      <SelectValue placeholder="Select crystal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sapphire">Sapphire</SelectItem>
                      <SelectItem value="Mineral">Mineral</SelectItem>
                      <SelectItem value="Acrylic">Acrylic</SelectItem>
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
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="laser_etched_crown"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Laser-etched crown found?
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
        {/* Crown Logo Sharpness */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="crown_logo_sharpness"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Crown Logo Sharpness
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="text-sm mt-3">
                      <SelectValue placeholder="Select sharpness" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sharp">Sharp</SelectItem>
                      <SelectItem value="Fuzzy">Fuzzy</SelectItem>
                      <SelectItem value="Worn">Worn</SelectItem>
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

        {/* Notes */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="case_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold mb-2 block">
                  Case, Bezel & Crystal Notes
                </FormLabel>
                <p className="text-xs text-gray-600 mb-3">
                  Provide detailed analysis of the case construction, bezel
                  functionality, crystal quality, and any observations about
                  authenticity markers.
                </p>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
                    className="resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
