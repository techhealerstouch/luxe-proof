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

import { z } from "zod";

export const Step7Schema = z.object({
  rate_seconds_per_day: z.string().min(1, "Rate is required"),
  amplitude_degrees: z.string().min(1, "Amplitude is required"),
  beat_error_ms: z.string().min(1, "Beat error is required"),
  power_reserve_test_result: z
    .string()
    .min(1, "Power reserve result is required"),
  time_setting_works: z.enum(["yes", "no"]),
  date_change_works: z.enum(["yes", "no"]),
  chronograph_works: z.enum(["yes", "no", "na"]),
  performance_notes: z.string().optional(),
});

export type Step7FormValues = z.infer<typeof Step7Schema>;

// Default values to ensure all fields start as controlled
export const Step7DefaultValues: Step7FormValues = {
  rate_seconds_per_day: "",
  amplitude_degrees: "",
  beat_error_ms: "",
  power_reserve_test_result: "",
  time_setting_works: "yes",
  date_change_works: "yes",
  chronograph_works: "na",
  performance_notes: "",
};

type Step7FormProps = {
  form: UseFormReturn<Step7FormValues>;
  onSubmit: (data: Step7FormValues) => void;
  onBack: () => void;
  step: number;
};

export function Step7Form({ form, onSubmit, onBack }: Step7FormProps) {
  const { handleSubmit } = form;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Timegrapher Results */}
        <FormField
          name="rate_seconds_per_day"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate (seconds/day)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  value={field.value || ""} // Ensure value is never undefined
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="amplitude_degrees"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amplitude (degrees)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  value={field.value || ""} // Ensure value is never undefined
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="beat_error_ms"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beat Error (ms)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  value={field.value || ""} // Ensure value is never undefined
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="power_reserve_test_result"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Power Reserve Test Result</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter hours or result"
                  {...field}
                  value={field.value || ""} // Ensure value is never undefined
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Functionality Checks */}
        <FormField
          name="time_setting_works"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Setting Works?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || "yes"} // Provide default value
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel>Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel>No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="date_change_works"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Change Works?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || "yes"} // Provide default value
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel>Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel>No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="chronograph_works"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chronograph Works?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || "na"} // Provide default value
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel>Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel>No</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="na" />
                    </FormControl>
                    <FormLabel>N/A</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          name="performance_notes"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter additional notes..."
                  {...field}
                  value={field.value || ""} // Ensure value is never undefined
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button type="button" variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
}
