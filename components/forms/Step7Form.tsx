// components/forms/Step7Form.tsx
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
type Step7FormProps = {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onBack: () => void;
  step: number;
};

export function Step7Form({ form, onSubmit, onBack, step }: Step7FormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Rate */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="rate_seconds_per_day"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Rate (seconds/day)
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    value={field.value || ""}
                    className="text-sm mt-3"
                    placeholder="Enter rate in seconds per day"
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

        {/* Amplitude */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="amplitude_degrees"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Amplitude (degrees)
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    value={field.value || ""}
                    className="text-sm mt-3"
                    placeholder="Enter amplitude in degrees"
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

        {/* Beat Error */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="beat_error_ms"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Beat Error (ms)
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    value={field.value || ""}
                    className="text-sm mt-3"
                    placeholder="Enter beat error in milliseconds"
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

        {/* Power Reserve */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="power_reserve_test_result"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Power Reserve Test Result
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter hours or result"
                    {...field}
                    value={field.value || ""}
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

        {/* Time Setting Works */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="time_setting_works"
            render={({ field }) => {
              console.log("Field value:", field.value);
              return (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Time Setting Works?
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
                    Current value:
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
        {/* Date Change Works */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="date_change_works"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Date Change Works?
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
                  Current value:
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

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="chronograph_works"
            render={({ field }) => {
              console.log("Field value:", field.value);
              return (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Chronograph Works?
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || "yes"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="n/a">N/A</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-xs text-gray-500 mt-1">
                    Current value:{" "}
                    {field.value === "yes"
                      ? "Yes"
                      : field.value === "no"
                      ? "No"
                      : field.value === "n/a"
                      ? "N/A"
                      : "Yes (default)"}
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        {/* Notes */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="performance_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold mb-2 block">
                  Performance & Function Notes
                </FormLabel>
                <p className="text-xs text-gray-600 mb-3">
                  Provide detailed analysis of the watch's performance metrics,
                  function testing results, and any observations about timing
                  accuracy.
                </p>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ""}
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
