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
  const { control, handleSubmit } = form;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Bracelet Link Type */}
        <FormField
          name="bracelet_link_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bracelet Link Type</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select link type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="hollow">Hollow</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Connection Type */}
        <FormField
          name="connection_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Connection Type</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select connection type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="screws">Screws</SelectItem>
                    <SelectItem value="pins">Pins</SelectItem>
                    <SelectItem value="fake_screws">Fake Screws</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Clasp Action */}
        <FormField
          name="clasp_action"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clasp Action</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select clasp action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smooth_click">Smooth click</SelectItem>
                    <SelectItem value="loose">Loose</SelectItem>
                    <SelectItem value="stiff">Stiff</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Micro-adjustment System Functioning */}
        <FormField
          name="micro_adjustment_function"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Micro-adjustment System Functioning?</FormLabel>
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

        {/* Clasp Engravings */}
        <FormField
          name="clasp_engravings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clasp Engravings</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select engraving type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clean">Clean</SelectItem>
                    <SelectItem value="shallow">Shallow</SelectItem>
                    <SelectItem value="uneven">Uneven</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          name="notes"
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

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            type="button"
            className="font-medium"
            size="sm"
            onClick={onBack}
            disabled={step === 0}
          >
            Back
          </Button>
          <Button type="submit" size="sm" className="font-medium">
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
}
