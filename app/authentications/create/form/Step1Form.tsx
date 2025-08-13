// components/forms/Step0Form.tsx
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { FileInput } from "@/components/ui/file-input"; // Adjust if needed
import { UseFormReturn } from "react-hook-form";

type Step1FormProps = {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onBack: () => void;
  step: number;
};

export function Step1Form({ form, onSubmit, onBack, step }: Step1FormProps) {
  const { control, handleSubmit } = form;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-y-4">
        <FormField
          name="warranty_card"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload warranty card *</FormLabel>
              <FormControl>
                <FileInput
                  value={field.value}
                  onChange={(newFiles: File[]) => field.onChange(newFiles)}
                  accept="image/*,.pdf"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="purchase_receipts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload purchase receipts *</FormLabel>
              <FormControl>
                <FileInput
                  value={field.value}
                  onChange={(newFiles: File[]) => field.onChange(newFiles)}
                  accept="image/*,.pdf"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="service_records"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload service records</FormLabel>
              <FormControl>
                <FileInput
                  value={field.value}
                  onChange={(newFiles: File[]) => field.onChange(newFiles)}
                  accept="image/*,.pdf"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="authorized_dealer"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2 rounded-md border p-4">
              <FormLabel>Is the dealer an authorized dealer? *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === "true")}
                  value={field.value === true ? "true" : "false"}
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="true" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="false" />
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
          name="warranty_card_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Notes on warranty card (font, NFC check, etc.) *
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={5}
                  className="resize-none"
                  placeholder="Please provide detailed notes about the warranty card..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="service_history_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Notes on service history (replacement parts, authorized center?)
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={5}
                  className="resize-none"
                  placeholder="Optional: Add notes about service history..."
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
