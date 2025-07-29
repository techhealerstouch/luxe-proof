// components/forms/Step6Form.tsx
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";

type Step6FormProps = {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onBack: () => void;
  step: number;
};

export function Step6Form({ form, onSubmit, onBack, step }: Step6FormProps) {
  const { control, handleSubmit, watch, setValue } = form;

  const decorativeFinishing = watch("decorative_finishing") || [];

  const handleCheckboxChange = (value: string) => {
    const current = new Set(decorativeFinishing);
    if (current.has(value)) {
      current.delete(value);
    } else {
      current.add(value);
    }
    setValue("decorative_finishing", Array.from(current));
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Movement Caliber Number */}
        <FormField
          name="movement_caliber_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Movement Caliber Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter caliber number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Engraving Quality */}
        <FormField
          name="engraving_quality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Engraving Quality</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sharp">Sharp</SelectItem>
                    <SelectItem value="engraved">Engraved</SelectItem>
                    <SelectItem value="missing">Missing</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Decorative Finishing Present */}
        <FormItem>
          <FormLabel>Decorative Finishing Present?</FormLabel>
          <div className="space-y-2">
            {["Côtes de Genève", "Perlage"].map((label) => (
              <FormField
                key={label}
                name="decorative_finishing"
                render={() => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={decorativeFinishing?.includes(label)}
                        onCheckedChange={() => handleCheckboxChange(label)}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{label}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </FormItem>

        {/* Other Decorative Finishing */}
        <FormField
          name="decorative_finishing_other"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other (Decorative Finishing)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter other decorations" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Purple Reversing Wheels */}
        <FormField
          name="purple_reversing_wheels"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purple Reversing Wheels</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
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

        {/* Blue Parachrom Hairspring */}
        <FormField
          name="blue_parachrom_hairspring"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blue Parachrom Hairspring</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
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
