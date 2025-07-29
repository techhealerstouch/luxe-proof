// components/forms/Step8Form.tsx
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
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";

type Step8FormProps = {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onBack: () => void;
  step: number;
};

export function Step8Form({ form, onSubmit, onBack, step }: Step8FormProps) {
  const { control, handleSubmit } = form;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Authenticity Verdict */}
        <FormField
          name="authenticity_verdict"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Authenticity Verdict</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select authenticity verdict" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="genuine">Genuine</SelectItem>
                  <SelectItem value="counterfeit">Counterfeit</SelectItem>
                  <SelectItem value="genuine_with_aftermarket_parts">
                    Genuine with Aftermarket Parts
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Component Grading */}
        {["case", "bracelet", "dial", "bezel", "crystal"].map((part) => (
          <FormField
            key={part}
            name={`component_grading.${part}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize">{part}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${part} condition`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="mint">Mint</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {/* Was the watch polished? */}
        <FormField
          name="was_polished"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Was the watch polished?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex space-x-4"
                >
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel>Yes</FormLabel>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel>No</FormLabel>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem value="uncertain" />
                    </FormControl>
                    <FormLabel>Uncertain</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Estimated Year of Production */}
        <FormField
          name="estimated_year_of_production"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Year of Production</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter or auto-calculate"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Final Summary */}
        <FormField
          name="final_summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Final Summary</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your final summary..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="button" variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
