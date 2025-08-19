"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

type Step7FormProps = {
  form: UseFormReturn;
  onSubmit: (data: any) => void;
  onBack: () => void;
  step: number;
};

export function Step7Form({ form, onSubmit }: Step7FormProps) {
  const { handleSubmit } = form;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Rate */}
        <FormField
          name="rate_seconds_per_day"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate (seconds/day)</FormLabel>
              <FormControl>
                <Input type="text" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amplitude */}
        <FormField
          name="amplitude_degrees"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amplitude (degrees)</FormLabel>
              <FormControl>
                <Input type="text" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Beat Error */}
        <FormField
          name="beat_error_ms"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beat Error (ms)</FormLabel>
              <FormControl>
                <Input type="text" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Power Reserve */}
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
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Time Setting Works */}
        <FormField
          name="time_setting_works"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Setting Works?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="1" />
                    </FormControl>
                    <FormLabel>Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="0" />
                    </FormControl>
                    <FormLabel>No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Change Works */}
        <FormField
          name="date_change_works"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Change Works?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="1" />
                    </FormControl>
                    <FormLabel>Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="0" />
                    </FormControl>
                    <FormLabel>No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Chronograph Works */}
        <FormField
          name="chronograph_works"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chronograph Works?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || ""}
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
                      <RadioGroupItem value="n/a" />
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
                  value={field.value || ""}
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
