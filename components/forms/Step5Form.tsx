// components/forms/Step5Form.tsx
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

type Step5FormProps = {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onBack: () => void;
  step: number;
};

export function Step5Form({ form, onSubmit, onBack, step }: Step5FormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Bracelet Link Type */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="bracelet_link_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Bracelet Link Type
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger className="text-sm mt-3">
                      <SelectValue placeholder="Select link type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="hollow">Hollow</SelectItem>
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

        {/* Connection Type */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="connection_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Connection Type
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger className="text-sm mt-3">
                      <SelectValue placeholder="Select connection type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="screws">Screws</SelectItem>
                      <SelectItem value="pins">Pins</SelectItem>
                      <SelectItem value="fake_screws">Fake Screws</SelectItem>
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

        {/* Clasp Action */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="clasp_action"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Clasp Action
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger className="text-sm mt-3">
                      <SelectValue placeholder="Select clasp action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smooth_click">Smooth click</SelectItem>
                      <SelectItem value="loose">Loose</SelectItem>
                      <SelectItem value="stiff">Stiff</SelectItem>
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

        {/* Micro-adjustment System Functioning */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="micro_adjustment_functioning"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Micro-adjustment System Functioning?
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

        {/* Clasp Engravings */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="clasp_engravings"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Clasp Engravings
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger className="text-sm mt-3">
                      <SelectValue placeholder="Select engraving type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clean">Clean</SelectItem>
                      <SelectItem value="shallow">Shallow</SelectItem>
                      <SelectItem value="uneven">Uneven</SelectItem>
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
            name="bracelet_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold mb-2 block">
                  Bracelet/Strap & Clasp Notes
                </FormLabel>
                <p className="text-xs text-gray-600 mb-3">
                  Provide detailed analysis of the bracelet construction, link
                  quality, clasp mechanism, and any observations about
                  authenticity markers.
                </p>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
                    className="resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Example: Bracelet links are solid with proper weight, connections use genuine screws not pins, clasp clicks smoothly with no play, micro-adjustment system functions properly..."
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
