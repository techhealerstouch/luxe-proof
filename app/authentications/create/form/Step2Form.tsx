// components/forms/Step2Form.tsx
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";

type Step2FormProps = {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onBack: () => void;
  step: number;
};

export function Step2Form({ form, onSubmit, onBack, step }: Step2FormProps) {
  const { control, handleSubmit } = form;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-y-4">
        <FormField
          name="serial_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serial Number *</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="model_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model Number *</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="serial_location"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2 rounded-md">
              <FormLabel>Where was the serial found?</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Between lugs">Between lugs</SelectItem>
                    <SelectItem value="Rehaut">Rehaut</SelectItem>
                    <SelectItem value="Caseback">Caseback</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="match_with_documents"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2 rounded-md border p-4">
              <FormLabel>Match with documents? *</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} value={field.value}>
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

        <FormField
          name="engraving_quality"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2">
              <FormLabel>Engraving Quality</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sharp">Sharp</SelectItem>
                    <SelectItem value="Shallow">Shallow</SelectItem>
                    <SelectItem value="Acid-etched">Acid-etched</SelectItem>
                    <SelectItem value="Dotty">Dotty</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="serial_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes *</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={5}
                  className="resize-none"
                  placeholder="Please provide notes about the serial number..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
